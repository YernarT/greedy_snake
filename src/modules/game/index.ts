// Types
import type { T_GameStatus, T_Direction } from "@/modules/dto";
// Modules
import Block from "@/modules/block";
import Snake from "@/modules/snake";
import EventModule from "@/modules/event";

/**
 * 该模块用于控制游戏
 */
export default class Game {
  #status: T_GameStatus = "READY";

  #map: Block[][] = [];
  #mapSize = {
    rows: 0,
    columns: 0,
  };

  #snake: Snake;

  constructor() {
    // 地图
    this.#mapSize = this.#getMapSize();
    this.#renderMap();

    // 蛇 (默认一开始就 render 了)
    this.#snake = new Snake();

    // 事件
    const eventModule = new EventModule();
    // 响应式地图
    this.#handleResizeForBlock();
    eventModule.onResize(() => this.#handleResizeForBlock());
    // 移动蛇
    eventModule.onMove((direction: T_Direction) => {
      this.#snake.handleMove(direction);
    });
  }

  getStatus() {
    return this.#status;
  }

  setStatus(status: T_GameStatus) {
    this.#status = status;
  }

  #handleResizeForBlock() {
    const { rows, columns } = this.#mapSize;
    const { rows: newRows, columns: newColumns } = this.#getMapSize();
    // 更新数据
    this.#mapSize = { rows: newRows, columns: newColumns };

    // row 的数量不足, 需要新增一些 row
    if (newRows > rows) {
      for (let row = rows; row < newRows; row++) {
        let rowArray = [];
        for (let column = 0; column < newColumns; column++) {
          // newBlock 是 新增的 row block
          const newBlock = new Block({ row, column });
          rowArray.push(newBlock);
          newBlock.render();
          newBlock.setBlockSize();
        }
        // 更新 row 数据
        this.#map.push(rowArray);
      }
    } else {
      // row 的数量过多, 需要删除一些 row
      this.#map = this.#map.filter((rowArray, row) => {
        rowArray.forEach((block) => {
          row >= newRows && block.destroy();
        });
        return row < newRows;
      });
    }

    this.#map.forEach((rowArray, row) => {
      // row 里的 column 数量不足, 每层 row 需要新增一些 column
      if (newColumns > columns) {
        for (let column = columns; column < newColumns; column++) {
          // newBlock 是 新增的 col block
          const newBlock = new Block({ row, column });
          this.#map[row][column] = newBlock;
          newBlock.render();
          newBlock.setBlockSize();
        }
      }

      rowArray.forEach((block, column) => {
        // Case: 新Map(大) > 原始Map(小)
        if (newColumns > column) {
          // @TODO: [性能优化]
          // 由于 `setBlockSize` 有点昂贵, 需要跳过新增的block
          // 新增的block已经执行过 `setBlockSize` 了。
          block.setBlockSize();
        } else {
          // Case: 原始Map(大) > 新Map(小)
          block.destroy();
          delete this.#map[row][column];
        }
      });
    });
  }

  #getMapSize() {
    let tempBlock = new Block({ row: 0, column: 0 });
    const { rows, columns } = tempBlock.getMapSize();
    // @ts-ignore 释放内存
    tempBlock = undefined;

    return { rows, columns };
  }

  #renderMap() {
    const { rows, columns } = this.#mapSize;

    for (let row = 0; row < rows; row++) {
      let rowArray = [];

      for (let column = 0; column < columns; column++) {
        const block = new Block({ row, column });
        block.isEdge =
          row === 0 ||
          column === 0 ||
          row === rows - 1 ||
          column === columns - 1;

        block.render();
        block.setPosition();
        rowArray.push(block);
      }

      this.#map.push(rowArray);
    }
  }
}
