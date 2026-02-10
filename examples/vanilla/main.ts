import { ShadertoyRenderer } from '../../src/index.js';
import type { ShadertoyShader, ShadertoyExport } from '../../src/index.js';
import shadersData from './shaders_public.json';
import mediaMap from './media/mediaMap.json';

const shaders = (shadersData as ShadertoyExport).shaders;

const sortedShaders = [...shaders].sort((a, b) => 
  a.info.name.localeCompare(b.info.name)
);

let currentRenderer: ShadertoyRenderer | null = null;

const container = document.getElementById('canvas-container')!;
const select = document.getElementById('shader-select') as HTMLSelectElement;
const infoDiv = document.getElementById('shader-info')!;

sortedShaders.forEach((shader, index) => {
  const option = document.createElement('option');
  option.value = index.toString();
  option.textContent = shader.info.name;
  select.appendChild(option);
});

function loadShader(shader: ShadertoyShader) {
  if (currentRenderer) {
    currentRenderer.destruct();
    currentRenderer = null;
  }

  try {
    currentRenderer = new ShadertoyRenderer(container, shader, {
      loop: true,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      mediaMapping: (url) => (mediaMap as Record<string, string | string[]>)[url],
    });

    const shadertoyUrl = `https://www.shadertoy.com/view/${shader.info.id}`;
    infoDiv.innerHTML = `
      <strong>${shader.info.name}</strong><br>
      <a href="${shadertoyUrl}" target="_blank">${shadertoyUrl}</a>
    `;
  } catch (error) {
    infoDiv.innerHTML = `<span style="color: #f88;">Failed to load shader: ${(error as Error).message}</span>`;
  }
}

select.addEventListener('change', () => {
  const index = parseInt(select.value, 10);
  if (!isNaN(index) && sortedShaders[index]) {
    loadShader(sortedShaders[index]);
  }
});

if (sortedShaders.length > 0) {
  select.value = '0';
  loadShader(sortedShaders[0]);
}
