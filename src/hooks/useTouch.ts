import { useState, useEffect, useCallback } from 'react';

interface TouchPosition {
  x: number;
  y: number;
}

interface TouchState extends TouchPosition {
  isTouching: boolean;
  isMoving: boolean;
  touchCount: number;
}

interface TouchOptions {
  target?: EventTarget;
  enabled?: boolean;
}

export function useTouch(options: TouchOptions = {}) {
  const {
    target = window,
    enabled = true,
  } = options;

  const [state, setState] = useState<TouchState>({
    x: 0,
    y: 0,
    isTouching: false,
    isMoving: false,
    touchCount: 0,
  });

  const handleTouchStart = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const touchEvent = event as TouchEvent;
      const touch = touchEvent.touches[0];
      setState((prev) => ({
        ...prev,
        x: touch.clientX,
        y: touch.clientY,
        isTouching: true,
        touchCount: touchEvent.touches.length,
      }));
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const touchEvent = event as TouchEvent;
      const touch = touchEvent.touches[0];
      setState((prev) => ({
        ...prev,
        x: touch.clientX,
        y: touch.clientY,
        isMoving: true,
        touchCount: touchEvent.touches.length,
      }));
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const touchEvent = event as TouchEvent;
      setState((prev) => ({
        ...prev,
        isTouching: false,
        isMoving: false,
        touchCount: touchEvent.touches.length,
      }));
    },
    [enabled]
  );

  const handleTouchCancel = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const touchEvent = event as TouchEvent;
      setState((prev) => ({
        ...prev,
        isTouching: false,
        isMoving: false,
        touchCount: touchEvent.touches.length,
      }));
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    target.addEventListener('touchstart', handleTouchStart);
    target.addEventListener('touchmove', handleTouchMove);
    target.addEventListener('touchend', handleTouchEnd);
    target.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      target.removeEventListener('touchstart', handleTouchStart);
      target.removeEventListener('touchmove', handleTouchMove);
      target.removeEventListener('touchend', handleTouchEnd);
      target.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [target, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel, enabled]);

  return state;
}

// Common touch event hooks
export function useTouchPosition(options: TouchOptions = {}) {
  const { x, y } = useTouch(options);
  return { x, y };
}

export function useTouchCount(options: TouchOptions = {}) {
  const { touchCount } = useTouch(options);
  return touchCount;
}

export function useTouchMoving(options: TouchOptions = {}) {
  const { isMoving } = useTouch(options);
  return isMoving;
}

export function useTouchTouching(options: TouchOptions = {}) {
  const { isTouching } = useTouch(options);
  return isTouching;
}

// Touch gesture hooks
export function useSwipe(
  callback: (direction: 'left' | 'right' | 'up' | 'down') => void,
  options: TouchOptions & { threshold?: number } = {}
) {
  const {
    target = window,
    enabled = true,
    threshold = 50,
  } = options;

  const [startPosition, setStartPosition] = useState<TouchPosition | null>(null);

  const handleTouchStart = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const touchEvent = event as TouchEvent;
      const touch = touchEvent.touches[0];
      setStartPosition({
        x: touch.clientX,
        y: touch.clientY,
      });
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(
    (event: Event) => {
      if (!enabled || !startPosition) return;

      const touchEvent = event as TouchEvent;
      const touch = touchEvent.changedTouches[0];
      const deltaX = touch.clientX - startPosition.x;
      const deltaY = touch.clientY - startPosition.y;

      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          callback(deltaX > 0 ? 'right' : 'left');
        } else {
          callback(deltaY > 0 ? 'down' : 'up');
        }
      }

      setStartPosition(null);
    },
    [enabled, startPosition, threshold, callback]
  );

  useEffect(() => {
    if (!enabled) return;

    target.addEventListener('touchstart', handleTouchStart);
    target.addEventListener('touchend', handleTouchEnd);

    return () => {
      target.removeEventListener('touchstart', handleTouchStart);
      target.removeEventListener('touchend', handleTouchEnd);
    };
  }, [target, handleTouchStart, handleTouchEnd, enabled]);
}

export function usePinch(
  callback: (scale: number) => void,
  options: TouchOptions = {}
) {
  const {
    target = window,
    enabled = true,
  } = options;

  const [startDistance, setStartDistance] = useState<number | null>(null);

  const getDistance = (touches: TouchList) => {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback(
    (event: Event) => {
      const touchEvent = event as TouchEvent;
      if (!enabled || touchEvent.touches.length !== 2) return;

      setStartDistance(getDistance(touchEvent.touches));
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (event: Event) => {
      const touchEvent = event as TouchEvent;
      if (!enabled || !startDistance || touchEvent.touches.length !== 2) return;

      const currentDistance = getDistance(touchEvent.touches);
      const scale = currentDistance / startDistance;
      callback(scale);
    },
    [enabled, startDistance, callback]
  );

  const handleTouchEnd = useCallback(() => {
    setStartDistance(null);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    target.addEventListener('touchstart', handleTouchStart);
    target.addEventListener('touchmove', handleTouchMove);
    target.addEventListener('touchend', handleTouchEnd);
    target.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      target.removeEventListener('touchstart', handleTouchStart);
      target.removeEventListener('touchmove', handleTouchMove);
      target.removeEventListener('touchend', handleTouchEnd);
      target.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [target, handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);
} 