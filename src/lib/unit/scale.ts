import { Matrix3, MatrixHolder } from "../math/matrix";
import { getScalingMat3 } from "../math/matrixImpl";

export class Scale2D implements MatrixHolder {
  private value!: [number, number];
  private _mat3!: Matrix3;

  constructor(x: number, y: number) {
    this.update(x, y);
  }

  get x() {
    return this.value[0];
  }

  get y() {
    return this.value[1];
  }

  /**
   * @returns TranslationMatrix3
   */
  get mat3(): Matrix3 {
    return [...this._mat3];
  }

  update(x: number, y: number) {
    this.value = [x, y];
    this._mat3 = getScalingMat3(this.value);
  }
}
