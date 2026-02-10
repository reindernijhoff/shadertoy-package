import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import {
  useShadertoyRenderer,
  type UseShadertoyRendererOptions
} from './useShadertoyRenderer.js';
import type { ShadertoyRenderer } from '../lib/ShadertoyRenderer.js';

export interface ShadertoyRendererComponentProps extends UseShadertoyRendererOptions {
  className?: string;
  style?: React.CSSProperties;
  onReady?: (renderer: ShadertoyRenderer) => void;
}

export interface ShadertoyRendererComponentRef {
  renderer: ShadertoyRenderer | null;
  container: HTMLDivElement | null;
}

export const ShadertoyRendererComponent = forwardRef<
  ShadertoyRendererComponentRef,
  ShadertoyRendererComponentProps
>(function ShadertoyRendererComponent(props, ref) {
  const { className, style, onReady, ...rendererOptions } = props;

  const { ref: containerRef, renderer, isReady } = useShadertoyRenderer(rendererOptions);
  const onReadyCalledForRenderer = useRef<ShadertoyRenderer | null>(null);

  useImperativeHandle(ref, () => ({
    renderer,
    container: containerRef.current,
  }), [renderer]);

  useEffect(() => {
    if (isReady && renderer && onReady && onReadyCalledForRenderer.current !== renderer) {
      onReadyCalledForRenderer.current = renderer;
      onReady(renderer);
    }
  }, [isReady, renderer, onReady]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
});
