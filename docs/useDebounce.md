# `useDebounce`

该函数接受`debounceValue`参数和一个`delay`参数。分别表示要防抖处理的值和延迟时间。

## Usage

```jsx
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

export default function App() {
  const [text, setText] = useState('Hello')
  const [value] = useDebounce(text, 1000)

  useEffect(() => {
    console.log('Debounced value:', value)
  }, [value])

  return (
    <div>
      <input
        defaultValue={'Hello'}
        onChange={(e) => {
          setText(e.target.value)
        }}
      />
      <p>Actual value: {text}</p>
      <p>Debounced value: {value}</p>
    </div>
  )
}
```

## Reference

```ts
const debouncedValue: T = useDebounce(value: T, delay: number);
```

- **`value`**_`: T`_ - 被处理的值;
- **`delay`**_`: number`_ - 延迟的毫秒数
- **`debouncedValue`**_`: T`_ - 防抖处理后的值
