# `useWorker`

## Usage

```jsx
function App() {
  const fun = (e) => e
  const messageToWorker = 'hello, world!'
  const [result, error] = useWorker(fun, messageToWorker)

  console.log('res', result)
  return (
    <div>
      <p>Message from worker: {result}</p>
    </div>
  )
}
```

## Reference

```ts
const [result, error]: [R, string | null] =
  useDubouncedFunction<T, R>(fn: (message: T) => R, message: T);
```

- **`fn`**_`: Function`_ - 需要在 web Worker 中执行的函数;
- **`message`**_`: T`_ - 需要为函数传递的参数;
- **`result`**_`: R`_ - 函数执行的结果;
- **`error`**_`: string | null`_ - 如果函数执行错误返回的错误信息

## issue

> 在测试过程中，发现递归函数会出现一些问题，导致不能正确的返回结果。如以下代码：

```js
const fib = (i) => (i <= 1 ? i : fib(i - 1) + fib(i - 2))
```

这是由于在 Worker 中，全局对象不是主线程中的`window`对象，而是`self`对象。会报错`fib`未声明。
需要将代码在代码中再次进行声明，改写如下：

```js
const fib = function (i) {
  const fibInner = function (i) {
    return i <= 1 ? i : fibInner(i - 1) + fibInner(i - 2)
  }
  return fibInner(i)
}
```
