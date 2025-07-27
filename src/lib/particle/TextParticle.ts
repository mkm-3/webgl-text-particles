type TextParticleData = {
  x: number;
  y: number;
  color: [number, number, number];
};

export default class TextParticle {
  _particles: TextParticleData[];

  constructor(text: string) {
    this._particles = TextParticle.convertTextToParticles(text);
    if (this._particles.length === 0) {
      throw new Error("No particles generated from the text.");
    }
  }

  public get data(): ReadonlyArray<TextParticleData> {
    return this._particles;
  }

  public get count(): number {
    return this._particles.length;
  }

  public static convertTextToParticles(
    text: string,
    fontSize = 120
  ): TextParticleData[] {
    const off = document.createElement("canvas");
    const w = 800;
    const h = 200;
    off.width = w;
    off.height = h;
    const ctx = off.getContext("2d")!;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2);

    const img = ctx.getImageData(0, 0, w, h);
    const particles: {
      x: number;
      y: number;
      color: [number, number, number];
    }[] = [];

    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const idx = (y * w + x) * 4;
        const alpha = img.data[idx + 3];
        if (alpha > 128) {
          const r = img.data[idx] / 255;
          const g = img.data[idx + 1] / 255;
          const b = img.data[idx + 2] / 255;
          particles.push({
            x: x - w / 2,
            y: -(y - h / 2),
            color: [r, g, b],
          });
        }
      }
    }
    return particles;
  }
}
