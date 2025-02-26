import { Color } from "./color";

test("Color.fromHexCode, can parse hexCode without alpha", () => {
  const color = Color.fromHexCode("#000000");

  expect(color.getRawValue()).toEqual([0, 0, 0, 1]);
});

test("Color.fromHexCode, can parse hexCode with alpha", () => {
  const hexAlpha = "B1";
  const color = Color.fromHexCode(`#000000${hexAlpha}`);

  const alpha = parseInt(hexAlpha, 16) / 255;
  expect(color.getRawValue()).toEqual([0, 0, 0, alpha]);
});

test("Color.fromHExCode throws error with invalid hex code", () => {
  const invalidHexCode = "INVALID_HEX_CODE";
  expect(() => {
    Color.fromHexCode(invalidHexCode);
  }).toThrow(`Invalid hex code: ${invalidHexCode}`);
});
