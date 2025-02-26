import { AnimationController } from "../lib/animation/controller";
import { Position2D } from "../lib/unit/position";
import { Matrix3 } from "../lib/math/matrix";
import { assertNonNullable, createProgram, createShader } from "../utils";
import { ParticleActorBase } from "./ParticleActorBase";

export class WebGLParticleRenderer {
  private particles: ParticleActorBase[];
  private animationController: AnimationController;
  private canvasElem: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;
  private gl: WebGLRenderingContext;
  private buffers: {
    [key: string]: WebGLBuffer;
  };

  constructor(
    particles: ParticleActorBase[],
    animationController: AnimationController,
    canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext
  ) {
    this.particles = particles;
    this.animationController = animationController;
    this.canvasElem = canvas;
    this.canvasCtx = assertNonNullable(
      canvas.getContext("2d"),
      "No available canvas context."
    );
    this.gl = gl;
  }

  /**
   * オリジナルの位置情報を格納するVBOを生成
   */
  private setupPositionBuffer() {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    const positionAttrLoc = this.gl.getAttribLocation(program, "a_position"); // look up where the vertex data needs to go.

    this.gl.vertexAttribPointer(
      positionAttrLoc,
      2 /** size */,
      this.gl.FLOAT /** type */,
      false /**normalize */,
      0 /** stride */,
      0 /** offset */
    );
  }

  public setup(vertexShaderSource: string, fragmentShaderSource: string) {
    // create shader program
    const vertexShader = assertNonNullable(
      createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource),
      "No available vertex shader source."
    );
    const fragmentShader = assertNonNullable(
      createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource),
      "No available fragment shader source."
    );
    const program = assertNonNullable(
      createProgram(this.gl, vertexShader, fragmentShader),
      "No available shader program."
    );
  }

  private createVboData(particleMat3: Matrix3) {}

  public render(): boolean {
    if (this.animationController.isCompleted()) {
      return false;
    }

    const { width: screenW, height: screenH } = this.canvasElem;

    this.canvasCtx.clearRect(0, 0, screenW, screenH);

    const step = this.animationController.update();

    // for - ofは遅い
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      particle.update(step);
      const mat3 = particle.getProjectionMat3(screenW, screenH);
    }

    return true;
  }
}
