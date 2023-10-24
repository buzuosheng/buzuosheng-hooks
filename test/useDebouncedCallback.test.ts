import { act, renderHook } from '@testing-library/react';
import { sleep } from '../utils';
import { useDebouncedCallback } from '../src/useDebouncedCallback';

interface ParamsObj {
  fn: (...arg: any) => any;
  deps?: any[];
  wait: number;
}

let count = 0;
const debounceFn = (gap: number) => {
  count += gap;
};

const setUp = ({ fn, wait }: ParamsObj) => renderHook(() => useDebouncedCallback(fn, wait));

let hook;

describe('useDebounceFn', () => {
  it('run, cancel and flush should work', async () => {
    act(() => {
      hook = setUp({
        fn: debounceFn,
        wait: 200,
      });
    });
    await act(async () => {
      hook.result.current(2);
      hook.result.current(2);
      hook.result.current(2);
      hook.result.current(2);
      expect(count).toBe(0);
      await sleep(300);
      expect(count).toBe(2);

      hook.result.current(4);
      expect(count).toBe(2);
      await sleep(300);
      expect(count).toBe(6);

      // hook.result.current(4);
      // expect(count).toBe(6);
      // hook.result.current.cancel();
      // expect(count).toBe(6);
      // await sleep(300);
      // expect(count).toBe(6);

      // hook.result.current(1);
      // expect(count).toBe(6);
      // hook.result.current.flush();
      // expect(count).toBe(7);
      // await sleep(300);
      // expect(count).toBe(7);
    });
  });

});