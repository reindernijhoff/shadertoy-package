# Shadertoy

A TypeScript/JavaScript library for rendering [Shadertoy](https://www.shadertoy.com/) shaders using WebGL. Built on top of [@mediamonks/image-effect-renderer](https://www.npmjs.com/package/@mediamonks/image-effect-renderer).

## Demo

Shadertoy Shaders by Reinder Nijhoff rendered using [this library](https://reindernijhoff.github.io/shadertoy-package/).

This is a build from the repository's example/ directory.

## Features

- Render Shadertoy shaders with full buffer support
- Texture and cubemap inputs
- Keyboard input support
- Custom media URL mapping
- Tree-shakable React bindings

## Installation

```bash
npm install @reindernijhoff/shadertoy
```

## Usage

### Vanilla JavaScript

```javascript
import { ShadertoyRenderer } from '@reindernijhoff/shadertoy';
import shader from './shader.json';

const container = document.getElementById('container');

const renderer = new ShadertoyRenderer(container, shader, {
  loop: true,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  mediaMapping: (url) => mediaMap[url], // Optional: map Shadertoy URLs to local files
});

// Control playback
renderer.play();
renderer.stop();

// Clean up
renderer.destruct();
```

### React

```tsx
import { ShadertoyRendererComponent } from '@reindernijhoff/shadertoy/react';
import shader from './shader.json';

function App() {
  return (
    <ShadertoyRendererComponent
      shader={shader}
      loop={true}
      pixelRatio={2}
      onReady={(renderer) => console.log('Ready!')}
    />
  );
}
```

Or use the hook for more control:

```tsx
import { useShadertoyRenderer } from '@reindernijhoff/shadertoy/react';

function App() {
  const { ref, renderer, isReady } = useShadertoyRenderer({
    shader,
    loop: true,
  });

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}
```

## Options

```typescript
interface ShadertoyRendererOptions {
  loop?: boolean;           // Auto-play the shader (default: true)
  autoResize?: boolean;     // Auto-resize to container (default: true)
  pixelRatio?: number;      // Pixel ratio (default: devicePixelRatio)
  useSharedContext?: boolean; // Share WebGL context (default: false)
  asyncCompile?: boolean;   // Async shader compilation (default: true)
  mediaMapping?: (url: string) => string | string[] | undefined;
}
```

### Media Mapping

Use `mediaMapping` to redirect Shadertoy media URLs to local or custom URLs:

```javascript
const mediaMap = {
  '/media/a/texture.png': '/local/texture.png',
  '/media/a/cubemap.jpg': [  // Cubemap: 6 faces
    '/local/cubemap_0.jpg',
    '/local/cubemap_1.jpg',
    '/local/cubemap_2.jpg',
    '/local/cubemap_3.jpg',
    '/local/cubemap_4.jpg',
    '/local/cubemap_5.jpg',
  ],
};

new ShadertoyRenderer(container, shader, {
  mediaMapping: (url) => mediaMap[url],
});
```

## Shader JSON Format

The shader JSON should be in Shadertoy's export format:

```json
{
  "info": {
    "id": "shader_id",
    "name": "Shader Name"
  },
  "renderpass": [
    {
      "inputs": [
        {
          "filepath": "/media/a/texture.png",
          "type": "texture",
          "channel": 0,
          "sampler": { "filter": "mipmap", "wrap": "repeat" }
        }
      ],
      "code": "void mainImage(out vec4 fragColor, in vec2 fragCoord) { ... }",
      "type": "image"
    }
  ]
}
```

## API Reference

### ShadertoyRenderer

```typescript
class ShadertoyRenderer {
  constructor(container: HTMLElement, shader: ShadertoyShader, options?: ShadertoyRendererOptions);
  
  renderer: RendererInstance;  // Underlying image-effect-renderer instance
  shader: ShadertoyShader;     // The shader data
  
  play(): void;      // Start rendering
  stop(): void;      // Stop rendering
  destruct(): void;  // Clean up resources
}
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run vanilla example
cd examples/vanilla
npm install
npm run dev

# Run React example
cd examples/react
npm install
npm run dev
```

## License

MIT License. See [LICENSE](LICENSE) for details.
