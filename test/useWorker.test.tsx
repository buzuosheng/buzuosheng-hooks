import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { useWorker } from '../src/useWorker';

global.Worker = jest.fn();

describe('basic spec', () => {
  it('should have a function', () => {
    expect(useWorker).toBeDefined();
  });

  it('should create a component', () => {
    const fib = function (i) {
      const fibInner = function (i) {
        return i <= 1 ? i : fibInner(i - 1) + fibInner(i - 2);
      };
      return fibInner(i);
    };
    const CalcFib: React.FC<{ count: number }> = ({ count }) => {
      const [result, error] = useWorker(fib, count);
      if (error) return <div>Error: {error}</div>;
      return <div>Result: {result}</div>;
    };
    const renderer = createRenderer();
    renderer.render(<CalcFib count={5} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});