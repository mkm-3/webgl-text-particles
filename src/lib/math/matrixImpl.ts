import { Matrix3 } from "./matrix";

export const getRotationMat3 = (rotationDeg: number): Matrix3 => {
  const rad = (Math.PI * rotationDeg) / 180;

  // prettier-ignore
  return [
    Math.cos(rad),  -Math.sin(rad), 0,
    Math.sin(rad),  Math.cos(rad),  0,
    0,              0,              1,
  ];
};

export const getTranslationMat3 = (translate: [number, number]): Matrix3 =>
  // prettier-ignore
  [
    1,            0,            0,
    0,            1,            0,
    translate[0], translate[1], 1,
  ];
export const getScalingMat3 = (scale: [number, number]): Matrix3 =>
  // prettier-ignore
  [
    scale[0], 0,        0,
    0,        scale[1], 0,
    0,        0,        1,
  ];

export const getIdentMat3 = () =>
  // prettier-ignore
  [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ];

export const getProjectionMat3 = (width: number, height: number): Matrix3 =>
  // prettier-ignore
  [
    2 / width, 0,           0,
    0,         -2 / height, 0,
    -1,        1,           1,
  ];

export const multiplyMat3 = (a: Matrix3, b: Matrix3): Matrix3 => {
  if (a.length !== 9) {
    throw new Error("Error: length has to be 9, but " + a.length);
  }
  if (b.length !== 9) {
    throw new Error("Error: length has to be 9, but " + b.length);
  }

  var a00 = a[0 * 3 + 0];
  var a01 = a[0 * 3 + 1];
  var a02 = a[0 * 3 + 2];
  var a10 = a[1 * 3 + 0];
  var a11 = a[1 * 3 + 1];
  var a12 = a[1 * 3 + 2];
  var a20 = a[2 * 3 + 0];
  var a21 = a[2 * 3 + 1];
  var a22 = a[2 * 3 + 2];
  var b00 = b[0 * 3 + 0];
  var b01 = b[0 * 3 + 1];
  var b02 = b[0 * 3 + 2];
  var b10 = b[1 * 3 + 0];
  var b11 = b[1 * 3 + 1];
  var b12 = b[1 * 3 + 2];
  var b20 = b[2 * 3 + 0];
  var b21 = b[2 * 3 + 1];
  var b22 = b[2 * 3 + 2];

  return [
    b00 * a00 + b01 * a10 + b02 * a20,
    b00 * a01 + b01 * a11 + b02 * a21,
    b00 * a02 + b01 * a12 + b02 * a22,
    b10 * a00 + b11 * a10 + b12 * a20,
    b10 * a01 + b11 * a11 + b12 * a21,
    b10 * a02 + b11 * a12 + b12 * a22,
    b20 * a00 + b21 * a10 + b22 * a20,
    b20 * a01 + b21 * a11 + b22 * a21,
    b20 * a02 + b21 * a12 + b22 * a22,
  ];
};
