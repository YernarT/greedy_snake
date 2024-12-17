// Types
import type { T_CanvasContext } from "@/modules/render/types";
import type { I_Task, I_MarkerTask } from "@/modules/types";
// Modules
import Map from "@/modules/map";

/**
 * 渲染器, 负责渲染任务
 */
export default class Renderer {
  /** @property 渲染器名称 (用于调试) */
  name = "Renderer";
  minRenderInterval = 40;
  defaultRenderInterval = 1500;
  /** @property 渲染间隔 (毫秒) */
  #renderInterval = this.defaultRenderInterval;
  /** @property 最后一次渲染的时间戳 */
  #lastRenderTime = 0;
  #isRunning = false;
  #taskList: (I_MarkerTask | I_Task)[] = [
    this.#markerFn(true),
    this.#markerFn(false),
  ];
  /** @property 页面隐藏时, 是否继续渲染 */
  renderWhenHidden = false;
  /** @property 自毁开关 */
  __ruin = false;
  #canvasContext!: T_CanvasContext;

  constructor(canvasContext: T_CanvasContext) {
    this.#canvasContext = canvasContext;
  }

  /**
   * 标记型任务
   */
  #markerFn(isRunning: boolean): I_MarkerTask {
    return {
      isMarkerTask: true,
      fn: () => {
        this.#isRunning = isRunning;
      },
    };
  }

  /**
   * 异步修改 渲染间隔
   * @param ms 毫秒
   */
  async setRenderInterval(ms: number) {
    if (this.#isRunning) {
      setTimeout(() => this.setRenderInterval(ms), 0);
      return;
    }

    if (typeof ms === "number" && ms >= this.minRenderInterval) {
      this.#renderInterval = ms;
      return;
    }

    this.#renderInterval = this.defaultRenderInterval;
  }

  /**
   * 创建独一无二的任务 ID
   */
  #createTaskId() {
    const now = Date.now();
    const randomString = Math.random().toString(36).slice(2, 4);
    return `TID${now}${randomString}`;
  }

  /**
   * 添加渲染任务，返回任务 ID
   * @param renderFunction 渲染函数
   *
   * TODO:
   * beforeRunTask?: () => void | Promise<void>;
   * afterRunTask?: () => void | Promise<void>;
   */
  addTask<T>(
    renderFunction: I_Task<T>["renderFunction"],
    thisArg?: I_Task<T>["thisArg"]
  ) {
    const taskId = this.#createTaskId();
    // 插入至 倒数第一 位置 
    // taskList: [markerFn, task1, task2, 插入这里, markerFn]
    this.#taskList.splice(this.#taskList.length - 1, 0, {
      taskId,
      renderFunction,
      thisArg: thisArg ?? this,
    });
    return taskId;
  }

  /**
   * 取消渲染任务
   * @param taskId 任务 ID
   */
  cancelTask(taskId: I_Task["taskId"]) {
    this.#taskList = this.#taskList.filter((task) => {
      return !task.isMarkerTask && task.taskId !== taskId;
    });
  }

  /**
   * @param taskIdOrTaskLike - 任务 ID 或 类 task 对象
   * 立即执行任务
   */
  runUrgentTask(taskIdOrTaskLike: I_Task["taskId"] | Omit<I_Task, "taskId">) {
    if (typeof taskIdOrTaskLike === "string") {
      const task = this.#taskList.find(
        (task) => !task.isMarkerTask && task.taskId === taskIdOrTaskLike
      );
      if (task && !task.isMarkerTask) {
        task.renderFunction.bind(task.thisArg, this.#canvasContext)();
      }
    } else {
      taskIdOrTaskLike.renderFunction.bind(
        taskIdOrTaskLike.thisArg,
        this.#canvasContext
      )();
    }
  }

  /**
   * 销毁此渲染器
   */
  destroy() {
    this.__ruin = true;
  }

  /**
   * 确保渲染任务按照指定的间隔执行
   * 避免频繁渲染导致性能问题
   */
  render() {
    // 只有 MarkerTask 就不执行了
    if (this.#taskList.length === 2) return;
    // 页面处于不可见状态 且 `renderWhenHidden` 为 false 就不执行了
    if (this.#canvasContext.pageIsHidden && !this.renderWhenHidden) return;

    // 当前时间戳
    const timestamp = Date.now();
    // 计算自上次渲染以来的时间差
    const timeSinceLastRender = timestamp - this.#lastRenderTime;

    if (timeSinceLastRender >= this.#renderInterval) {
      // 更新渲染时间
      this.#lastRenderTime = timestamp;

      // 执行所有渲染任务
      this.#taskList.forEach((task) => {
        if (!task.isMarkerTask) {
          task.renderFunction.bind(task.thisArg, this.#canvasContext)();
        } else {
          task.fn();
        }
      });
    }
  }
}
