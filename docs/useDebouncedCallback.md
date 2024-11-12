# `useDebouncedCallback`

一个用于创建防抖回调函数的 Hook。

## 介绍

`useDebouncedCallback` 接收一个回调函数和延迟时间作为参数，返回一个经过防抖处理的新函数。当这个函数被频繁调用时，只有在指定的延迟时间内没有新的调用时，才会执行回调函数。

## 类型定义

```typescript
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void
```

### 参数

- `callback: T` - 需要防抖处理的回调函数
- `delay: number` - 防抖延迟时间（毫秒）

### 返回值

- `(...args: Parameters<T>) => void` - 防抖处理后的函数，参数类型与原函数相同

## 使用示例

```tsx
import { useState } from 'react'
import { useDebouncedCallback } from '@buzuosheng/hooks'

export default function SearchComponent() {
  const [searchResults, setSearchResults] = useState([])

  // 创建防抖搜索函数
  const handleSearch = useDebouncedCallback((searchTerm: string) => {
    // 模拟 API 调用
    fetch(`/api/search?q=${searchTerm}`)
      .then(res => res.json())
      .then(data => setSearchResults(data))
  }, 500)

  return (
    <div>
      <input
        type="text"
        placeholder="搜索..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <ul>
        {searchResults.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
```

## 应用场景

- 搜索框实时搜索
- 表单实时验证
- 窗口 resize 事件处理
- 自动保存功能
- 按钮点击防抖

## 特性

1. 保持最新的回调引用
2. 自动清理未执行的定时器
3. 支持任意参数类型的函数
4. 类型安全，完整的 TypeScript 支持

## 注意事项

1. 返回的防抖函数是通过 `useCallback` 记忆化的，不会在重渲染时改变
2. 原始回调函数的更新会自动同步到防抖函数中
3. 组件卸载时会自动清理未执行的回调
4. delay 参数变化会重新创建防抖函数