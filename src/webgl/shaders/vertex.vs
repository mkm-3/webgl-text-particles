attribute vec2 a_startPos;
attribute vec2 a_endPos;
attribute vec3 a_color;

uniform vec2 u_screenSize;
uniform float u_time; // 0.0 → 1.0

varying vec3 v_color;

float easeOutCubic(float t) {
  return 1.0 - pow(1.0 - t, 3.0);
}

void main() {
  float t = easeOutCubic(clamp(u_time, 0.0, 1.0));
  vec2 pos = mix(a_startPos, a_endPos, t);
  
  gl_PointSize = 2.0;
  gl_Position = vec4(
    pos.x / u_screenSize[0], 
    pos.y / u_screenSize[1], 
    0.0, 
    1.0
  );
  v_color = a_color;
}