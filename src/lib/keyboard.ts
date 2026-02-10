// Shadertoy keyboard input handler
// Creates a 256x3 texture where:
// - Row 0: Current key state (255 if pressed, 0 if not)
// - Row 1: Keypress this frame (255 on frame of press, then 0)
// - Row 2: Toggle state (flips each press)

export class KeyboardHandler {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  private keyStates: Uint8Array; // Row 0: current state
  private keyPressed: Uint8Array; // Row 1: pressed this frame
  private keyToggle: Uint8Array; // Row 2: toggle state
  private bound: boolean = false;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 256;
    this.canvas.height = 3;
    this.ctx = this.canvas.getContext('2d')!;
    this.imageData = this.ctx.createImageData(256, 3);

    this.keyStates = new Uint8Array(256);
    this.keyPressed = new Uint8Array(256);
    this.keyToggle = new Uint8Array(256);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  public bind(): void {
    if (this.bound) return;
    this.bound = true;
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  public unbind(): void {
    if (!this.bound) return;
    this.bound = false;
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const code = e.keyCode;
    if (code < 256) {
      if (this.keyStates[code] === 0) {
        // Key just pressed
        this.keyPressed[code] = 255;
        this.keyToggle[code] = this.keyToggle[code] === 0 ? 255 : 0;
      }
      this.keyStates[code] = 255;
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    const code = e.keyCode;
    if (code < 256) {
      this.keyStates[code] = 0;
    }
  }

  // Call this each frame to update the texture and clear keyPressed
  public update(): HTMLCanvasElement {
    const data = this.imageData.data;

    for (let i = 0; i < 256; i++) {
      // Row 0: current state
      const idx0 = i * 4;
      data[idx0] = this.keyStates[i];
      data[idx0 + 1] = this.keyStates[i];
      data[idx0 + 2] = this.keyStates[i];
      data[idx0 + 3] = 255;

      // Row 1: pressed this frame
      const idx1 = (256 + i) * 4;
      data[idx1] = this.keyPressed[i];
      data[idx1 + 1] = this.keyPressed[i];
      data[idx1 + 2] = this.keyPressed[i];
      data[idx1 + 3] = 255;

      // Row 2: toggle state
      const idx2 = (512 + i) * 4;
      data[idx2] = this.keyToggle[i];
      data[idx2 + 1] = this.keyToggle[i];
      data[idx2 + 2] = this.keyToggle[i];
      data[idx2 + 3] = 255;

      // Clear keyPressed for next frame
      this.keyPressed[i] = 0;
    }

    this.ctx.putImageData(this.imageData, 0, 0);
    return this.canvas;
  }

  public getTexture(): HTMLCanvasElement {
    return this.canvas;
  }

  public destruct(): void {
    this.unbind();
  }
}
