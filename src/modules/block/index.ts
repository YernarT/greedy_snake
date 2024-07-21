export interface I_BlockOptions {
  x: number;
  y: number;
  strokeStyle: string;
  size: number;
}

/**
 * 绘制方块
 * 通过 `performance` API 计算
 * 绘制一个方块所需时间不到 1 毫秒
 * 在 16寸 笔记本电脑屏幕上绘制整个游戏地图也仅需 1.1 毫秒
 */
export function createBlock(
  ctx: CanvasRenderingContext2D,
  { x, y, strokeStyle, size }: I_BlockOptions
) {
  // @TODO: 待优化的点, 不需要每次都调用 `setLineDash`,
  // 通过 Performace 调查发现多次调用将消耗 130+ ms
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = strokeStyle;
  ctx.strokeRect(x, y, size, size);
}
