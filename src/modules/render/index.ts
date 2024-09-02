// Types
import type { I_Task } from "@/modules/dto";
// Modules
import Map from "@/modules/map";

/**
 * 该模块用于渲染
 */
export default class RenderTask {
  // 渲染速率 (毫秒)
  #renderInterval = 500;
  #lastRenderTime = 0;
  #taskList = [] as I_Task[];
  canvas!: HTMLCanvasElement;
  canvasContext!: CanvasRenderingContext2D;

  constructor() {
    // 初始化 canvas
    this.#initCanvas();
    this.setCanvasSize();
  }

  /** 初始化 canvas */
  #initCanvas() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.canvas = canvas;
    this.canvasContext = context;
  }

  /** 设置 canvas 尺寸 */
  setCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    const { screenWidth, screenHeight } = Map.getScreenSize();
    this.canvas.width = Math.round(screenWidth * dpr);
    this.canvas.height = Math.round(screenHeight * dpr);
    this.canvas.style.width = `${screenWidth}px`;
    this.canvas.style.height = `${screenHeight}px`;
    this.canvasContext.scale(dpr, dpr);
  }

  #createTaskId() {
    const now = Date.now();
    const randomString = Math.random().toString(36).slice(2, 4);
    return `GS${now}${randomString}`;
  }

  /**
   * 添加渲染任务，返回任务 ID, 用于取消
   * @param task 任务回调
   */
  add<T>(
    renderFunction: I_Task<T>["renderFunction"],
    thisArg?: I_Task<T>["thisArg"]
  ) {
    const taskId = this.#createTaskId();
    this.#taskList.push({ taskId, renderFunction, thisArg });
    return taskId;
  }

  /**
   * 取消渲染任务
   * @param taskId 任务 ID
   */
  cancel(taskId: I_Task["taskId"]) {
    this.#taskList = this.#taskList.filter((task) => task.taskId !== taskId);
  }

  /**
   * 主渲染函数
   */
  render() {
    // 当前时间戳
    const timestamp = Date.now();
    // 计算自上次渲染以来的时间差
    const timeSinceLastRender = timestamp - this.#lastRenderTime;

    if (timeSinceLastRender >= this.#renderInterval) {
      // 更新渲染时间
      this.#lastRenderTime = timestamp;
      // 清空画布
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // 执行所有渲染任务
      this.#taskList.forEach((task) => {
        task.renderFunction.bind(task.thisArg, this.canvasContext)();
      });
    }

    requestAnimationFrame(this.render.bind(this));
  }
}
