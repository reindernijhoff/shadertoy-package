import { ImageEffectRenderer, type RendererInstance, type ImageEffectRendererOptions } from '@mediamonks/image-effect-renderer';
import type { ShadertoyShader, RenderPass, Input } from './types.js';
import { KeyboardHandler } from './keyboard.js';

const SHADERTOY_MEDIA_BASE = 'https://www.shadertoy.com';

export type MediaMappingFunction = (shadertoyUrl: string) => string | string[] | undefined | null;

export type ShadertoyRendererOptions = Partial<ImageEffectRendererOptions> & {
  mediaMapping?: MediaMappingFunction;
};

export class ShadertoyRenderer {
  public renderer: RendererInstance;
  public shader: ShadertoyShader;
  private options: ShadertoyRendererOptions;
  private loadedImages: Map<string, HTMLImageElement> = new Map();
  private keyboardHandler: KeyboardHandler | null = null;
  private keyboardChannels: Map<number, RendererInstance | typeof this.renderer.buffers[0]> = new Map();
  private bufferIdToIndex: Map<string, number> = new Map();
  private cubemapChannels: Map<RenderPass, Set<number>> = new Map();

  constructor(container: HTMLElement, shader: ShadertoyShader, options: ShadertoyRendererOptions = {}) {
    this.shader = shader;
    this.options = options;

    const imagePass = this.getImagePass();
    if (!imagePass) {
      throw new Error('Shader does not have an image renderpass');
    }

    // Detect cubemap channels before compiling shaders
    this.detectCubemapChannels();

    const commonCode = this.getCommonCode();
    const mainShaderCode = this.processShaderCode(imagePass, commonCode);

    this.renderer = ImageEffectRenderer.createTemporary(container, mainShaderCode, {
      loop: true,
      ...options,
    });

    this.setupBuffers(commonCode);
    this.loadInputs();
  }

  private getImagePass(): RenderPass | undefined {
    return this.shader.renderpass.find((pass: RenderPass) => pass.type === 'image');
  }

  private getBufferPasses(): RenderPass[] {
    return this.shader.renderpass.filter((pass: RenderPass) => pass.type === 'buffer');
  }

  private detectCubemapChannels(): void {
    // Scan all passes for cubemap inputs
    for (const pass of this.shader.renderpass) {
      if (!pass.inputs) continue;
      const channels = new Set<number>();
      for (const input of pass.inputs) {
        if (input.type === 'cubemap') {
          channels.add(input.channel);
        }
      }
      if (channels.size > 0) {
        this.cubemapChannels.set(pass, channels);
      }
    }
  }

  private processShaderCode(pass: RenderPass, commonCode: string): string {
    let code = this.prependCommonCode(pass.code, commonCode);
    
    // Replace iChannelX with iChannelCubeX for cubemap channels
    const cubeChannels = this.cubemapChannels.get(pass);
    if (cubeChannels) {
      for (const channel of cubeChannels) {
        // Replace all occurrences of iChannelX with iChannelCubeX
        const regex = new RegExp(`\\biChannel${channel}\\b`, 'g');
        code = code.replace(regex, `iChannelCube${channel}`);
      }
    }
    
    return code;
  }

  private setupBuffers(commonCode: string): void {
    const bufferPasses = this.getBufferPasses();
    this.bufferIdToIndex = new Map();

    bufferPasses.forEach((pass, arrayIndex) => {
      const bufferCode = this.processShaderCode(pass, commonCode);
      const bufferIndex = arrayIndex;

      if (pass.outputs) {
        for (const output of pass.outputs) {
          this.bufferIdToIndex.set(output.id, bufferIndex);
        }
      }

      this.renderer.createBuffer(bufferIndex, bufferCode, {
        type: WebGL2RenderingContext.FLOAT,
      });
    });
  }

  private getCommonCode(): string {
    const commonPass = this.shader.renderpass.find((pass: RenderPass) => pass.type === 'common');
    return commonPass?.code || '';
  }

  private prependCommonCode(code: string, commonCode: string): string {
    return commonCode ? `${commonCode}\n\n${code}` : code;
  }

  private async loadInputs(): Promise<void> {
    const imagePass = this.getImagePass();
    if (!imagePass) return;

    // Load inputs for main image pass
    await this.loadPassInputs(imagePass, this.renderer);

    // Load inputs for buffer passes
    const bufferPasses = this.getBufferPasses();
    for (let i = 0; i < bufferPasses.length; i++) {
      const buffer = this.renderer.buffers[i];
      if (buffer) {
        await this.loadPassInputs(bufferPasses[i], buffer);
      }
    }
  }

  private async loadPassInputs(pass: RenderPass, target: RendererInstance | typeof this.renderer.buffers[0]): Promise<void> {
    if (!pass.inputs) return;
    for (const input of pass.inputs) {
      await this.loadInput(input, target);
    }
  }

