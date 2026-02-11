import { useState, useMemo } from 'react';
import { ShadertoyRendererComponent } from '../../../src/react';
import type { ShadertoyShader, ShadertoyExport } from '../../../src/react';
import shadersData from '../shaders_public.json';
import mediaMap from '../mediaMap.json';

const shaders = (shadersData as ShadertoyExport).shaders;

const sortedShaders = [...shaders].sort((a, b) =>
  a.info.name.localeCompare(b.info.name)
);

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const shader = sortedShaders[selectedIndex] as ShadertoyShader | undefined;

  const mediaMapping = useMemo(
    () => (url: string) => (mediaMap as Record<string, string | string[]>)[url],
    []
  );

  return (
    <div className="app">
      <h1>Shadertoy React Example</h1>
      <div className="controls">
        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
        >
          {sortedShaders.map((s, i) => (
            <option key={s.info.id} value={i}>
              {s.info.name}
            </option>
          ))}
        </select>
      </div>
      <div className="canvas-container">
        {shader && (
          <ShadertoyRendererComponent
            shader={shader}
            loop={true}
            pixelRatio={Math.min(window.devicePixelRatio, 2)}
            mediaMapping={mediaMapping}
          />
        )}
      </div>
      {shader && (
        <div className="shader-info">
          <strong>{shader.info.name}</strong>
          <br />
          <a
            href={`https://www.shadertoy.com/view/${shader.info.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Shadertoy
          </a>
        </div>
      )}
      <footer id="shader-footer">
        Powered by <a href="https://www.npmjs.com/package/@reindernijhoff/shadertoy" target="_blank">@reindernijhoff/shadertoy</a>
      </footer>
    </div>
  );
}

export default App;
