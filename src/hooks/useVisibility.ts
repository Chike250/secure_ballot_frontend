import { useState, useEffect, useCallback } from 'react';

interface VisibilityState {
  isVisible: boolean;
  visibilityState: DocumentVisibilityState;
}

interface VisibilityOptions {
  target?: EventTarget;
  enabled?: boolean;
}

export function useVisibility(options: VisibilityOptions = {}) {
  const {
    target = document,
    enabled = true,
  } = options;

  const [state, setState] = useState<VisibilityState>({
    isVisible: true,
    visibilityState: 'visible',
  });

  const handleVisibilityChange = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const visibilityState = document.visibilityState;
      setState({
        isVisible: visibilityState === 'visible',
        visibilityState,
      });
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    // Set initial state
    const visibilityState = document.visibilityState;
    setState({
      isVisible: visibilityState === 'visible',
      visibilityState,
    });

    target.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      target.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [target, handleVisibilityChange, enabled]);

  return state;
}

// Common visibility hooks
export function useIsVisible(options: VisibilityOptions = {}) {
  const { isVisible } = useVisibility(options);
  return isVisible;
}

export function useVisibilityState(options: VisibilityOptions = {}) {
  const { visibilityState } = useVisibility(options);
  return visibilityState;
}

// Page visibility hooks
export function usePageVisibility(options: VisibilityOptions = {}) {
  const { isVisible } = useVisibility(options);
  return isVisible;
}

export function usePageHidden(options: VisibilityOptions = {}) {
  const { isVisible } = useVisibility(options);
  return !isVisible;
}

// Element visibility hooks
export function useElementVisibility(
  element: HTMLElement | null,
  options: VisibilityOptions & { threshold?: number } = {}
) {
  const {
    enabled = true,
    threshold = 0,
  } = options;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, enabled, threshold]);

  return isVisible;
}

// Element visibility with percentage
export function useElementVisibilityPercentage(
  element: HTMLElement | null,
  options: VisibilityOptions = {}
) {
  const {
    enabled = true,
  } = options;

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!enabled || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersectionRatio = entry.intersectionRatio;
        setPercentage(intersectionRatio * 100);
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, enabled]);

  return percentage;
}

// Element visibility with direction
export function useElementVisibilityDirection(
  element: HTMLElement | null,
  options: VisibilityOptions = {}
) {
  const {
    enabled = true,
  } = options;

  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!enabled || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const currentScrollY = window.scrollY;
          const newDirection = currentScrollY > lastScrollY ? 'down' : 'up';
          setDirection(newDirection);
          setLastScrollY(currentScrollY);
        }
      },
      {
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, enabled, lastScrollY]);

  return direction;
} 