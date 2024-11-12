/**
 * @fileoverview 提供浅比较状态更新的 Hook
 * @module useShallow
 */

import { useState, useCallback } from 'react';
import shallowEqual from 'shallowequal';

/**
 * 创建一个具有浅比较功能的状态管理 Hook
 * 只有当新旧状态浅比较不相等时才会触发更新
 * 
 * @template T - 状态对象的类型，必须是一个对象
 * @param {T} initialState - 初始状态值
 * @returns {[T, (newState: T) => void]} 返回一个元组，包含当前状态和更新函数
 * 
 * @example
 * ```tsx
 * interface User {
 *   name: string;
 *   age: number;
 * }
 * 
 * function UserProfile() {
 *   const [user, setUser] = useShallow<User>({
 *     name: 'John',
 *     age: 25
 *   });
 * 
 *   const updateAge = () => {
 *     // 只有当新状态与当前状态浅比较不相等时才会触发重渲染
 *     setUser({ ...user, age: user.age + 1 });
 *   };
 * 
 *   return (
 *     <div>
 *       <p>Name: {user.name}</p>
 *       <p>Age: {user.age}</p>
 *       <button onClick={updateAge}>Increment Age</button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @since 1.0.0
 * @see {@link https://github.com/dashed/shallowequal shallowequal}
 */
export function useShallow<T extends object> (initialState: T) {
  const [state, setState] = useState<T>(initialState);

  const setShallowState = useCallback((newState: T) => {
    if (!shallowEqual(state, newState)) {
      setState(newState);
    }
  }, [state]);

  return [state, setShallowState] as const;
}