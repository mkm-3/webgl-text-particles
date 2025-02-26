import { Matrix3 } from "../lib/math/matrix";
import { getProjectionMat3, multiplyMat3 } from "../lib/math/matrixImpl";
import { ParticleActorBase, ParticleActorState } from "./ParticleActorBase";

export class TriangleActor implements ParticleActorBase {
  private _size: [number, number]; // 基準となるサイズ

  init: Readonly<ParticleActorState>;
  current: ParticleActorState;
  dst: Readonly<ParticleActorState>;

  constructor(
    init: Readonly<ParticleActorState>,
    dst: Readonly<ParticleActorState>,
    sizePx: [number, number]
  ) {
    this.init = init;
    this.current = init.clone();
    this.dst = dst;
    this._size = sizePx;
  }

  get size() {
    return [...this._size];
  }

  public update(currentStep: number /** 0 - 1.0 */): void {
    // 差分を計算して次のcurrentを決定する
    // TODO: rotation, scaleも計算する
    this.current.pos.update(
      this.current.pos.x + (this.dst.pos.x - this.init.pos.x) * currentStep,
      this.current.pos.y + (this.dst.pos.y - this.init.pos.y) * currentStep
    );

    // this.current.rot.update(
    //   this.current.rot.deg +
    //     (this.dst.rot.deg - this.init.rot.deg) * currentStep
    // );

    this.current.scale.update(
      this.current.scale.x +
        (this.dst.scale.x - this.init.scale.x) * currentStep,
      this.current.scale.y +
        (this.dst.scale.y - this.init.scale.y) * currentStep
    );
  }

  public getProjectionMat3(width: number, height: number): Matrix3 {
    let matrix = getProjectionMat3(width, height);
    matrix = multiplyMat3(matrix, this.current.pos.mat3);
    matrix = multiplyMat3(matrix, this.current.rot.mat3);
    matrix = multiplyMat3(matrix, this.current.scale.mat3);

    return matrix;
  }
}
