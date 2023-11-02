# `useWorker`

## Usage

```jsx
import { useWorker } from 'react-hooks-worker'

const fib = (i) => (i <= 1 ? i : fib(i - 1) + fib(i - 2))
const createWorker = () => fib

const CalcFib = ({ count }) => {
  const { result, error } = useWorker(createWorker, count)
  if (error) return <div>Error: {error}</div>
  return <div>Result: {result}</div>
}
```
