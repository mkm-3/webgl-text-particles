import TextParticle from "../effect/particle/TextParticle";
import { assertNonNullable } from "../lib/types/assertion";
import shaderCode from "./shaders/shader.wgsl?raw";
import { draw, DrawContext } from "./draw";
import {
  AnimationContext,
  startAnimation,
} from "../effect/animation/animation";

async function main() {
  const canvas = assertNonNullable<HTMLCanvasElement>(
    document.getElementById("main_canvas")
  );
  assertNonNullable(canvas);

  if (canvas == null) {
    throw new Error("NO canvas element has been found.");
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (!navigator.gpu) {
    throw new Error("WebGPU not supported");
  }

  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter?.requestDevice();
  const wg = canvas.getContext("webgpu");

  if (!wg || !device) {
    throw new Error("Failed to get WebGPU context or device");
  }

  const format = navigator.gpu.getPreferredCanvasFormat();
  wg.configure({
    device,
    format,
    alphaMode: "opaque",
  });

  const particle = new TextParticle("Hello, WebGPU!", [
    canvas.width,
    canvas.height,
  ]);

  const vertexData: number[] = [];
  // p.x, p.y, tgt.x, tgt.yは左上基準（0,0）で格納する
  for (let i = 0; i < particle.count; i++) {
    const p = particle.data[i];
    const end = particle.endPosList[i];
    vertexData.push(p.x, p.y, end.x, end.y, ...p.color);
  }

  const vertexBuffer = device.createBuffer({
    size: vertexData.length * 4, // 4 bytes per float
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  new Float32Array(vertexBuffer.getMappedRange()).set(vertexData);
  vertexBuffer.unmap();

  // pipeline setup
  const shaderModule = device.createShaderModule({
    code: shaderCode,
  });

  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vs_main",
      buffers: [
        {
          arrayStride: 7 * 4, // 7要素 * 4byte = 28byte
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x2" }, // startX, startY
            { shaderLocation: 1, offset: 2 * 4, format: "float32x2" }, // endX, endY
            { shaderLocation: 2, offset: 3 * 4, format: "float32x3" }, // r, g, b
          ],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs_main",
      targets: [
        {
          format,
        },
      ],
    },
    primitive: {
      topology: "point-list",
    },
  });

  // Uniform variable for time and screen size
  const uniformBuffer = device.createBuffer({
    label: "Uniform Buffer",
    size: 16, // 4 (float) + 8 (vec2) = 12 bytes, rounded up to 16 for alignment
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const bindGroup = device.createBindGroup({
    label: "Uniform Bind Group",
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0 /** @binding(xxx) で指定するid */,
        resource: { buffer: uniformBuffer },
      },
    ],
  });

  const staticDrawContext: Omit<DrawContext, "progress"> = {
    wg,
    device,
    pipeline,
    uniformBuffer,
    bindGroup,
    vertexBuffer,
    vertexCount: particle.count,
    screenSize: [canvas.width, canvas.height],
  };

  const animationContext: AnimationContext = {
    repeatIntervalMs: 16, // roughly 60 FPS
    progress: 0,
    timeDelta: 16,
    onDraw: (progress) => {
      const drawContext: DrawContext = {
        ...staticDrawContext,
        progress,
      };

      draw(drawContext);
    },
    enableLog: true,
  };

  startAnimation(animationContext);
}

main();
