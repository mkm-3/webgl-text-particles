import { getRotationMat3 } from "../math/matrixImpl";
import { Matrix3, MatrixHolder } from "../math/matrix";

export class Angle implements MatrixHolder {
  private value!: number; /** degree */
  private _mat3!: Matrix3;

  constructor(degree: number) {
    this.update(degree);
  }

  get deg() {
    return this.value;
  }

  /**
   * @returns RotationMatrix3
   */
  get mat3(): Matrix3 {
    return [...this._mat3];
  }

  public update(degree: number) {
    this.value = degree;
    this._mat3 = getRotationMat3(this.deg);
  }

  public static toRadian(degree: number) {
    return (Math.PI * degree) / 180;
  }

  public static toDegree(radian: number) {
    return (radian * 180) / Math.PI;
  }
}
