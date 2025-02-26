import { Matrix3, MatrixHolder } from "../math/matrix";
import { getTranslationMat3 } from "../math/matrixImpl";

export class Position2D implements MatrixHolder {
  private value!: [number, number];
  private _mat3!: Matrix3;
  private origin: [number, number];

  constructor(x: number, y: number) {
    this.update(x, y);
    this.origin = [x, y];
  }

  get x() {
    return this.value[0];
  }

  get y() {
    return this.value[1];
  }

  get initX() {
    return this.origin[0];
  }

  get initY() {
    return this.origin[1];
  }

  get deltaX() {
    return this.value[0] - this.origin[0];
  }

  get deltaY() {
    return this.value[1] - this.origin[1];
  }

  /**
   * @returns TranslationMatrix3
   */
  get mat3(): Matrix3 {
    return [...this._mat3];
  }

  /**
   * @returns TranslationMatrix3
   */
  update(x: number, y: number) {
    this.value = [x, y];
    this._mat3 = getTranslationMat3(this.value);
  }
}
