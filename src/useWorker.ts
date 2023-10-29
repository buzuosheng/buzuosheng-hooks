import { useState, useEffect } from 'react';

type workerFunction = (i: any) => any

export function useWorker<T>(workerFunctionCreator: (...args: any[]) => workerFunction) {
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const workerFunction = workerFunctionCreator()

  useEffect(() => {
    const workerBlob = new Blob([
      `postMessage((${workerFunction.toString()})());`
    ]);
    const workerUrl = URL.createObjectURL(workerBlob);
    const worker = new Worker(workerUrl);

    worker.onmessage = (e) => {
      setResult(e.data as T);
      URL.revokeObjectURL(workerUrl);
    };

    worker.onerror = (e) => {
      setError(e);
      URL.revokeObjectURL(workerUrl);
    };

    return () => {
      worker.terminate();
    };
  }, [workerFunction]);

  return [result, error];
}