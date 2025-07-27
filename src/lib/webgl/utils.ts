// ユーティリティ: シェーダ作成
export namespace webgl2 {
  export function createShader(
    gl: WebGL2RenderingContext,
    type: number,
    src: string
  ) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || "Shader compile error");
    }
    return shader;
  }

  // プログラムリンク
  export function createProgram(
    gl: WebGL2RenderingContext,
    vsSrcString: string,
    fsSrcString: string
  ) {
    const vs = createShader(gl, gl.VERTEX_SHADER, vsSrcString);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrcString);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || "Program link error");
    }
    return prog;
  }

  export function createAndBindBuffer(
    gl: WebGL2RenderingContext,
    data: Float32Array,
    size: number,
    attribLoc: number
  ) {
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribLoc);
    gl.vertexAttribPointer(attribLoc, size, gl.FLOAT, false, 0, 0);
  }
}
