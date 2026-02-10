import { useEffect, useRef, useState } from 'react';
import { ShadertoyRenderer, type ShadertoyRendererOptions } from '../lib/ShadertoyRenderer.js';
import type { ShadertoyShader } from '../lib/types.js';

export interface UseShadertoyRendererOptions extends ShadertoyRendererOptions {
  shader: ShadertoyShader;
  autoInit?: boolean;
}

export interface UseShadertoyRendererReturn {
  ref: React.RefObject<HTMLDivElement>;
  renderer: ShadertoyRenderer | null;
  isReady: boolean;
}

export function useShadertoyRenderer(
  options: UseShadertoyRendererOptions
): UseShadertoyRendererReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<ShadertoyRenderer | null>(null);
  const [isReady, setIsReady] = useState(false);

  const { shader, autoInit = true, ...rendererOptions } = options;

  useEffect(() => {
    if (!containerRef.current || !autoInit || !shader) {
      return;
    }

    const renderer = new ShadertoyRenderer(
      containerRef.current,
      shader,
      rendererOptions
    );

    rendererRef.current = renderer;

    renderer.renderer.ready(() => {
      setIsReady(true);
    });

    return () => {
      if (rendererRef.current) {
        rendererRef.current.destruct();
        rendererRef.current = null;
      }
      setIsReady(false);
    };
  }, [shader, autoInit]);

  return {
    ref: containerRef,
    renderer: rendererRef.current,
    isReady,
  };
}
