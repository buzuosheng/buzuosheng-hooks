# `useDebounce`

一个用于处理频繁更新值的防抖 Hook。

## 介绍

`useDebounce` 接收一个值和延迟时间作为参数，返回一个防抖处理后的值。当输入值频繁变化时，只有在指定的延迟时间内没有新的更新时，才会更新返回值。

## 类型定义

```typescript
function useDebounce<T>(value: T, delay: number): T
```

### 参数

- `value: T` - 需要防抖处理的值
- `delay: number` - 防抖延迟时间（毫秒）

### 返回值

- `T` - 防抖处理后的值

## 使用示例

```tsx
import { useState, useEffect } from 'react'
import { useDebounce } from '@buzuosheng/hooks'

export default function SearchComponent() {
  const [text, setText] = useState('Hello')
  const debouncedText = useDebounce(text, 1000)

  useEffect(() => {
    // 只有当 debouncedText 变化时才会执行
    console.log('Debounced value:', debouncedText)
  }, [debouncedText])

  return (
    <div>
      <input
        defaultValue={'Hello'}
        onChange={(e) => {
          setText(e.target.value)
        }}
      />
      <p>实时值: {text}</p>
      <p>防抖值: {debouncedText}</p>
    </div>
  )
}
```

## 应用场景

- 搜索输入框：减少频繁的搜索请求
- 表单实时保存：延迟自动保存的触发
- 窗口大小调整：延迟处理 resize 事件
- 按钮防抖：防止重复提交

## 注意事项

1. 延迟时间 `delay` 建议根据实际场景设置，通常在 300-1000 毫秒之间
2. 当组件卸载时，Hook 会自动清理未执行的防抖操作
3. 如果 `delay` 为 0，将立即更新返回值