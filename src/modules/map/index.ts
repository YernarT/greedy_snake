// Types
import type { T_ScreenSize, T_Position } from "@/modules/dto";

// Modules
import { createBlock } from "@/modules/block";

/**
 * 该模块用于地图的逻辑
 */
export default class Map {
  // 地图方块样式
  strokeStyle = "#666";
  // 边缘方块坐标
  topEdge!: T_Position[];
  leftEdge!: T_Position[];
  rightEdge!: T_Position[];
  bottomEdge!: T_Position[];

  constructor() {
    this.setEdgePosition();
  }

  /**
   * 获取屏幕尺寸
   */
  static getScreenSize(): T_ScreenSize {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    const screenHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    return { screenWidth, screenHeight };
  }

  /**
   * 计算方格大小
   */
  static getBlockSize(): number {
    const { screenWidth } = Map.getScreenSize();

    // 大屏幕
    if (screenWidth >= 992) {
      return 36;
      // 中屏幕
    } else if (screenWidth < 992 && screenWidth >= 576) {
      return 30;
      // 小屏幕
    } else {
      return 22;
    }
  }

  /**
   * 计算页面可容纳多少方格
   */
  getMapSize() {
    let { screenWidth, screenHeight } = Map.getScreenSize();
    const blockSize = Map.getBlockSize();

    // 内间距
    screenWidth = screenWidth - blockSize * 2;
    screenHeight = screenHeight - blockSize;
    // 预留一些空间 (避免拥挤)
    const rows = Math.floor(screenHeight / blockSize) - 2;
    const columns = Math.floor(screenWidth / blockSize) - 1;

    return { rows, columns, blockSize };
  }

  /**
   * 计算边缘块位置信息
   */
  setEdgePosition() {
    const { rows, columns } = this.getMapSize();
    const rowsArray = Array.from(Array(rows + 1).keys());
    const columnsArray = Array.from(Array(columns + 1).keys());

    this.topEdge = columnsArray.map((x) => ({ x: x, y: -1 }));
    this.bottomEdge = columnsArray.map((x) => ({ x, y: rows + 1 }));
    this.leftEdge = rowsArray.map((y) => ({ x: -1, y: y }));
    this.rightEdge = rowsArray.map((y) => ({ x: columns + 1, y }));
  }

  /** 渲染地图 */
  render(ctx: CanvasRenderingContext2D) {
    const { rows, columns, blockSize } = this.getMapSize();
    const offset = blockSize;

    for (let row = 0; row <= rows; row++) {
      for (let column = 0; column <= columns; column++) {
        const x = column + blockSize * column + offset;
        const y = row + blockSize * row + offset;

        createBlock(ctx, {
          x,
          y,
          strokeStyle: this.strokeStyle,
          size: blockSize,
        });

        ctx.font = "16px Orbitron";
        ctx.fillStyle = "white";
      }
    }

    [
      ...this.topEdge,
      ...this.bottomEdge,
      ...this.leftEdge,
      ...this.rightEdge,
    ].forEach(({ x: column, y: row }) => {
      const x = column + blockSize * column + offset;
      const y = row + blockSize * row + offset;

      createBlock(ctx, {
        x,
        y,
        strokeStyle: "green",
        size: blockSize,
      });
    });
  }
}
