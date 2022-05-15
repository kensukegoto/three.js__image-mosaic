import Canvas from './Canvas';

const canvas = new Canvas({
  container: document.getElementById('canvas-container')
});

window.addEventListener('mousemove', e => {
  canvas.mouseMoved(e.clientX, e.clientY);
});

window.addEventListener('mousedown', e => {
  canvas.mousePressed(e.clientX, e.clientY);
});
window.addEventListener('mouseup', e => {
  canvas.mouseReleased(e.clientX, e.clientY);
});