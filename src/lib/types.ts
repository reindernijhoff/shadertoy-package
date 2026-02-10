export interface Sampler {
  filter: 'nearest' | 'linear' | 'mipmap';
  wrap: 'clamp' | 'repeat';
  vflip: 'true' | 'false';
  srgb: 'true' | 'false';
  internal: string;
}

export interface Input {
  id: string;
  filepath: string;
  type: 'texture' | 'buffer' | 'cubemap' | 'keyboard' | 'video' | 'music' | 'musicstream' | 'mic' | 'webcam';
  channel: number;
  sampler?: Sampler;
  published?: number;
}

// Supported input types (texture and buffer only)
// Unsupported: cubemap, video, music, musicstream, mic, webcam, keyboard

export interface Output {
  id: string;
  channel: number;
}

export interface RenderPass {
  inputs: Input[];
  outputs: Output[];
  code: string;
  name: string;
  description: string;
  type: 'image' | 'buffer' | 'common' | 'sound' | 'cubemap';
}

export interface ShaderInfo {
  id: string;
  date: string;
  viewed: number;
  name: string;
  description: string;
  likes: number;
  published: string;
  usePreview: number;
  tags: string[];
}

export interface ShadertoyShader {
  ver: string;
  info: ShaderInfo;
  renderpass: RenderPass[];
}

export interface ShadertoyExport {
  userName: string;
  date: string;
  numShaders: number;
  shaders: ShadertoyShader[];
}
