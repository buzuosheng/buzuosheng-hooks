# `useImmer`

一个基于 Immer 的状态管理 Hook，用于简化 React 中不可变状态的更新操作。

## 介绍

`useImmer` 是对 Immer 的 React Hook 封装，让你能够以可变的方式编写不可变的更新逻辑。它特别适合处理复杂的嵌套对象状态更新。

## 类型定义

```typescript
function useImmer<T extends object>(
  initialValue: T | (() => T)
): [T, (updater: (draft: Draft<T>) => void) => void]
```

### 参数

- `initialValue: T | (() => T)` - 初始状态值或返回初始状态的函数

### 返回值

返回一个元组，包含：
- `state: T` - 当前状态
- `updater: (draft: Draft<T>) => void` - 状态更新函数

## 使用示例

```tsx
import { useImmer } from '@buzuosheng/hooks'

interface Todo {
  id: number
  title: string
  done: boolean
  tags: string[]
}

function TodoApp() {
  const [todos, updateTodos] = useImmer<Todo[]>([])

  // 添加待办事项
  const addTodo = (title: string) => {
    updateTodos(draft => {
      draft.push({
        id: Date.now(),
        title,
        done: false,
        tags: []
      })
    })
  }

  // 切换完成状态
  const toggleTodo = (id: number) => {
    updateTodos(draft => {
      const todo = draft.find(t => t.id === id)
      if (todo) {
        todo.done = !todo.done
      }
    })
  }

  // 添加标签
  const addTag = (todoId: number, tag: string) => {
    updateTodos(draft => {
      const todo = draft.find(t => t.id === todoId)
      if (todo && !todo.tags.includes(tag)) {
        todo.tags.push(tag)
      }
    })
  }

  return (
    <div>
      <button onClick={() => addTodo('新待办事项')}>添加待办</button>
      {todos.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.title}</span>
          <button onClick={() => addTag(todo.id, '重要')}>
            添加标签
          </button>
          <div>标签: {todo.tags.join(', ')}</div>
        </div>
      ))}
    </div>
  )
}
```

## 特性

1. 简化复杂状态更新
2. 保持状态不可变性
3. 支持嵌套对象的更新
4. 完整的 TypeScript 支持
5. 自动优化性能（通过结构共享）

## 应用场景

- 复杂表单状态管理
- 嵌套数据结构更新
- 列表项目的增删改
- 深层对象属性修改
- 状态树管理

## 注意事项

1. 初始值必须是对象或数组
2. 不要在 updater 函数外部直接修改 draft 状态
3. updater 函数内的修改会自动转换为不可变更新
4. 返回的状态是只读的，只能通过 updater 函数修改
5. 对于简单的状态更新，使用普通的 useState 可能更合适

## 相关链接

- [Immer 官方文档](https://immerjs.github.io/immer/)
- [Immer 介绍](https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3)