import { useState, useEffect, useCallback } from "react";

interface WorkerResult<R> {
  result: R | null;
  error: string | null;
}

/**
 * @fileoverview 提供 Web Worker 封装的 Hook，用于处理耗时计算
 * @module useWorker
 */

/**
 * Worker 执行结果的接口定义
 * @template R - 计算结果的类型
 */
interface WorkerResult<R> {
  /** 计算结果，如果出错则为 null */
  result: R | null;
  /** 错误信息，如果计算成功则为 null */
  error: string | null;
}

/**
 * 创建一个 Web Worker 来执行耗时计算的 Hook
 * 
 * @template T - 输入参数的类型
 * @template R - 计算结果的类型
 * @param {(message: T) => R} workerFunction - 需要在 Worker 中执行的函数
 * @param {T} message - 传递给 Worker 函数的参数
 * @returns {WorkerResult<R>} 包含计算结果或错误信息的对象
 * 
 * @example
 * ```tsx
 * // 计算斐波那契数列
 * function fibonacci(n: number): number {
 *   return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
 * }
 * 
 * function FibCalculator() {
 *   const { result, error } = useWorker(fibonacci, 40);
 * 
 *   if (error) return <div>Error: {error}</div>;
 *   if (result === null) return <div>Calculating...</div>;
 *   return <div>Result: {result}</div>;
 * }
 * ```
 * 
 * @since 1.0.0
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API Web Workers API}
 */
export function useWorker<T, R>(
  workerFunction: (message: T) => R,
  message: T
): WorkerResult<R> {
  const [state, setState] = useState<WorkerResult<R>>({
    result: null,
    error: null
  });

  const createWorker = useCallback(() => {
    const workerCode = `
      self.onmessage = function(e) {
        try {
          const result = (${workerFunction.toString()})(e.data);
          self.postMessage(result);
        } catch (error) {
          self.postMessage({ error: error.message });
        }
      }
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
  }, [workerFunction]);

  useEffect(() => {
    const blobURL = createWorker();
    const worker = new Worker(blobURL);

    worker.onmessage = (e) => {
      setState({
        result: e.data as R,
        error: null
      });
      URL.revokeObjectURL(blobURL);
    };

    worker.onerror = (e) => {
      setState({
        result: null,
        error: e.message
      });
      URL.revokeObjectURL(blobURL);
    };

    worker.postMessage(message);

    return () => {
      worker.terminate();
      URL.revokeObjectURL(blobURL);
    };
  }, [message, createWorker]);

  return state;
}
