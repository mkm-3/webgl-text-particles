type TextParticleData = {
  x: number;
  y: number;
  color: [number, number, number];
};

export default class TextParticle {
  _particles: TextParticleData[];
  _endPosList: { x: number; y: number }[] = [];
  _offscreen = document.createElement("canvas");

  constructor(text: string, canvasSize: [width: number, height: number]) {
    this._particles = this._convertTextToParticles(text, canvasSize);
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

  public get endPosList(): ReadonlyArray<{ x: number; y: number }> {
    return this._endPosList;
  }

  // 拡散先はランダムに決定する
  _createEndPos(w: number, h: number) {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
    };
  }

  _renderTextOffscreen(
    text: string,
    canvasSize: [width: number, height: number],
    fontSize: number
  ) {
    const off = this._offscreen;
    const w = canvasSize[0];
    const h = canvasSize[1];
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
  }

  _convertTextToParticles(
    text: string,
    canvasSize: [width: number, height: number],
    fontSize = 120
  ): TextParticleData[] {
    console.log(canvasSize, fontSize);
    this._renderTextOffscreen(text, canvasSize, fontSize);

    const w = this._offscreen.width;
    const h = this._offscreen.height;

    const ctx = this._offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context from offscreen canvas.");
    }

    const img = ctx.getImageData(0, 0, w, h);
    const particles: {
      x: number;
      y: number;
      color: [number, number, number];
    }[] = [];

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        // const alpha = img.data[idx + 3];
        const r = img.data[idx] / 255;
        const g = img.data[idx + 1] / 255;
        const b = img.data[idx + 2] / 255;

        particles.push({
          x,
          y,
          color: [r, g, b],
        });

        this._endPosList.push(this._createEndPos(w, h));
      }
    }
    return particles;
  }
}
