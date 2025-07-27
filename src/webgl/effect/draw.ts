import { clamp } from "../../lib/math/range";
export type DrawContext = {
  gl: WebGL2RenderingContext;
  uTimeLoc: WebGLUniformLocation;
  uScreenLoc: WebGLUniformLocation;
  particleCount: number;
  progress: number;
  screenSize: [width: number, height: number];
};

export function draw(drawCtx: DrawContext) {
  const { gl, uTimeLoc, uScreenLoc, particleCount, progress, screenSize } =
    drawCtx;

  gl.uniform1f(uTimeLoc, clamp(0, progress, 1.0));
  gl.uniform2fv(uScreenLoc, screenSize);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, particleCount);
}
