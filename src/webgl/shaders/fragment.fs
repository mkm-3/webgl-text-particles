precision mediump float;
varying vec3 v_color;
void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  if(length(coord) > 0.5) discard;
  gl_FragColor = vec4(v_color, 1.0);
}