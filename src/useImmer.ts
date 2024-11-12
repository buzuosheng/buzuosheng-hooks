/**
 * @fileoverview 提供基于 Immer 的状态管理 Hook
 * @module useImmer
 */

import { useState, useCallback } from 'react';
import { produce, Draft } from 'immer';

/**
 * 创建一个基于 Immer 的状态管理 Hook，用于简化不可变状态的更新操作
 * 
 * @template T - 状态对象的类型，必须是一个对象
 * @param {T | (() => T)} initialValue - 初始状态值或返回初始状态的函数
 * @returns {[T, (updater: (draft: Draft<T>) => void) => void]} 返回一个元组，包含当前状态和更新函数
 * 
 * @example
 * ```tsx
 * interface Todo {
 *   title: string;
 *   done: boolean;
 * }
 * 
 * function TodoList() {
 *   const [todos, updateTodos] = useImmer<Todo[]>([]);
 * 
 *   const addTodo = useCallback((title: string) => {
 *     updateTodos(draft => {
 *       draft.push({ title, done: false });
 *     });
 *   }, []);
 * 
 *   const toggleTodo = useCallback((index: number) => {
 *     updateTodos(draft => {
 *       draft[index].done = !draft[index].done;
 *     });
 *   }, []);
 * 
 *   return (
 *     // 组件渲染逻辑
 *   );
 * }
 * ```
 * 
 * @since 1.0.0
 * @see {@link https://immerjs.github.io/immer/ Immer}
 */
export function useImmer<T extends object> (
  initialValue: T | (() => T)
): [T, (updater: (draft: Draft<T>) => void) => void] {
  const [value, setValue] = useState<T>(initialValue);

  const updateValue = useCallback((updater: (draft: Draft<T>) => void) => {
    setValue((currentValue) => produce(currentValue, updater));
  }, []);

  return [value, updateValue];
}
