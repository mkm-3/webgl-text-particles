import { clamp } from "../../lib/math/range";
import { PROGRESS_MAX, PROGRESS_MIN, TIME_DELTA } from "./constants";

export type AnimationContext = {
  repeatIntervalMs: number;
  progress: number;
  timeDelta: number;
  onDraw: (progress: number) => void;
};

export function updateAnimation(ctx: AnimationContext) {
  const { timeDelta } = ctx;

  ctx.progress = clamp(PROGRESS_MIN, ctx.progress + timeDelta, PROGRESS_MAX); // 0→1へ
  ctx.onDraw(ctx.progress);

  const isProgressEnd = ctx.progress >= 1.0 || ctx.progress <= 0;
  console.log("updateAnimation(), progress is ", ctx.progress);

  if (isProgressEnd) {
    console.log("animation ended.");
    onAnimationEnd(ctx);
    return;
  }

  requestAnimationFrame(() => {
    updateAnimation(ctx);
  });
}

function onAnimationEnd(ctx: AnimationContext) {
  const isReversed = ctx.progress <= 0;
  ctx.timeDelta = isReversed ? TIME_DELTA : -TIME_DELTA;

  startAnimation(ctx);
}

export function startAnimation(ctx: AnimationContext) {
  ctx.onDraw(ctx.progress);
  window.setTimeout(() => {
    updateAnimation(ctx);
  }, ctx.repeatIntervalMs);
}
