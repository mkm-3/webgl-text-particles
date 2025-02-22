import { DotActor } from "./components/Dot";
import { AnimationController } from "./lib/animation/controller";
import { assertNonNullable, resizeCanvasTo } from "./utils";

// とりあえずcanvas APIで試作
// 後で描画処理をWebGLに置き換える

const TEXT_CONTENT = "Welcome to WebGL text particles !!!!";
const FONT_FILL_COLOR_DEFAULT = "#ff5733";

function renderTextContent(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  // const canvas = document.createElement("canvas");
  const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;
  console.log(canvas);
  resizeCanvasTo(canvas, 720, 360);

  const ctx = assertNonNullable(canvas.getContext("2d"));

  ctx.font = "48px serif"; // TODO: フォントの設定
  ctx.fillStyle = FONT_FILL_COLOR_DEFAULT;
  ctx.fillText(TEXT_CONTENT, 10, 50, canvas.width);

  ctx.fillStyle = "#000000";

  return [canvas, ctx];
}

function textToParticles(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  const dots: DotActor[] = [];
  const { width, height } = canvas;

  // const timeline = gsap.timeline({ repeat: -1, yoyo: true });

  const MAX_DIFFUSION_PX = 500;

  for (let i = 0; i < width * height; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    const dotData = context.getImageData(x, y, 1, 1);
    const alpha = dotData.data[3];

    if (alpha === 0) {
      continue;
    }

    const dstX = x + MAX_DIFFUSION_PX * (Math.random() - 0.5);
    const dstY = y + MAX_DIFFUSION_PX * (Math.random() - 0.5);
    const sizePx = 3;
    dots.push(
      new DotActor([x, y], [dstX, dstY], [sizePx, sizePx], alpha / 255)
    );
  }

  return dots;
}

function render(
  dots: DotActor[],
  animationController: AnimationController,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  if (animationController.isCompleted()) {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const step = animationController.update();

  for (const dot of dots) {
    dot.update(step);
    dot.render(ctx, FONT_FILL_COLOR_DEFAULT);
  }

  return requestAnimationFrame(() =>
    render(dots, animationController, ctx, canvas)
  );
}

function runTextShader() {
  // 1. create text content
  const [canvas, context] = renderTextContent();

  // 2. text -> particles
  const dots = textToParticles(canvas, context);

  // 3.
  const animationController = new AnimationController(60 * 5, 60 * 2);

  render(dots, animationController, context, canvas);
}

runTextShader();
