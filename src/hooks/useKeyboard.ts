import { useEffect, useCallback } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface KeyMap {
  [key: string]: KeyHandler;
}

interface KeyboardOptions {
  target?: EventTarget;
  event?: 'keydown' | 'keyup' | 'keypress';
  enabled?: boolean;
}

export function useKeyboard(
  keyMap: KeyMap,
  options: KeyboardOptions = {}
) {
  const {
    target = window,
    event = 'keydown',
    enabled = true,
  } = options;

  const handleKeyEvent = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const keyboardEvent = event as KeyboardEvent;
      const handler = keyMap[keyboardEvent.key];
      if (handler) {
        handler(keyboardEvent);
      }
    },
    [keyMap, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    target.addEventListener(event, handleKeyEvent);

    return () => {
      target.removeEventListener(event, handleKeyEvent);
    };
  }, [target, event, handleKeyEvent, enabled]);
}

// Common key combinations
export const useKeyPress = (
  key: string,
  callback: KeyHandler,
  options: KeyboardOptions = {}
) => {
  useKeyboard(
    {
      [key]: callback,
    },
    options
  );
};

export const useKeyDown = (
  key: string,
  callback: KeyHandler,
  options: Omit<KeyboardOptions, 'event'> = {}
) => {
  useKeyPress(key, callback, { ...options, event: 'keydown' });
};

export const useKeyUp = (
  key: string,
  callback: KeyHandler,
  options: Omit<KeyboardOptions, 'event'> = {}
) => {
  useKeyPress(key, callback, { ...options, event: 'keyup' });
};

// Common key combinations
export const useEscapeKey = (
  callback: KeyHandler,
  options: Omit<KeyboardOptions, 'event'> = {}
) => {
  useKeyPress('Escape', callback, options);
};

export const useEnterKey = (
  callback: KeyHandler,
  options: Omit<KeyboardOptions, 'event'> = {}
) => {
  useKeyPress('Enter', callback, options);
};

export const useSpaceKey = (
  callback: KeyHandler,
  options: Omit<KeyboardOptions, 'event'> = {}
) => {
  useKeyPress(' ', callback, options);
};

export const useArrowKeys = (
  callbacks: {
    up?: KeyHandler;
    down?: KeyHandler;
    left?: KeyHandler;
    right?: KeyHandler;
  },
  options: Omit<KeyboardOptions, 'event'> = {}
) => {
  useKeyboard(
    {
      ArrowUp: callbacks.up || (() => {}),
      ArrowDown: callbacks.down || (() => {}),
      ArrowLeft: callbacks.left || (() => {}),
      ArrowRight: callbacks.right || (() => {}),
    },
    options
  );
}; 