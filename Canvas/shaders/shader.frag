varying vec2 vUv;

uniform float uTime;
uniform float uPercent;
uniform sampler2D uTex;

void main() {
  vec2 uv = vUv;

  float moz = uPercent * 0.02;

  if( moz > 0. ) {// 0では割れないので、if文で保護
    uv = floor( uv / moz ) * moz + ( moz * .5 );
  }

  vec3 color = texture2D( uTex, uv ).rgb;

  gl_FragColor = vec4( color, 1.0 );
}