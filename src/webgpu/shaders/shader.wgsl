struct Uniforms {
  progress : f32,
  screenSize : vec2<f32>,
};

struct VSOut {
  @builtin(position) position : vec4<f32>,
  @location(0) color : vec3<f32>,
};

@group(0) @binding(0) var<uniform> uni : Uniforms;

@vertex
fn vs_main(
  @location(0) startPos: vec3<f32>,
  @location(1) endPos: vec3<f32>,
  @location(2) color: vec3<f32>,
) -> VSOut {
  var out: VSOut;
  var pos = mix(startPos, endPos, uni.progress); 

  out.position = vec4<f32>(startPos, 1.0);
  out.color = color;
  return out;
}


@fragment
fn fs_main(@location(0) color : vec3<f32>) -> @location(0) vec4<f32> {
  return vec4<f32>(color, 1.0);
}