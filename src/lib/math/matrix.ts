// prettier-ignore
export type Matrix3 = [
    number, number, number, 
    number, number, number,
    number, number, number
]

export interface MatrixHolder {
  mat3: Matrix3;
  update(...args: unknown[]): void; // この関数を通してのみ値をアップデートする事
}
