import { renderHook, act } from '@testing-library/react';
import { useShallow } from '../src/useShallow';
import { sleep } from '../utils'

describe('useShallow', () => {
  it('should update state only when new state is not shallow equal to current state', () => {
    const { result } = renderHook(() => useShallow({ a: 1, b: 2 }));

    expect(result.current[0]).toEqual({ a: 1, b: 2 });

    act(() => {
      result.current[1]({ a: 1, b: 2 });
    });

    expect(result.current[0]).toEqual({ a: 1, b: 2 });

    act(() => {
      result.current[1]({ a: 2, b: 3 });
    });
    expect(result.current[0]).toEqual({ a: 2, b: 3 });
  });
});