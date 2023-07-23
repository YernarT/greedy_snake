// Types
import type { T_Task } from "@/modules/dto";

/**
 * FIFO (先进先出) 的队列
 * 该模块用于控制任务执行
 * 
 * @TODO
 * 任务ID, 任务失败是否重试, 错误处理
 */
export default class TaskQueue {
  #queue = [] as T_Task[];

  add(task: T_Task) {
    this.#queue.push(task);
  }

  remove() {

  }
}
