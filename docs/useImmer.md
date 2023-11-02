# `useImmer`

用来处理不可变状态的Hook。

## Usage

```jsx
import { useImmer } from "@buzuosheng/hooks";

function App() {
  const [state, setState] = useImmer({ count: 0 });

  function increment() {
    setState(draft => {
      draft.count++;
    });
  }

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```
