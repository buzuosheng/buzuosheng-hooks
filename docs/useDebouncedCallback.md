# `useDebouncedCallback`

## Usage

用来处理防抖的函数。接受两个参数`callback`和`delay`，分别为要处理的函数和延迟时间。

```jsx
import { useDebouncedCallback } from '@buzuosheng/hooks'

function Input({ defaultValue }) {
  const [value, setValue] = useState(defaultValue)
  const debounced = useDebouncedCallback((value) => {
    setValue(value)
  }, 1000)

  return (
    <div>
      <input
        defaultValue={defaultValue}
        onChange={(e) => debounced(e.target.value)}
      />
      <p>Debounced value: {value}</p>
    </div>
  )
}
```

## Reference

```ts
const debounced: Function = useDubouncedFunction(fn: Function, delay: number)
```

- **`fn`**_`: Function`_ - 需要防抖执行的函数;
- **`ms`**_`: number`_ - 延迟时间;
- **`debounced`**_`: Function`_ - 处理后的防抖函数
