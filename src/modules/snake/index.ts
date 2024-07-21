// Types
import type { T_Direction, T_Position, T_SnakeNode } from "@/modules/dto";

// Modules
import { createBlock } from "@/modules/block";
import Map from "@/modules/map";

// 初始的蛇
export const initialNodes = [
  {
    previousPosition: { x: 14, y: 7 },
    currentPosition: { x: 14, y: 7 },
  },
  {
    previousPosition: { x: 13, y: 7 },
    currentPosition: { x: 13, y: 7 },
  },
  {
    previousPosition: { x: 12, y: 7 },
    currentPosition: { x: 12, y: 7 },
  },
];

/**
 * 该模块用于蛇的逻辑
 */
export default class Snake {
  // 蛇的大小
  #size!: number;
  // 蛇的方向
  #direction: T_Direction;
  // 节点链表
  #nodeList: T_SnakeNode[];
  // 地图信息 (用于判断碰撞边界)
  mapSize;

  constructor(mapSize: ReturnType<Map["getMapSize"]>) {
    this.mapSize = mapSize;
    this.#direction = "NULL";
    this.#nodeList = initialNodes;

    this.setSnakeSize();
    this.decorateSnake();
  }

  // 获取蛇头
  get head() {
    return this.#nodeList[0];
  }

  // 获取蛇尾
  get tail() {
    // 此处使用 Array.at(index) 的类型推导会返回 `undefined | T_SnakeNode`
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/at
    return this.#nodeList[this.#nodeList.length - 1];
  }

  /** 设置地图边缘节点信息 */
  // @TODO: 这个逻辑应该由 Map 模块完成。

  /** 设置蛇的大小 */
  setSnakeSize(size?: number) {
    this.#size = size ?? Map.getBlockSize();
  }

  // 修饰蛇头
  decorateHead(node: T_SnakeNode) {
    // this.head.block.$el.innerHTML = "头";
  }

  // 修饰蛇身
  decorateBody(node: T_SnakeNode, index: number) {
    // node.block.$el.innerHTML = "身";
  }

  // 修饰蛇
  decorateSnake() {
    this.#nodeList.forEach((node, index) => {
      if (index !== 0) {
        this.decorateBody(node, index);
      } else {
        this.decorateHead(node);
      }
    });
  }

  /**
   * 方向检测
   * @returns true正确, false错误
   */
  detectDirection(direction: T_Direction) {
    // 忽略相同的方向
    if (this.#direction === direction) {
      return true;
    } else if (this.#direction === "NULL") {
      return true;
    }

    switch (direction) {
      case "RIGHT":
      case "LEFT":
        return this.#direction === "TOP" || this.#direction === "BOTTOM";
      case "TOP":
      case "BOTTOM":
        return this.#direction === "LEFT" || this.#direction === "RIGHT";
      case "NULL":
        return false;
    }
  }

  /**
   * 检测 蛇头 与 给定坐标 是否在同一位置 (碰撞检测)
   * @returns true相同, false不同
   */
  isEqualPosition(position: T_Position) {
    return (
      this.head.currentPosition.x === position.x &&
      this.head.currentPosition.y === position.y
    );
  }

  /**
   * 碰撞检测 (蛇身)
   * @returns true撞到, false未撞
   */
  detectCollision() {
    if (this.#direction === "NULL") return false;

    // 除了*头*以外的部位
    return this.#nodeList.slice(1).some((node) => {
      return this.isEqualPosition(node.currentPosition);
    });
  }

  /**
   * 碰撞检测 (地图边界)
   * @returns true撞到, false未撞
   */
  detectCollisionMapEdge(map: Map) {
    if (this.#direction === "NULL") return false;
    else if (this.#direction === "RIGHT") {
      return map.rightEdge.some((blockPosition) => {
        return this.isEqualPosition(blockPosition);
      });
    } else if (this.#direction === "BOTTOM") {
      return map.bottomEdge.some((blockPosition) => {
        return this.isEqualPosition(blockPosition);
      });
    } else if (this.#direction === "TOP") {
      return map.topEdge.some((blockPosition) => {
        return this.isEqualPosition(blockPosition);
      });
    } else if (this.#direction === "LEFT") {
      return map.leftEdge.some((blockPosition) => {
        return this.isEqualPosition(blockPosition);
      });
    }

    return false;
  }

  // 蛇转向
  setDirection(direction: T_Direction) {
    if (!this.detectDirection(direction)) {
      // pass
      return;
    } else {
      // 更新方向
      this.#direction = direction;
    }
  }

  // 移动蛇头
  #moveHead(direction: T_Direction) {
    this.head.previousPosition = { ...this.head.currentPosition };

    switch (direction) {
      case "RIGHT":
        this.head.currentPosition.x += 1;
        break;
      case "BOTTOM":
        this.head.currentPosition.y += 1;
        break;
      case "LEFT":
        this.head.currentPosition.x -= 1;
        break;
      case "TOP":
        this.head.currentPosition.y -= 1;
        break;
    }
  }

  // 移动蛇身
  #moveBody(previousNode: T_SnakeNode, currentNode: T_SnakeNode) {
    currentNode.previousPosition = currentNode.currentPosition;
    currentNode.currentPosition = previousNode.previousPosition;
  }

  // 移动蛇
  handleMove(map: Map) {
    if (this.#direction === "NULL") return;

    this.#nodeList.forEach((node, index) => {
      if (index !== 0) {
        const prevNode = this.#nodeList[index - 1];
        this.#moveBody(prevNode, node);
      } else {
        this.#moveHead(this.#direction);
      }
    });

    if (this.detectCollision()) {
      throw Error("撞到了身体");
    }
    if (this.detectCollisionMapEdge(map)) {
      throw Error("撞到了墙壁");
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.#nodeList.forEach((node) => {
      const {
        currentPosition: { x, y },
      } = node;
      createBlock(ctx, {
        x: x + this.#size * x,
        y: y + this.#size * y,
        strokeStyle: "red",
        size: this.#size,
      });
    });
  }
}
