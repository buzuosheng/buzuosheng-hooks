/**
 * 暂停执行指定的毫秒数
 * @param time 暂停时间（毫秒），必须是非负数
 * @throws {Error} 如果时间为负数则抛出错误
 * @example
 * await sleep(1000); // 暂停1秒
 * await sleep(); // 暂停默认时间（0毫秒）
 */
export function sleep (time: number = 0): Promise<void> {
  if (time < 0) {
    throw new Error('Sleep time must be greater than or equal to 0');
  }

  return new Promise<void>((resolve) =>
    setTimeout(resolve, time)
  );
}