import {
  WebGLRenderer,
  OrthographicCamera,
  Scene,
  PlaneGeometry,
  TextureLoader,
  ShaderMaterial,
  MeshBasicMaterial,
  Mesh,
  Vector2,
} from 'three';

// シェーダーソース
import vertexSource from './shaders/shader.vert';
import fragmentSource from './shaders/shader.frag';

export default class Canvas {
  constructor(c) {
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    const container = c.container;
    container.appendChild(this.renderer.domElement);

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, -1);

    this.scene = new Scene();

    const geo = new PlaneGeometry(2, 2, 1, 1);

    this.mouse = new Vector2(0.5, 0.5);
    this.targetPercent = 0.0;

    const loader = new TextureLoader();
    const texture = loader.load('../neko.jpg');

    this.uniforms = {
      uAspect: {
        value: this.w / this.h,
      },
      uTime: {
        value: 0.0,
      },
      uMouse: {
        value: new Vector2(0.5, 0.5),
      },
      uPercent: {
        value: this.targetPercent,
      },
      uFixAspect: {
        value: this.h / this.w,
      },
      uTex: {
        value: texture,
      },
    };

    // uniform変数とシェーダーソースを渡してマテリアルを作成
    const mat = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
    });

    this.mesh = new Mesh(geo, mat);
    this.scene.add(this.mesh);

    this.render();
  }

  render() {
    // 次のフレームを要求
    requestAnimationFrame(() => { this.render(); });

    // ミリ秒から秒に変換
    const sec = performance.now() / 1000;

    // シェーダーに渡す時間を更新
    this.uniforms.uTime.value = sec;

    // シェーダーに渡すマウスを更新
    this.uniforms.uMouse.value.lerp(this.mouse, 0.2);

    // シェーダーに渡す進捗度を更新
    this.uniforms.uPercent.value += (this.targetPercent - this.uniforms.uPercent.value) * 0.1;

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }

  mouseMoved(x, y) {
    this.mouse.x = x / this.w;
    this.mouse.y = 1.0 - (y / this.h);
  }
  mousePressed(x, y) {
    this.mouseMoved(x, y);
    this.targetPercent = 1.;// マウスを押したら進捗度の目標値を大きく
  }
  mouseReleased(x, y) {
    this.mouseMoved(x, y);
    this.targetPercent = 0.0;// マウスを押したら進捗度の目標値をデフォルト値に
  }

}
