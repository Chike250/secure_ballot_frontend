import { useState, useEffect, useCallback } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

interface ScrollState extends ScrollPosition {
  isScrolling: boolean;
  direction: 'up' | 'down' | 'left' | 'right' | null;
  velocity: number;
}

interface ScrollOptions {
  target?: EventTarget;
  enabled?: boolean;
  throttle?: number;
}

export function useScroll(options: ScrollOptions = {}) {
  const {
    target = window,
    enabled = true,
    throttle = 100,
  } = options;

  const [state, setState] = useState<ScrollState>({
    x: 0,
    y: 0,
    isScrolling: false,
    direction: null,
    velocity: 0,
  });

  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const now = Date.now();
      if (now - lastScrollTime < throttle) return;

      const target = event.target as HTMLElement;
      const x = target.scrollLeft || window.pageXOffset;
      const y = target.scrollTop || window.pageYOffset;

      const direction = y > lastScrollY ? 'down' : 'up';
      const velocity = Math.abs(y - lastScrollY) / (now - lastScrollTime);

      setState({
        x,
        y,
        isScrolling: true,
        direction,
        velocity,
      });

      setLastScrollTime(now);
      setLastScrollY(y);
    },
    [enabled, throttle, lastScrollTime, lastScrollY]
  );

  const handleScrollEnd = useCallback(() => {
    if (!enabled) return;

    setState((prev) => ({
      ...prev,
      isScrolling: false,
      direction: null,
      velocity: 0,
    }));
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    target.addEventListener('scroll', handleScroll);
    target.addEventListener('scrollend', handleScrollEnd);

    return () => {
      target.removeEventListener('scroll', handleScroll);
      target.removeEventListener('scrollend', handleScrollEnd);
    };
  }, [target, handleScroll, handleScrollEnd, enabled]);

  return state;
}

// Common scroll event hooks
export function useScrollPosition(options: ScrollOptions = {}) {
  const { x, y } = useScroll(options);
  return { x, y };
}

export function useScrollDirection(options: ScrollOptions = {}) {
  const { direction } = useScroll(options);
  return direction;
}

export function useScrollVelocity(options: ScrollOptions = {}) {
  const { velocity } = useScroll(options);
  return velocity;
}

export function useScrollTo(
  options: ScrollOptions & { behavior?: ScrollBehavior } = {}
) {
  const {
    target = window,
    enabled = true,
    behavior = 'smooth',
  } = options;

  const scrollTo = useCallback(
    (x: number, y: number) => {
      if (!enabled) return;

      if (target === window) {
        window.scrollTo({
          left: x,
          top: y,
          behavior,
        });
      } else {
        (target as HTMLElement).scrollTo({
          left: x,
          top: y,
          behavior,
        });
      }
    },
    [target, enabled, behavior]
  );

  const scrollToTop = useCallback(() => {
    scrollTo(0, 0);
  }, [scrollTo]);

  const scrollToBottom = useCallback(() => {
    if (target === window) {
      scrollTo(0, document.documentElement.scrollHeight);
    } else {
      scrollTo(0, (target as HTMLElement).scrollHeight);
    }
  }, [scrollTo, target]);

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom,
  };
}

export function useScrollIntoView(
  options: ScrollOptions & {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  } = {}
) {
  const {
    target = window,
    enabled = true,
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest',
  } = options;

  const scrollIntoView = useCallback(
    (element: HTMLElement) => {
      if (!enabled) return;

      element.scrollIntoView({
        behavior,
        block,
        inline,
      });
    },
    [enabled, behavior, block, inline]
  );

  return scrollIntoView;
} 