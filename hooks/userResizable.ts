import { useState, useRef, useEffect, useCallback } from 'react';

interface Options {
  initialWidth: number;
  min: number;
  max: number;
}

export function useResizable({ initialWidth, min, max }: Options) {
  const [width, setWidth]         = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);
  const handleRef                 = useRef<HTMLDivElement>(null);
  const startX                    = useRef(0);
  const startW                    = useRef(0);

  const onMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startX.current = e.clientX;
    startW.current = width;
  }, [width]);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;
    handle.addEventListener('mousedown', onMouseDown);
    return () => handle.removeEventListener('mousedown', onMouseDown);
  }, [onMouseDown]);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent) => {
      const next = Math.min(Math.max(startW.current + e.clientX - startX.current, min), max);
      setWidth(next);
    };
    const onUp = () => setIsDragging(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, min, max]);

  return { width, handleRef, isDragging };
}
