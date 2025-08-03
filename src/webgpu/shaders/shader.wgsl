struct Uniforms {
  time : f32,
  screenSize : vec2<f32>,
};

struct VsOut {
  @builtin(position) position : vec4<f32>,

  // 色データは頂点毎に補完させない @fragment shader (特に必要ではないが一応明記)
  @location(0) @interpolate(flat) color : vec3<f32>,
};


// シェーダー定数
override pi: f32 = 3.14159265359; // πの値を定義

@group(0) @binding(0) var<uniform> uni : Uniforms;

fn toNdcPos2D(absPos: vec2<f32>, screenSize: vec2<f32>) -> vec2<f32> {
  // NDC座標系に変換
  // NDC座標系は[-1, 1]の範囲で表現される
  return vec2<f32>(
    (absPos.x / screenSize.x) * 2.0 - 1.0,
    -((absPos.y / screenSize.y) * 2.0 - 1.0)
  );
}

fn easeInCubic(t: f32) -> f32 {
  return t * t * t;
}

fn easeOutCubic(t: f32) -> f32 {
  return 1.0 - pow(1.0 - t, 3.0);
}

@vertex
fn vs_main(
  @location(0) startPos: vec2<f32>,
  @location(1) endPos: vec2<f32>,
  @location(2) color: vec3<f32>,
) -> VsOut {
  var out: VsOut;

  var startPosNdc = toNdcPos2D(startPos, uni.screenSize);
  var endPosNdc = toNdcPos2D(endPos, uni.screenSize);

  var t = min(max(uni.time, 0.0) / 1000.0, 1 * pi); // ループさせたいならmin()を取り除けばよい
  var progress = sin(t - pi / 2.0) / 2.0 + 0.5; // 0.0から1.0の範囲で進行度を計算
  var easedProgress = easeOutCubic(progress); // イージングを適用

  var ndcPos = mix(startPosNdc, endPosNdc, easedProgress);
  out.position = vec4<f32>(ndcPos, 0.0, 1.0);

  out.color = color;
  return out;
}


@fragment
fn fs_main(vs_out: VsOut) -> @location(0) vec4<f32> {
  return vec4<f32>(vs_out.color, 1.0);
}