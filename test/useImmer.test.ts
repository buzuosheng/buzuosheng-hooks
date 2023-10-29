import { renderHook, act } from '@testing-library/react';
import { useImmer } from '../src/useImmer';

test('should update state correctly', () => {
  const { result } = renderHook(() => useImmer({ count: 0 }));

  expect(result.current[0]).toEqual({ count: 0 });

  act(() => {
    result.current[1](draft => { draft.count++ });
  });

  expect(result.current[0]).toEqual({ count: 1 });

  act(() => {
    result.current[1](draft => ({ count: draft.count + 1 }))
  })

  expect(result.current[0]).toEqual({ count: 2 })
});