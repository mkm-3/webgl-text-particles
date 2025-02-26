import { Angle } from "../lib/unit/angle";
import { Color } from "../lib/unit/color";
import { Position2D } from "../lib/unit/position";
import { Scale2D } from "../lib/unit/scale";
import { Matrix3 } from "../lib/math/matrix";
import { Clone } from "../base/clonable";

// ParticleActorの振る舞いを決定するための情報を保持する
export class ParticleActorState implements Clone {
  readonly pos: Position2D;
  readonly scale: Scale2D;
  readonly color: Color;
  readonly rot: Angle;

  constructor(pos: [number, number], colorHexCode: string, rotDeg: number) {
    this.pos = new Position2D(...pos);
    this.scale = new Scale2D(1.0, 1.0);
    this.color = Color.fromHexCode(colorHexCode);
    this.rot = new Angle(rotDeg);
  }

  clone() {
    return new ParticleActorState(
      [this.pos.x, this.pos.y],
      this.color.getHexCode(),
      this.rot.deg
    );
  }
}

// frame毎のworld座標系のParticleActorの情報を返す
export interface ParticleActorBase {
  init: Readonly<ParticleActorState>;
  current: ParticleActorState;
  dst: Readonly<ParticleActorState>;

  getProjectionMat3(width: number, height: number): Matrix3;

  /**
   * Animationの状態（currentStep）を受け取り，現在の状態を更新する
   * この関数はanimationFrame単位で呼び出される
   */
  update(currentStep: number): void;
}
