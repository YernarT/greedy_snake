// Types
import type { T_ScreenSize } from "@/modules/dto";

// Modules
import { createBlock } from "@/modules/block";

/**
 * 该模块用于地图的逻辑
 */
export default class Map {
  strokeStyle = "#666";

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
  getBlockSize(): number {
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
    const blockSize = this.getBlockSize();

    // 内间距
    screenWidth = screenWidth - blockSize * 2;
    screenHeight = screenHeight - blockSize;
    // 预留一些空间 (避免拥挤)
    const rows = Math.floor(screenHeight / blockSize) - 1;
    const columns = Math.floor(screenWidth / blockSize) - 1;

    return { rows, columns, blockSize };
  }

  /** 渲染地图 */
  renderMap(ctx: CanvasRenderingContext2D) {
    const { rows, columns, blockSize } = this.getMapSize();
    const offset = blockSize;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        createBlock(ctx, {
          x: column + blockSize * column + offset,
          y: row + blockSize * row + offset,
          strokeStyle: this.strokeStyle,
          size: blockSize,
        });
      }
    }
  }
}
