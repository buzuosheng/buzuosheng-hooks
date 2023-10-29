import { useState, useEffect } from 'react';

export function useWorker(workerFunctionCreator) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const workerFunction = workerFunctionCreator()

  useEffect(() => {
    const workerBlob = new Blob([
      `postMessage((${workerFunction.toString()})());`
    ]);
    const workerUrl = URL.createObjectURL(workerBlob);
    const worker = new Worker(workerUrl);

    worker.onmessage = (e) => {
      setResult(e.data);
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