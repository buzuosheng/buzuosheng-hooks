import { useCallback, useRef } from 'react';

export function useDebouncedCallback(callback: (...args: any[]) => any, delay: number) {

  const callbackRef = useRef(callback);
  const timerRef = useRef<NodeJS.Timeout | null>();

  callbackRef.current = callback;

  return useCallback((...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}