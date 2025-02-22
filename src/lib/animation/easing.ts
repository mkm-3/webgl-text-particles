/**
 * @file define easing functions.
 * Ref: https://easings.net/ja
 */

export function easeInOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}
