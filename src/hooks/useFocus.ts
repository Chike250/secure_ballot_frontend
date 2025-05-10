import { useState, useEffect, useCallback } from 'react';

interface FocusState {
  isFocused: boolean;
  isBlurred: boolean;
}

interface FocusOptions {
  target?: EventTarget;
  enabled?: boolean;
}

export function useFocus(options: FocusOptions = {}) {
  const {
    target = window,
    enabled = true,
  } = options;

  const [state, setState] = useState<FocusState>({
    isFocused: false,
    isBlurred: true,
  });

  const handleFocus = useCallback(
    (event: FocusEvent) => {
      if (!enabled) return;

      setState({
        isFocused: true,
        isBlurred: false,
      });
    },
    [enabled]
  );

  const handleBlur = useCallback(
    (event: FocusEvent) => {
      if (!enabled) return;

      setState({
        isFocused: false,
        isBlurred: true,
      });
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    target.addEventListener('focus', handleFocus);
    target.addEventListener('blur', handleBlur);

    return () => {
      target.removeEventListener('focus', handleFocus);
      target.removeEventListener('blur', handleBlur);
    };
  }, [target, handleFocus, handleBlur, enabled]);

  return state;
}

// Common focus hooks
export function useIsFocused(options: FocusOptions = {}) {
  const { isFocused } = useFocus(options);
  return isFocused;
}

export function useIsBlurred(options: FocusOptions = {}) {
  const { isBlurred } = useFocus(options);
  return isBlurred;
}

// Element focus hooks
export function useElementFocus(
  element: HTMLElement | null,
  options: FocusOptions = {}
) {
  const {
    enabled = true,
  } = options;

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    if (!enabled) return;
    setIsFocused(true);
  }, [enabled]);

  const handleBlur = useCallback(() => {
    if (!enabled) return;
    setIsFocused(false);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !element) return;

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, [element, handleFocus, handleBlur, enabled]);

  return isFocused;
}

// Focus trap hook
export function useFocusTrap(
  element: HTMLElement | null,
  options: FocusOptions & { enabled?: boolean } = {}
) {
  const {
    enabled = true,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || !element) return;

      if (event.key === 'Tab') {
        const focusableElements = element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusableElement = focusableElements[0] as HTMLElement;
        const lastFocusableElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            event.preventDefault();
          }
        }
      }
    },
    [element, enabled]
  );

  useEffect(() => {
    if (!enabled || !element) return;

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [element, handleKeyDown, enabled]);
}

// Focus management hook
export function useFocusManagement(
  element: HTMLElement | null,
  options: FocusOptions & { enabled?: boolean } = {}
) {
  const {
    enabled = true,
  } = options;

  const [previousActiveElement, setPreviousActiveElement] = useState<HTMLElement | null>(
    null
  );

  const focus = useCallback(() => {
    if (!enabled || !element) return;

    setPreviousActiveElement(document.activeElement as HTMLElement);
    element.focus();
  }, [element, enabled]);

  const blur = useCallback(() => {
    if (!enabled || !element) return;

    element.blur();
  }, [element, enabled]);

  const restoreFocus = useCallback(() => {
    if (!enabled || !previousActiveElement) return;

    previousActiveElement.focus();
  }, [enabled, previousActiveElement]);

  return {
    focus,
    blur,
    restoreFocus,
  };
} 