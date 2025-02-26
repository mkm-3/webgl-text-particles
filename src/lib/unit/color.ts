export class Color {
  private value!: [number, number, number, number];

  constructor(r: number, g: number, b: number, a: number) {
    this.value = [r, g, b, a];
  }

  get r() {
    return this.value[0];
  }

  get g() {
    return this.value[1];
  }

  get b() {
    return this.value[2];
  }

  get a() {
    return this.value[3];
  }

  public static fromHexCode(hexCode: string): Color {
    const value = hexCode.replace("#", "");

    if (value.length !== 8 && value.length !== 6) {
      throw new Error(`Invalid hex code: ${hexCode}`);
    }

    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    const a = value.length === 6 ? 1 : parseInt(value.slice(6, 8), 16) / 255;

    return new Color(r, g, b, a);
  }

  public getRawValue() {
    return [this.r, this.g, this.b, this.a];
  }

  public getHexCode() {
    return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(
      16
    )}${this.a.toString(16)}`;
  }
}
