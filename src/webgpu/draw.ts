export type DrawContext = {
  wg: GPUCanvasContext;
  device: GPUDevice;
  pipeline: GPURenderPipeline;
  uniformBuffer: GPUBuffer;
  bindGroup: GPUBindGroup;
  vertexBuffer: GPUBuffer;
  vertexCount: number;
  screenSize: [width: number, height: number];
  progress: number;
};

export function draw(ctx: DrawContext) {
  const {
    wg,
    device,
    pipeline,
    uniformBuffer,
    bindGroup,
    vertexBuffer,
    vertexCount,
    progress,
    screenSize,
  } = ctx;

  const uniformArray = new Float32Array(4);

  // [progress, (padding), screenSize.x, screenSize.y]
  // vec2のアライメントのため。8バイトずつ読み込むので、パディングが無いとscreenSize.yに変な値が入ってしまう
  // この辺りはCのstructと同じと考えてよい
  uniformArray[0] = progress;
  uniformArray[2] = screenSize[0];
  uniformArray[3] = screenSize[1];

  device.queue.writeBuffer(uniformBuffer, 0, uniformArray);

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
  renderPass.setBindGroup(0, bindGroup);
  renderPass.setVertexBuffer(0, vertexBuffer);
  renderPass.draw(vertexCount, 1, 0, 0);
  renderPass.end();

  device.queue.submit([encoder.finish()]);
}
