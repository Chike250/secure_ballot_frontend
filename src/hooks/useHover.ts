import { useState, useEffect, useCallback } from 'react';

interface HoverState {
  isHovered: boolean;
  isHovering: boolean;
}

interface HoverOptions {
  target?: EventTarget;
  enabled?: boolean;
  delay?: number;
}

export function useHover(options: HoverOptions = {}) {
  const {
    target = window,
    enabled = true,
    delay = 0,
  } = options;

  const [state, setState] = useState<HoverState>({
    isHovered: false,
    isHovering: false,
  });

  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleMouseEnter = useCallback(
    (event: Event) => {
      if (!enabled) return;

      if (delay > 0) {
        const id = window.setTimeout(() => {
          setState({
            isHovered: true,
            isHovering: true,
          });
        }, delay);
        setTimeoutId(id);
      } else {
        setState({
          isHovered: true,
          isHovering: true,
        });
      }
    },
    [enabled, delay]
  );

  const handleMouseLeave = useCallback(
    (event: Event) => {
      if (!enabled) return;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
        setTimeoutId(null);
      }

      setState({
        isHovered: false,
        isHovering: false,
      });
    },
    [enabled, timeoutId]
  );

  useEffect(() => {
    if (!enabled) return;

    target.addEventListener('mouseenter', handleMouseEnter);
    target.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      target.removeEventListener('mouseenter', handleMouseEnter);
      target.removeEventListener('mouseleave', handleMouseLeave);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [target, handleMouseEnter, handleMouseLeave, enabled, timeoutId]);

  return state;
}

// Common hover hooks
export function useIsHovered(options: HoverOptions = {}) {
  const { isHovered } = useHover(options);
  return isHovered;
}

export function useIsHovering(options: HoverOptions = {}) {
  const { isHovering } = useHover(options);
  return isHovering;
}

// Element hover hooks
export function useElementHover(
  element: HTMLElement | null,
  options: HoverOptions = {}
) {
  const {
    enabled = true,
    delay = 0,
  } = options;

  const [isHovered, setIsHovered] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (!enabled) return;

    if (delay > 0) {
      const id = window.setTimeout(() => {
        setIsHovered(true);
      }, delay);
      setTimeoutId(id);
    } else {
      setIsHovered(true);
    }
  }, [enabled, delay]);

  const handleMouseLeave = useCallback(() => {
    if (!enabled) return;

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    setIsHovered(false);
  }, [enabled, timeoutId]);

  useEffect(() => {
    if (!enabled || !element) return;

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [element, handleMouseEnter, handleMouseLeave, enabled, timeoutId]);

  return isHovered;
}

// Hover with delay hook
export function useHoverWithDelay(
  delay: number,
  options: Omit<HoverOptions, 'delay'> = {}
) {
  return useHover({
    ...options,
    delay,
  });
}

// Hover with callback hook
export function useHoverCallback(
  onHover: () => void,
  onUnhover: () => void,
  options: HoverOptions = {}
) {
  const {
    enabled = true,
    delay = 0,
  } = options;

  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (!enabled) return;

    if (delay > 0) {
      const id = window.setTimeout(() => {
        onHover();
      }, delay);
      setTimeoutId(id);
    } else {
      onHover();
    }
  }, [enabled, delay, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (!enabled) return;

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    onUnhover();
  }, [enabled, timeoutId, onUnhover]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [handleMouseEnter, handleMouseLeave, enabled, timeoutId]);
} 