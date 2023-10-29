import { useState, useCallback } from 'react';
import { produce, Draft } from 'immer';

export function useImmer<T>(initialValue: T): [T, (updater: (draft: Draft<T>) => void) => void] {
  const [value, setValue] = useState<T>(initialValue);

  const updateValue = useCallback((updater: (draft: Draft<T>) => void) => {
    setValue(currentValue => produce(currentValue, updater));
  }, []);

  return [value, updateValue];
}
