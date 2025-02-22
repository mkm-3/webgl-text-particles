export class AnimationController {
  private step: number = 0; /** 経過Frame */
  private delay: number;
  private duration: number;

  constructor(durationFrame: number = 60, delayFrame: number = 0) {
    if (durationFrame < delayFrame || durationFrame === 0) {
      throw new Error("Invalid parameter specified.");
    }
    this.duration = durationFrame + delayFrame;
    this.delay = delayFrame;
  }

  public update() {
    if (this.step < this.duration) {
      ++this.step;
    }

    return this.getCurrentStep();
  }

  public getCurrentStep() {
    if (this.step === this.duration) {
      return 1.0;
    }

    if (this.step < this.delay) {
      return 0;
    }

    return (this.step - this.delay) / (this.duration - this.delay);
  }

  public isCompleted() {
    return this.step === this.duration;
  }
}
