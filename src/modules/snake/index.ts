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
    previousPosition: { row: 7, column: 14 },
    currentPosition: { row: 7, column: 14 },
  },
  {
    block: new Block({ row: 7, column: 12 }),
    previousPosition: { row: 7, column: 14 },
    currentPosition: { row: 7, column: 14 },
  },
];

/**
 * 该模块用于蛇的逻辑
 */
export default class Snake {
  direction: T_Direction;
  nodeList: T_SnakeNode[];
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

  // 修饰蛇头
  decorateHead() {
    this.head.block.$el.innerHTML = "头";
  }

  // 修饰蛇身
  decorateNode(node: T_SnakeNode) {
    node.block.$el.innerHTML = "身";
  }

  // 修饰蛇
  decorateSnake() {
    this.nodeList.forEach((node, index) => {
      if (index !== 0) {
        this.decorateNode(node);
      } else {
        this.decorateHead();
      }
    });
  }

  // 移动蛇
  handleMove(direction: T_Direction) {
    this.nodeList.forEach((node) => {
      console.log(node);
    });
  }

  render() {
    this.nodeList.forEach((node) => {
      node.block.render();
      node.block.setPosition();
    });
  }
}
