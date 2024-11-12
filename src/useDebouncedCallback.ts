/**
 * @fileoverview 提供防抖回调函数的 Hook
 * @module useDebouncedCallback
 */

import { useCallback, useRef, useEffect } from 'react';

/**
 * 创建一个防抖回调函数的 Hook
 * 
 * @template T - 回调函数的类型
 * @param {T} callback - 需要防抖的回调函数
 * @param {number} delay - 防抖延迟时间（毫秒）
 * @returns {(...args: Parameters<T>) => void} 防抖处理后的回调函数
 * 
 * @example
 * ```tsx
 * function SearchComponent() {
 *   const handleSearch = useDebouncedCallback((searchTerm: string) => {
 *     // 执行搜索操作
 *     console.log('Searching for:', searchTerm);
 *   }, 500);
 * 
 *   return (
 *     <input
 *       onChange={e => handleSearch(e.target.value)}
 *     />
 *   );
 * }
 * ```
 * 
 * @since 1.0.0
 */
export function useDebouncedCallback<T extends (...args: any[]) => any> (
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const callbackRef = useRef<T>(callback);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}