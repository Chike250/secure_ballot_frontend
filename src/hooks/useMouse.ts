import { useState, useEffect, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface MouseState extends MousePosition {
  isDown: boolean;
  isUp: boolean;
  isMoving: boolean;
}

interface MouseOptions {
  target?: EventTarget;
  enabled?: boolean;
}

export function useMouse(options: MouseOptions = {}) {
  const {
    target = window,
    enabled = true,
  } = options;

  const [state, setState] = useState<MouseState>({
    x: 0,
    y: 0,
    isDown: false,
    isUp: true,
    isMoving: false,
  });

  const handleMouseMove = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const mouseEvent = event as MouseEvent;
      setState((prev) => ({
        ...prev,
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
        isMoving: true,
      }));
    },
    [enabled]
  );

  const handleMouseDown = useCallback(
    (event: Event) => {
      if (!enabled) return;

      setState((prev) => ({
        ...prev,
        isDown: true,
        isUp: false,
      }));
    },
    [enabled]
  );

  const handleMouseUp = useCallback(
    (event: Event) => {
      if (!enabled) return;

      setState((prev) => ({
        ...prev,
        isDown: false,
        isUp: true,
      }));
    },
    [enabled]
  );

  const handleMouseLeave = useCallback(
    (event: Event) => {
      if (!enabled) return;

      setState((prev) => ({
        ...prev,
        isDown: false,
        isUp: true,
        isMoving: false,
      }));
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    target.addEventListener('mousemove', handleMouseMove);
    target.addEventListener('mousedown', handleMouseDown);
    target.addEventListener('mouseup', handleMouseUp);
    target.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
      target.removeEventListener('mousedown', handleMouseDown);
      target.removeEventListener('mouseup', handleMouseUp);
      target.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [target, handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave, enabled]);

  return state;
}

// Common mouse event hooks
export function useMousePosition(options: MouseOptions = {}) {
  const { x, y } = useMouse(options);
  return { x, y };
}

export function useMouseDown(options: MouseOptions = {}) {
  const { isDown } = useMouse(options);
  return isDown;
}

export function useMouseUp(options: MouseOptions = {}) {
  const { isUp } = useMouse(options);
  return isUp;
}

export function useMouseMoving(options: MouseOptions = {}) {
  const { isMoving } = useMouse(options);
  return isMoving;
}

// Mouse click hook
export function useClick(
  callback: (event: MouseEvent) => void,
  options: MouseOptions = {}
) {
  const {
    target = window,
    enabled = true,
  } = options;

  const handleClick = useCallback(
    (event: Event) => {
      if (!enabled) return;
      callback(event as MouseEvent);
    },
    [callback, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    target.addEventListener('click', handleClick);

    return () => {
      target.removeEventListener('click', handleClick);
    };
  }, [target, handleClick, enabled]);
}

// Mouse double click hook
export function useDoubleClick(
  callback: (event: MouseEvent) => void,
  options: MouseOptions = {}
) {
  const {
    target = window,
    enabled = true,
  } = options;

  const handleDoubleClick = useCallback(
    (event: Event) => {
      if (!enabled) return;
      callback(event as MouseEvent);
    },
    [callback, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    target.addEventListener('dblclick', handleDoubleClick);

    return () => {
      target.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [target, handleDoubleClick, enabled]);
} 