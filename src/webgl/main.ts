import vertexShaderCode from "./shaders/vertex.vs?raw";
import fragmentShaderCode from "./shaders/fragment.fs?raw";
import { webgl2 } from "../lib/webgl/utils";
import { assertNonNullable } from "../lib/types/assertion";
import { draw, DrawContext } from "./effect/draw";
import { AnimationContext, startAnimation } from "./effect/animation";
import { REPEAT_INTERVAL_MS, TIME_DELTA } from "./effect/constants";
import { getTextParticles } from "./effect/particle";

function main() {
  // main.ts
  const canvas = assertNonNullable<HTMLCanvasElement>(
    document.getElementById("main_canvas")
  );
  assertNonNullable(canvas);

  if (canvas == null) {
    throw new Error("NO canvas element has been found.");
  }

  document.body.style.margin = "0";
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("WebGL not supported");

  // -----------------------------------------
  // 1. Canvas2Dで文字ピクセル抽出
  // -----------------------------------------
  const particles = getTextParticles("Hello World !");
  const particleCount = particles.length;

  // 拡散先はランダム
  const targets = particles.map(() => ({
    x: (Math.random() - 0.5) * canvas.width,
    y: (Math.random() - 0.5) * canvas.height,
  }));

  // -----------------------------------------
  // 2. シェーダ (GPU補間)
  // -----------------------------------------

  const program = webgl2.createProgram(
    gl,
    vertexShaderCode,
    fragmentShaderCode
  );
  gl.useProgram(program);

  // -----------------------------------------
  // 3. バッファ準備
  // -----------------------------------------
  const aStartLoc = gl.getAttribLocation(program, "a_startPos");
  const aEndLoc = gl.getAttribLocation(program, "a_endPos");
  const aColorLoc = gl.getAttribLocation(program, "a_color");
  const uTimeLoc = gl.getUniformLocation(program, "u_time");
  const uScreenLoc = gl.getUniformLocation(program, "u_screenSize");

  // 各パーティクルのデータ作成
  const startPositions: number[] = [];
  const endPositions: number[] = [];
  const colors: number[] = [];

  for (let i = 0; i < particleCount; i++) {
    const p = particles[i];
    const tgt = targets[i];
    startPositions.push(p.x, p.y);
    endPositions.push(tgt.x, tgt.y);
    colors.push(...p.color);
  }

  // GPUに一度だけ転送
  webgl2.createAndBindBuffer(
    gl,
    new Float32Array(startPositions),
    2,
    aStartLoc
  );
  webgl2.createAndBindBuffer(gl, new Float32Array(endPositions), 2, aEndLoc);
  webgl2.createAndBindBuffer(gl, new Float32Array(colors), 3, aColorLoc);

  const staticDrawContext: Omit<DrawContext, "progress"> = {
    gl,
    uTimeLoc: assertNonNullable(uTimeLoc),
    uScreenLoc: assertNonNullable(uScreenLoc),
    particleCount,
    screenSize: [canvas.width, canvas.height],
  };

  const animationContext: AnimationContext = {
    repeatIntervalMs: REPEAT_INTERVAL_MS,
    progress: 0,
    timeDelta: TIME_DELTA,
    onDraw: () => {
      draw({
        ...staticDrawContext,
        progress: animationContext.progress,
      });
    },
  };

  startAnimation(animationContext);
}

main();
