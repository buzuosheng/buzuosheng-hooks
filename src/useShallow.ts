import { useState } from 'react';
import shallowEqual from 'shallowequal';

export function useShallow<T extends object>(initialState: T): [T, (newState: T) => void] {
  const [state, setState] = useState(initialState);

  const setShallowState = (newState: T) => {
    if (!shallowEqual(state, newState)) {
      setState(newState);
    }
  };

  return [state, setShallowState];
}