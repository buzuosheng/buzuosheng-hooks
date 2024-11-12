# `useShallow`

一个具有浅比较功能的状态管理 Hook，只有在状态真正发生变化时才会触发更新。

## 介绍

`useShallow` 通过浅比较来优化状态更新，避免不必要的重渲染。当新旧状态的浅比较结果相等时，将跳过状态更新。

## 类型定义

```typescript
function useShallow<T extends object>(
  initialState: T
): [T, (newState: T) => void]
```

### 参数

- `initialState: T` - 初始状态值，必须是一个对象

### 返回值

返回一个元组，包含：
- `state: T` - 当前状态
- `setState: (newState: T) => void` - 状态更新函数，会进行浅比较

## 使用示例

```tsx
import { useShallow } from '@buzuosheng/hooks'

interface UserProfile {
  name: string
  age: number
  settings: {
    theme: string
    notifications: boolean
  }
}

function UserSettings() {
  const [profile, setProfile] = useShallow<UserProfile>({
    name: 'John',
    age: 25,
    settings: {
      theme: 'light',
      notifications: true
    }
  })

  // 不会触发重渲染，因为新旧状态浅比较相等
  const updateName = () => {
    setProfile({
      ...profile,
      name: 'John' // 相同的值
    })
  }

  // 会触发重渲染，因为年龄发生了变化
  const incrementAge = () => {
    setProfile({
      ...profile,
      age: profile.age + 1
    })
  }

  // 会触发重渲染，因为设置对象是新的引用
  const toggleTheme = () => {
    setProfile({
      ...profile,
      settings: {
        ...profile.settings,
        theme: profile.settings.theme === 'light' ? 'dark' : 'light'
      }
    })
  }

  return (
    <div>
      <h2>{profile.name}</h2>
      <p>Age: {profile.age}</p>
      <p>Theme: {profile.settings.theme}</p>
      <button onClick={updateName}>Update Name</button>
      <button onClick={incrementAge}>Increment Age</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}
```

## 特性

1. 自动浅比较状态更新
2. 避免不必要的重渲染
3. 类型安全
4. 使用简单，API 与 useState 类似

## 应用场景

- 表单状态管理
- 列表数据更新
- 配置对象管理
- 用户设置管理
- 任何需要优化重渲染的场景

## 工作原理

1. 使用 shallowEqual 进行浅比较
2. 只比较对象的直接属性
3. 使用 Object.is() 比较基本类型值
4. 跳过相等状态的更新

## 注意事项

1. 只适用于对象类型的状态
2. 只进行一层深度的比较
3. 对于深层对象的变化，需要创建新的引用
4. 不要在更新函数中直接修改状态对象
5. 对于需要深比较的场景，考虑使用其他方案

## 性能考虑

- 浅比较的开销通常比重渲染小
- 适合扁平的数据结构
- 对于频繁更新的状态特别有效
- 可以与 React.memo 配合使用

## 相关链接

- [shallowequal 文档](https://github.com/dashed/shallowequal)
- [React 状态更新](https://react.dev/learn/updating-objects-in-state)