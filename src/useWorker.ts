import { useState, useEffect } from "react";

export function useWorker<T, R>(
  workerFunction: (message: T) => R,
  messageToWorker: T
) {
  const [result, setResult] = useState<R | null>(null);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const workerCode = `
    onmessage = function(e) {
      var result = (${workerFunction.toString()})(e.data);
      postMessage(result);
    }
  `;
    const blob = new Blob([workerCode]);
    const blobURL = window.URL.createObjectURL(blob);
    const worker = new Worker(blobURL);

    worker.onmessage = function (e) {
      setResult(e.data as R);
      URL.revokeObjectURL(blobURL)
    };

    worker.onerror = function (e) {
      setError(e.message);
      URL.revokeObjectURL(blobURL)
    };

    worker.postMessage(messageToWorker);

    return () => {
      worker.terminate();
      URL.revokeObjectURL(blobURL);
    };
  }, [workerFunction, messageToWorker]);

  return [result, error];
}