  private async loadInput(input: Input, target: RendererInstance | typeof this.renderer.buffers[0]): Promise<void> {
    const channel = input.channel;

    if (input.type === 'buffer') {
      // Buffer input - reference another buffer
      const bufferIndex = this.getBufferIndexFromId(input.id);
      if (bufferIndex >= 0 && this.renderer.buffers[bufferIndex]) {
        const options = this.getImageOptions(input);
        target.setImage(channel, this.renderer.buffers[bufferIndex], options);
      }
    } else if (input.type === 'texture') {
      // Texture input - load image
      const image = await this.loadImage(input.filepath);
      if (image) {
        const options = this.getImageOptions(input);
        target.setImage(channel, image, options);
      }
    } else if (input.type === 'cubemap') {
      // Cubemap input - load 6 faces
      const faces = await this.loadCubemap(input.filepath);
      if (faces) {
        const options = this.getImageOptions(input);
        target.setCubeMap(channel, faces, options);
      }
    } else if (input.type === 'keyboard') {
      // Keyboard input - create handler if needed
      if (!this.keyboardHandler) {
        this.keyboardHandler = new KeyboardHandler();
        this.keyboardHandler.bind();
        this.renderer.tick(() => {
          if (this.keyboardHandler) {
            const texture = this.keyboardHandler.update();
            // Update all targets that use keyboard input
            for (const [ch, tgt] of this.keyboardChannels) {
              tgt.setImage(ch, texture, { minFilterLinear: false, magFilterLinear: false });
            }
          }
        });
      }
      // Store which channel/target needs keyboard texture
      this.keyboardChannels.set(channel, target);
      // Set initial texture
      target.setImage(channel, this.keyboardHandler.update(), { minFilterLinear: false, magFilterLinear: false });
    }
  }

  private getBufferIndexFromId(id: string): number {
    // Use the stored mapping from buffer setup
    return this.bufferIdToIndex.get(id) ?? -1;
  }

  private getImageOptions(input: Input): Record<string, boolean> {
    const sampler = input.sampler;
    return {
      clampX: sampler?.wrap === 'clamp',
      clampY: sampler?.wrap === 'clamp',
      flipY: sampler?.vflip === 'true',
      useMipmap: sampler?.filter === 'mipmap',
      minFilterLinear: sampler?.filter !== 'nearest',
      magFilterLinear: sampler?.filter !== 'nearest',
    };
  }

  private getMediaUrl(filepath: string): string | string[] {
    if (this.options.mediaMapping) {
      const mapped = this.options.mediaMapping(filepath);
      if (mapped !== undefined && mapped !== null) {
        return mapped;
      }
    }
    // Fall back to Shadertoy CDN
    return `${SHADERTOY_MEDIA_BASE}${filepath}`;
  }

  private async loadImage(filepath: string): Promise<HTMLImageElement | null> {
    if (this.loadedImages.has(filepath)) {
      return this.loadedImages.get(filepath)!;
    }

    const url = this.getMediaUrl(filepath);
    
    if (Array.isArray(url)) {
      return null;
    }
    
    return this.loadSingleImage(url);
  }

  private async loadSingleImage(url: string): Promise<HTMLImageElement | null> {
    if (this.loadedImages.has(url)) {
      return this.loadedImages.get(url)!;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.loadedImages.set(url, img);
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  private async loadCubemap(filepath: string): Promise<[HTMLImageElement, HTMLImageElement, HTMLImageElement, HTMLImageElement, HTMLImageElement, HTMLImageElement] | null> {
    const mapped = this.getMediaUrl(filepath);
    
    let urls: string[];
    if (Array.isArray(mapped)) {
      if (mapped.length !== 6) {
        return null;
      }
      urls = mapped;
    } else {
      const baseUrl = mapped;
      const ext = baseUrl.match(/\.[^.]+$/)?.[0] || '.jpg';
      const basePath = baseUrl.slice(0, -ext.length);
      urls = [
        baseUrl,
        `${basePath}_1${ext}`,
        `${basePath}_2${ext}`,
        `${basePath}_3${ext}`,
        `${basePath}_4${ext}`,
        `${basePath}_5${ext}`,
      ];
    }

    const faces = await Promise.all(urls.map(url => this.loadSingleImage(url)));
    if (faces.some(f => f === null)) {
      return null;
    }

    return faces as [HTMLImageElement, HTMLImageElement, HTMLImageElement, HTMLImageElement, HTMLImageElement, HTMLImageElement];
  }

  public play(): void {
    this.renderer.play();
  }

  public stop(): void {
    this.renderer.stop();
  }

  public destruct(): void {
    if (this.keyboardHandler) {
      this.keyboardHandler.destruct();
      this.keyboardHandler = null;
    }
    this.keyboardChannels.clear();
    ImageEffectRenderer.releaseTemporary(this.renderer);
    this.loadedImages.clear();
  }
}
