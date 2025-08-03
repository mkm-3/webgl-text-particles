export type DrawContext = {
  wg: GPUCanvasContext;
  uniTime: number;
  device: GPUDevice;
  pipeline: GPURenderPipeline;
  uniBufferGpu: GPUBuffer;
  uniBufferArray: ArrayBuffer;
  uniBindGroup: GPUBindGroup;
  vertexBufferGpu: GPUBuffer;
  vertexCount: number;
  onUpdateUniforms?: (ctx: DrawContext) => void;
  enableLog?: boolean;
};

// 固定レイアウトのuniformバッファを更新する
function writeUniformBuffer(ctx: DrawContext) {
  const { device, uniTime, uniBufferGpu, uniBufferArray } = ctx;

  const view = new Float32Array(uniBufferArray);

  // time 更新
  view[0] = uniTime;
  // padding for time (needs 8 alignment for vector2f)
  // vec2のアライメントのため。8バイトずつ読み込むので、パディングが無いとscreenSize.yに変な値が入ってしまう
  // この辺りはCのstructと同じと考えてよい
  view[1] = 0;
  // screenSize 更新
  view[2] = ctx.wg.canvas.width;
  view[3] = ctx.wg.canvas.height;

  device.queue.writeBuffer(uniBufferGpu, 0, uniBufferArray);
}

function draw(ctx: DrawContext) {
  const { wg, device, pipeline, uniBindGroup, vertexBufferGpu, vertexCount } =
    ctx;

  writeUniformBuffer(ctx);

  const encoder = device.createCommandEncoder();
  const textureView = wg.getCurrentTexture().createView();

  const renderPass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: textureView,
        loadOp: "clear",
        storeOp: "store",
        clearValue: { r: 0, g: 0, b: 0, a: 1 },
      },
    ],
  });
  renderPass.setPipeline(pipeline);
  renderPass.setBindGroup(0, uniBindGroup);
  renderPass.setVertexBuffer(0, vertexBufferGpu);
  renderPass.draw(vertexCount, 1, 0, 0);
  renderPass.end();

  device.queue.submit([encoder.finish()]);
}

function update(
  ctx: DrawContext,
  initTimeAt: DOMHighResTimeStamp,
  updateCount: number
) {
  const now = performance.now();
  ctx.uniTime = now - initTimeAt;

  draw(ctx);

  requestAnimationFrame(() => {
    update(ctx, initTimeAt, ++updateCount);
  });
}

export function startLoop(ctx: DrawContext, delayMs = 2000) {
  draw(ctx);

  window.setTimeout(() => {
    ctx.enableLog && console.log("Main loop started.");
    const startAt = performance.now();
    update(ctx, startAt, 0);
  }, delayMs);
}
