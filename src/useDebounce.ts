import { useState, useEffect, useRef } from 'react';

/**
 * 防抖 Hook，用于处理频繁更新的值
 * @template T 值的类型
 * @param value 需要防抖处理的值
 * @param delay 防抖延迟时间（毫秒）
 * @returns 防抖处理后的值
 * @example
 * ```tsx
 * const [text, setText] = useState('hello');
 * const debouncedText = useDebounce(text, 500);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}