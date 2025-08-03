import TextParticle from "../effect/particle/TextParticle";
import { assertNonNullable } from "../lib/types/assertion";
import shaderCode from "./shaders/shader.wgsl?raw";
import { DrawContext, startLoop } from "./draw";

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

  console.log(vertexData);

  const vertexDataSize = vertexData.length * 4; // 4 bytes per float
  const vertexBufferGpu = device.createBuffer({
    size: vertexDataSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });

  new Float32Array(vertexBufferGpu.getMappedRange()).set(vertexData);
  vertexBufferGpu.unmap();

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
          // float32x3があるので、16バイトアライメントで設定する必要がある
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x2" }, // startX, startY
            { shaderLocation: 1, offset: 2 * 4, format: "float32x2" }, // endX, endY
            { shaderLocation: 2, offset: 4 * 4, format: "float32x3" }, // r, g, b
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
  const uniformBufferGpu = device.createBuffer({
    label: "Uniform Buffer",
    size: 16, // 4 (float) + 8 (vec2) = 12 bytes, rounded up to 16 for alignment
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const uniBindGroup = device.createBindGroup({
    label: "Uniform Bind Group",
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0 /** @binding(xxx) で指定するid */,
        resource: { buffer: uniformBufferGpu },
      },
    ],
  });
  // アラインメントを考慮してバッファを作成する
  // updateの中で使いまわす
  const F32_BPE = Float32Array.BYTES_PER_ELEMENT; // Bytes per element (float32)
  const uniBufferArray = new ArrayBuffer(
    F32_BPE * 1 /** time */ +
      F32_BPE * 1 /** padding for time (needs 8 alignment for vector2f) */ +
      F32_BPE * 2 /** screenSize */
  );

  const drawContext: DrawContext = {
    wg,
    device,
    pipeline,
    uniBufferGpu: uniformBufferGpu,
    uniBufferArray,
    uniBindGroup,
    vertexBufferGpu,
    vertexCount: particle.count,
    uniTime: 0,
    enableLog: true,
  };

  // start drawing
  startLoop(drawContext);
}

main();
