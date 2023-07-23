// Types
import type { T_Direction, T_SnakeNode } from "@/modules/dto";

// Modules
import Block from "@/modules/block";

// 初始的蛇
export const defaultNodeList = [
  {
    block: new Block({ row: 7, column: 14 }),
    previousPosition: { row: 7, column: 14 },
    currentPosition: { row: 7, column: 14 },
  },
  {
    block: new Block({ row: 7, column: 13 }),
    previousPosition: { row: 7, column: 13 },
    currentPosition: { row: 7, column: 13 },
  },
  {
    block: new Block({ row: 7, column: 12 }),
    previousPosition: { row: 7, column: 12 },
    currentPosition: { row: 7, column: 12 },
  },
];

/**
 * 该模块用于蛇的逻辑
 */
export default class Snake {
  // 蛇的方向
  direction: T_Direction;
  // 节点链表(伪)
  nodeList: T_SnakeNode[];
  // 蛇的状态
  #isRunning = false;
  // 各种定时器
  #timerOfMoving: number | null;

  constructor() {
    this.direction = "RIGHT";
    this.nodeList = defaultNodeList;
    // 初始化定时器
    this.#timerOfMoving = null;

    this.decorateSnake();
    this.render();
  }

  // 获取蛇头
  get head() {
    return this.nodeList[0];
  }

  // 获取蛇尾
  get tail() {
    // 此处使用 Array.at(index) 的类型推导会返回 `undefined | T_SnakeNode`
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/at
    return this.nodeList[this.nodeList.length - 1];
  }

  // 修饰蛇头
  decorateHead() {
    this.head.block.$el.innerHTML = "头";
  }

  // 修饰蛇身
  decorateBody(node: T_SnakeNode) {
    node.block.$el.innerHTML = "身";
  }

  // 修饰蛇
  decorateSnake() {
    this.nodeList.forEach((node, index) => {
      if (index !== 0) {
        this.decorateBody(node);
      } else {
        this.decorateHead();
      }
    });
  }

  /**
   * 方向检测
   * @returns true正确, false错误
   */
  detectDirection(direction: T_Direction) {
    // 忽略相同的方向 (否则会产生重复定时器)
    if (this.direction === direction) {
      return !this.#isRunning && this.#timerOfMoving === null;
    }

    switch (direction) {
      case "RIGHT":
      case "LEFT":
        return this.direction === "TOP" || this.direction === "BOTTOM";
      case "TOP":
      case "BOTTOM":
        return this.direction === "LEFT" || this.direction === "RIGHT";
    }
  }

  /**
   * 碰撞检测
   * @returns true撞到, false未撞
   */
  detectCollision() {
    return this.nodeList.some((node) => {
      this.head.currentPosition === node.currentPosition;
    });
  }

  // 移动蛇头
  #moveHead(direction: T_Direction) {
    this.head.previousPosition = { ...this.head.currentPosition };

    switch (direction) {
      case "RIGHT":
        this.head.currentPosition.column += 1;
        break;
      case "BOTTOM":
        this.head.currentPosition.row += 1;
        break;
      case "LEFT":
        this.head.currentPosition.column -= 1;
        break;
      case "TOP":
        this.head.currentPosition.row -= 1;
        break;
    }
  }

  // 移动蛇身
  #moveBody(previousNode: T_SnakeNode, currentNode: T_SnakeNode) {
    currentNode.previousPosition = currentNode.currentPosition;
    currentNode.currentPosition = previousNode.previousPosition;
  }

  // 移动蛇
  handleMove(direction: T_Direction) {
    if (!this.detectDirection(direction)) {
      // throw new Error("不正确的方向");
      return;
    } else {
      // 更新方向
      this.direction = direction;
      this.#timerOfMoving && clearInterval(this.#timerOfMoving);
      this.#timerOfMoving = null;
    }

    // this.#timerOfMoving = setInterval(() => {
    this.nodeList.forEach((node, index) => {
      if (index !== 0) {
        // 上一个节点
        const prevNode = this.nodeList[index - 1];
        this.#moveBody(prevNode, node);
      } else {
        this.#moveHead(direction);
      }
    });

    if (this.detectCollision()) {
      throw new Error("撞到了身体!");
    }

    // @TODO 需要安排一个任务队列
    this.reRender();
    // }, 500);
  }

  render() {
    this.nodeList.forEach((node) => {
      node.block.render();
      node.block.setPosition();
    });
  }

  reRender() {
    this.nodeList.forEach((node) => {
      node.block.row = node.currentPosition.row;
      node.block.column = node.currentPosition.column;
      node.block.setPosition();
    });
  }
}
