import { useState, useEffect, useCallback } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

interface ResizeState extends WindowSize {
  isResizing: boolean;
}

interface ResizeOptions {
  target?: EventTarget;
  enabled?: boolean;
  throttle?: number;
}

export function useResize(options: ResizeOptions = {}) {
  const {
    target = window,
    enabled = true,
    throttle = 100,
  } = options;

  const [state, setState] = useState<ResizeState>({
    width: 0,
    height: 0,
    isResizing: false,
  });

  const [lastResizeTime, setLastResizeTime] = useState(0);

  const handleResize = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const now = Date.now();
      if (now - lastResizeTime < throttle) return;

      const target = event.target as Window;
      const width = target.innerWidth || document.documentElement.clientWidth;
      const height = target.innerHeight || document.documentElement.clientHeight;

      setState({
        width,
        height,
        isResizing: true,
      });

      setLastResizeTime(now);
    },
    [enabled, throttle, lastResizeTime]
  );

  const handleResizeEnd = useCallback(() => {
    if (!enabled) return;

    setState((prev) => ({
      ...prev,
      isResizing: false,
    }));
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Set initial size
    const width = window.innerWidth || document.documentElement.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight;
    setState((prev) => ({ ...prev, width, height }));

    target.addEventListener('resize', handleResize);
    target.addEventListener('resizeend', handleResizeEnd);

    return () => {
      target.removeEventListener('resize', handleResize);
      target.removeEventListener('resizeend', handleResizeEnd);
    };
  }, [target, handleResize, handleResizeEnd, enabled]);

  return state;
}

// Common resize event hooks
export function useWindowSize(options: ResizeOptions = {}) {
  const { width, height } = useResize(options);
  return { width, height };
}

export function useIsResizing(options: ResizeOptions = {}) {
  const { isResizing } = useResize(options);
  return isResizing;
}

// Responsive breakpoint hooks
export function useBreakpoint(breakpoint: number, options: ResizeOptions = {}) {
  const { width } = useResize(options);
  return width >= breakpoint;
}

export function useIsMobile(options: ResizeOptions = {}) {
  return useBreakpoint(640, options);
}

export function useIsTablet(options: ResizeOptions = {}) {
  return useBreakpoint(768, options);
}

export function useIsDesktop(options: ResizeOptions = {}) {
  return useBreakpoint(1024, options);
}

export function useIsLargeDesktop(options: ResizeOptions = {}) {
  return useBreakpoint(1280, options);
}

// Aspect ratio hook
export function useAspectRatio(options: ResizeOptions = {}) {
  const { width, height } = useResize(options);
  return width / height;
}

// Orientation hook
export function useOrientation(options: ResizeOptions = {}) {
  const { width, height } = useResize(options);
  return width > height ? 'landscape' : 'portrait';
} 