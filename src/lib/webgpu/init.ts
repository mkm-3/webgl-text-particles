type InitGpuResult = {
  device: GPUDevice;
  adapter: GPUAdapter;
  wg: GPUCanvasContext;
  format: GPUTextureFormat;
};

function setupCanvas(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  return canvas;
}

export async function initGpu(
  canvas: HTMLCanvasElement,
  options?: {
    alphaMode?: GPUCanvasAlphaMode;
  }
): Promise<InitGpuResult> {
  if (!navigator.gpu) {
    throw new Error("WebGPU not supported");
  }

  setupCanvas(canvas);

  const adapter = await navigator.gpu.requestAdapter();

  if (!adapter) {
    throw new Error("Failed to get GPU adapter");
  }

  const device = await adapter?.requestDevice();
  const wg = canvas.getContext("webgpu");

  if (!wg || !device) {
    throw new Error("Failed to get WebGPU context or device");
  }

  const format = navigator.gpu.getPreferredCanvasFormat();
  wg.configure({
    device,
    format,
    alphaMode: options?.alphaMode ?? "opaque",
  });

  return {
    device,
    adapter,
    wg,
    format,
  };
}
