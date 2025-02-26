export const assertNonNullable = <T>(
  ref: T | null | undefined,
  logString?: string
) => {
  if (ref == null) {
    console.error(`${ref} assertion error.`);
    console.error(`log: ${logString}`);
    throw new Error("AssertError: type is null or undefined.");
  }

  return ref;
};

export const resizeCanvasTo = (
  canvas: HTMLCanvasElement,
  width?: number,
  height?: number
) => {
  const toCssPixelsRatio = window.devicePixelRatio;

  // Render buffer size
  canvas.width = width ?? Math.floor(canvas.clientWidth * toCssPixelsRatio);
  canvas.height = height ?? Math.floor(canvas.clientHeight * toCssPixelsRatio);
};

export const showWebGLInfo = (gl: WebGLRenderingContext) => {
  console.log("=====================================");
  console.log("WebGL environment info");
  console.log("OpenGL Version: " + gl.getParameter(gl.VERSION));
  console.log(
    "Shading Language Version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
  );
  console.log("Vendor: " + gl.getParameter(gl.VENDOR));
  console.log("=====================================");
};

/**
 * Load shader and returns compiled result.
 */
export const createShader = (
  gl: WebGLRenderingContext,
  type: GLenum,
  sourceTxt: string
) => {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error("Error: No available shader in this environment.");
    return null;
  }
  gl.shaderSource(shader, sourceTxt);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Failed to compile shader.
    console.error("Error: Failed to compile shader source.");
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

/**
 * Create program, attach and link shaders to it.
 */
export const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.error("Error: Failed to link program.");
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
};

export const randomInt = (range: number) => {
  return Math.floor(Math.random() * range);
};

export const setRectangle = (
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ]),
    gl.STATIC_DRAW
  );
};

export const setGeometry = (gl: WebGLRenderingContext) => {
  // "F" shape
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
      // 左縦列
      0, 0,
      30, 0,
      0, 150,
      0, 150,
      30, 0,
      30, 150,

      // 上の横棒
      30, 0,
      100, 0,
      30, 30,
      30, 30,
      100, 0,
      100, 30,

      // 下の横棒
      30, 60,
      67, 60,
      30, 90,
      30, 90,
      67, 60,
      67, 90,     
    ]),
    gl.STATIC_DRAW
  );
};
