export class DotActor {
  // Arrayだしあんま意味ないけどとりあえずreadonlyしとく
  readonly pos: [number, number];
  readonly dst: [number, number];
  readonly size: [number, number];
  readonly alpha: number;

  readonly state: [number, number];

  constructor(
    pos: [number, number],
    dst: [number, number],
    size: [number, number],
    alpha: number
  ) {
    this.state = this.pos = pos;
    this.dst = dst;
    this.size = size;
    this.alpha = alpha;
  }

  public update(currentStep: number /** 0 - 1.0 */) {
    this.state[0] = this.pos[0] + (this.dst[0] - this.pos[0]) * currentStep;
    this.state[1] = this.pos[1] + (this.dst[1] - this.pos[1]) * currentStep;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    fillStyle: CanvasGradient | CanvasPattern | string
  ) {
    ctx.fillStyle = fillStyle;
    ctx.fillRect(this.state[0], this.state[1], this.size[0], this.size[1]);
  }
}
