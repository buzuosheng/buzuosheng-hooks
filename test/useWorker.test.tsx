import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { renderHook, act } from '@testing-library/react';
import { useWorker } from '../src/useWorker';

global.Worker = jest.fn();

describe('useWorker hook', () => {
  let mockWorker: any;

  beforeEach(() => {
    mockWorker = {
      postMessage: jest.fn(),
      terminate: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    global.Worker = jest.fn(() => mockWorker);
    global.URL.createObjectURL = jest.fn(() => 'fake-blob-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  it('应该正确处理成功的计算结果', () => {
    const testFn = (x: number) => x * 2;
    const { result } = renderHook(() => useWorker(testFn, 5));

    // 模拟 worker 返回结果
    const messageCallback = mockWorker.onmessage;
    act(() => {
      messageCallback({ data: 10 });
    });

    expect(result.current.result).toBe(10);
    expect(result.current.error).toBeNull();
  });

  it('应该正确处理错误情况', () => {
    const testFn = () => { throw new Error('测试错误'); };
    const { result } = renderHook(() => useWorker(testFn, null));

    // 模拟 worker 错误
    const errorCallback = mockWorker.onerror;
    act(() => {
      errorCallback({ message: '测试错误' });
    });

    expect(result.current.result).toBeNull();
    expect(result.current.error).toBe('测试错误');
  });

  it('应该在组件中正确渲染结果', () => {
    const fib = (i: number) => i <= 1 ? i : fib(i - 1) + fib(i - 2);
    const CalcFib: React.FC<{ count: number }> = ({ count }) => {
      const { result, error } = useWorker(fib, count);
      if (error) return <div>Error: {error}</div>;
      if (result === null) return <div>计算中...</div>;
      return <div>Result: {result}</div>;
    };

    const renderer = createRenderer();
    renderer.render(<CalcFib count={5} />);
    const output = renderer.getRenderOutput();

    expect(output.type).toBe('div');
    expect(output.props.children).toContain('计算中...');
  });
});