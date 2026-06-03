import { useEffect, useRef, useState } from 'react';
import { ShadertoyRenderer, type ShadertoyRendererOptions } from '../lib/ShadertoyRenderer.js';
import type { ShadertoyShader } from '../lib/types.js';

export interface UseShadertoyRendererOptions extends ShadertoyRendererOptions {
  shader: ShadertoyShader;
  autoInit?: boolean;
}

export interface UseShadertoyRendererReturn {
  // Portable ref-object shape instead of React.RefObject<…>: React 19 changed RefObject
  // (`current: T`) vs React 16–18 (`readonly current: T | null`), so a version-specific
  // RefObject annotation fails to assign to a DOM `ref` prop / the hook's own return on one
  // major or the other. This plain shape attaches cleanly as a `ref` across React 16.8–19.
  ref: {current: HTMLDivElement | null};
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
