import { DotActor } from "./components/Dot";
import fragmentShaderSource from "./shaders/shader.fs?raw";
import vertexShaderSource from "./shaders/shader.vs?raw";
import {
  assertNonNullable,
  createProgram,
  createShader,
  resizeCanvasTo,
  showWebGLInfo,
  getRotationMat3,
  getScalingMat3,
  multiplyMat3,
  getTranslationMat3,
  getProjectionMat3,
} from "./utils";

const TEXT_CONTENT = "Welcome to WebGL text particles !!!!";
const FONT_FILL_COLOR_DEFAULT = "#ff5733";

function textToParticles(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  const dots: DotActor[] = [];
  const { width, height } = canvas;

  // const timeline = gsap.timeline({ repeat: -1, yoyo: true });

  const MAX_DIFFUSION_PX = 250;

  for (let i = 0; i < width * height; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    const dotData = context.getImageData(x, y, 1, 1);
    const alpha = dotData.data[3];

    if (alpha === 0) {
      continue;
    }

    const dstX = x + MAX_DIFFUSION_PX * (Math.random() - 0.5);
    const dstY = y + MAX_DIFFUSION_PX * (Math.random() - 0.5);
    const sizePx = 1;
    dots.push(
      new DotActor([x, y], [dstX, dstY], [sizePx, sizePx], alpha / 255)
    );
  }

  return dots;
}

function renderTextContent(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  // const canvas = document.createElement("canvas");
  const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;
  console.log(canvas);
  resizeCanvasTo(canvas, 720, 360);

  const ctx = assertNonNullable(canvas.getContext("2d"));

  ctx.font = "48px serif"; // TODO: フォントの設定
  ctx.fillStyle = FONT_FILL_COLOR_DEFAULT;
  ctx.fillText(TEXT_CONTENT, 10, 50, canvas.width);

  ctx.fillStyle = "#000000";

  return [canvas, ctx];
}

function setGeometry(gl: WebGLRenderingContext, dots: DotActor[]) {
  const bufferSource = new Float32Array();

  gl.bufferData(
    (gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([

    ]))
  );
}

function main() {
  /**
   * create WebGL context
   */
  const [canvas, ctx] = renderTextContent();
  const dots = textToParticles(canvas, ctx);

  const gl = canvas.getContext("webgl"); // webgl version 1 (OpenGL ES 1.0)
  if (!gl) {
    throw new Error("Error: No available shader in this environment.");
  }
  showWebGLInfo(gl);

  // create shader program
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  if (!vertexShader || !fragmentShader) {
    return;
  }

  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) {
    throw new Error("Error: No available shader program.");
  }

  const translation: [number, number] = [150, 150];
  const color: [number, number, number, number] = [
    Math.random(),
    Math.random(),
    Math.random(),
    1,
  ];
  const rotationDeg = 10;
  const scale: [number, number] = [1, 1];

  // create vbo
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  render(gl, {
    program,
    translation,
    color,
    rotationDeg,
    scale,
  });
}

type RenderContext = {
  program: WebGLProgram;
  translation: [number, number];
  color: [number, number, number, number];
  rotationDeg: number;
  scale: [number, number];
};
export function render(
  gl: WebGLRenderingContext,
  { program, translation, color, rotationDeg, scale }: RenderContext
) {
  /**
   * setup for render process
   */
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  // create attribute variables
  const positionAttrLoc = gl.getAttribLocation(program, "a_position"); // look up where the vertex data needs to go.
  const matrixAttrLoc = gl.getAttribLocation(program, "a_matrix");
  const colorAttrLoc = gl.getAttribLocation();
  resizeCanvasTo(gl.canvas as HTMLCanvasElement);

  // create uniform variables
  const colorUniformLoc = assertNonNullable<WebGLUniformLocation>(
    gl.getUniformLocation(program, "u_color")
  );
  const matrixUniformLoc = assertNonNullable<WebGLUniformLocation>(
    gl.getUniformLocation(program, "u_matrix")
  );

  // set webgl configuration
  // clip space -> pixel space
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // activate created shader programs
  gl.useProgram(program);

  // enable attributes used in shaders
  gl.enableVertexAttribArray(positionAttrLoc);

  // upload vertices of rectangle
  // setRectangle(gl, translation[0], translation[1], width, height);

  gl.vertexAttribPointer(
    positionAttrLoc,
    2 /** size */,
    gl.FLOAT /** type */,
    false /**normalize */,
    0 /** stride */,
    0 /** offset */
  );

  // set color
  gl.uniform4fv(colorUniformLoc, color);

  // set translation
  let matrix = getProjectionMat3(gl.canvas.width, gl.canvas.height);
  matrix = multiplyMat3(matrix, getTranslationMat3(translation));
  matrix = multiplyMat3(matrix, getRotationMat3(rotationDeg));
  matrix = multiplyMat3(matrix, getScalingMat3(scale));
  matrix = multiplyMat3(matrix, getTranslationMat3([-50, -75]));

  gl.uniformMatrix3fv(matrixUniformLoc, false, matrix);

  // draw rectangles
  gl.drawArrays(gl.TRIANGLES, 0, 18);
}

window.onload = main;
