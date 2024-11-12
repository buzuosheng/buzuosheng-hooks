# `useWorker`

一个用于在 Web Worker 中执行耗时计算的 Hook，避免阻塞主线程。

## 介绍

`useWorker` 提供了一个简单的方式来将耗时的计算任务放到 Web Worker 中执行，防止阻塞 UI 渲染。它会自动处理 Worker 的创建、消息传递和清理工作。

## 类型定义

```typescript
interface WorkerResult<R> {
  result: R | null;  // 计算结果
  error: string | null;  // 错误信息
}

function useWorker<T, R>(
  workerFunction: (message: T) => R,
  message: T
): WorkerResult<R>
```

### 参数

- `workerFunction: (message: T) => R` - 需要在 Worker 中执行的函数
- `message: T` - 传递给 Worker 函数的参数

### 返回值

返回一个对象，包含：
- `result: R | null` - 计算结果，计算进行中或出错时为 null
- `error: string | null` - 错误信息，无错误时为 null

## 使用示例

```tsx
import { useWorker } from '@buzuosheng/hooks'

// 耗时计算：斐波那契数列
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function FibonacciCalculator() {
  const [number, setNumber] = useState(40);
  const { result, error } = useWorker(fibonacci, number);

  return (
    <div>
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(Number(e.target.value))}
      />
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {result === null ? (
        <div>计算中...</div>
      ) : (
        <div>结果: {result}</div>
      )}
    </div>
  );
}

// 复杂数据处理示例
interface DataProcessor {
  data: number[];
  threshold: number;
}

function processData({ data, threshold }: DataProcessor) {
  return data.map(item => item * 2)
             .filter(item => item > threshold);
}

function DataProcessing() {
  const [data] = useState(() => Array.from({ length: 1000000 }, 
    (_, i) => i));
  
  const { result, error } = useWorker(processData, {
    data,
    threshold: 1000000
  });

  return (
    <div>
      {error && <div>处理出错: {error}</div>}
      {result === null ? (
        <div>处理中...</div>
      ) : (
        <div>处理完成，结果数量: {result.length}</div>
      )}
    </div>
  );
}
```

## 特性

1. 自动创建和管理 Web Worker
2. 支持任意类型的输入和输出
3. 错误处理和状态管理
4. 自动清理资源
5. 完整的 TypeScript 支持

## 应用场景

- 复杂数学计算
- 大数据处理
- 图像处理
- 文本分析
- 加密/解密操作
- 复杂排序和过滤

## 工作原理

1. 创建包含用户函数的 Worker 代码
2. 通过 Blob URL 初始化 Worker
3. 使用 postMessage 进行通信
4. 处理计算结果和错误
5. 组件卸载时自动清理

## 注意事项

1. Worker 中无法访问 DOM
2. 不支持闭包和外部变量引用
3. 传递的数据会被序列化
4. 适用于 CPU 密集型任务
5. 不适合频繁的小计算
6. 需要浏览器支持 Web Workers

## 性能考虑

- 仅用于耗时计算
- 考虑数据传输开销
- 避免频繁创建 Worker
- 合理设置计算任务大小

## 相关链接

- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)v

## 常见问题

### 递归函数处理

在 Web Worker 中使用递归函数时需要特别注意，因为 Worker 环境与主线程环境不同。以下是一个常见的错误示例：

```typescript
// ❌ 错误示例：在 Worker 中会失败
const fibonacci = (n: number) => (
  n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
);
```

这段代码在 Worker 中会失败，原因是：
1. Worker 中的全局对象是 `self` 而不是 `window`
2. 函数声明无法在闭包中正确引用自身

### 解决方案

需要将递归函数改写为自包含的形式：

```typescript
// ✅ 正确示例：使用内部函数实现递归
const fibonacci = function(n: number) {
  const fibInner = function(n: number): number {
    return n <= 1 ? n : fibInner(n - 1) + fibInner(n - 2);
  };
  return fibInner(n);
};
```

或者使用具名函数表达式：

```typescript
// ✅ 另一种正确写法：使用具名函数表达式
const fibonacci = function calc(n: number): number {
  return n <= 1 ? n : calc(n - 1) + calc(n - 2);
};
```

### 使用示例

```tsx
function FibCalculator() {
  const { result, error } = useWorker(fibonacci, 40);
  
  return (
    <div>
      {error && <div>Error: {error}</div>}
      {result === null ? (
        <div>计算中...</div>
      ) : (
        <div>Fibonacci(40) = {result}</div>
      )}
    </div>
  );
}
```

### 其他注意事项

- 确保递归函数是完全自包含的
- 避免在递归函数中引用外部变量
- 考虑使用迭代方式代替递归，以提高性能
- 对于深度递归，注意调用栈限制