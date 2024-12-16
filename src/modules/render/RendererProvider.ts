// Types
import type { T_CanvasContext } from "@/modules/render/types";

// Module
import Renderer from "./Renderer";
// Utils
import { getScreenSize } from "@/utils/screen";

/**
 * 渲染器提供者, 储存/管理 渲染器集合
 */
class RendererProvider {
  #canvas!: HTMLCanvasElement;
  #canvasContext!: T_CanvasContext;
  defaultFont = "16px Orbitron";
  defaultFontColor = "#fff";
  #rendererList = [] as Renderer[];
  #isRunning = false;

  constructor() {
    this.#initCanvas();
    this.setCanvasSize();
    this.handleVisibilityChange();
  }

  #initCanvas() {
    this.#canvas = document.querySelector("canvas") as HTMLCanvasElement;
    this.#canvasContext = this.#canvas.getContext("2d") as T_CanvasContext;
    this.#canvasContext.font = this.defaultFont;
    this.#canvasContext.fillStyle = this.defaultFontColor;
  }

  /**
   * 根据浏览器窗口大小调整 canvas 尺寸
   * 更新 canvasContext 宽高相关属性
   */
  setCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    const { screenWidth, screenHeight } = getScreenSize();
    const canvasWidth = Math.round(screenWidth * dpr);
    const canvasHeight = Math.round(screenHeight * dpr);
    this.#canvas.width = canvasWidth;
    this.#canvas.height = canvasHeight;
    this.#canvas.style.width = `${screenWidth}px`;
    this.#canvas.style.height = `${screenHeight}px`;
    this.#canvasContext.screenWidth = screenWidth;
    this.#canvasContext.screenHeight = screenHeight;
    this.#canvasContext.canvasWidth = canvasWidth;
    this.#canvasContext.canvasHeight = canvasHeight;
    this.#canvasContext.scale(dpr, dpr);
  }

  start() {
    this.#isRunning = true;
    this.#render();
  }
  stop() {
    this.#isRunning = false;
  }

  /** 页面可见性 */
  handleVisibilityChange() {
    this.setVisibility();
    // BUG: 实际不会触发 `visibilitychange` 事件
    // https://stackoverflow.com/questions/28993157/visibilitychange-event-is-not-triggered-when-switching-program-window-with-altt
    document.addEventListener(
      "visibilitychange",
      this.setVisibility.bind(this)
    );
  }

  /** 更新页面可见性 */
  setVisibility() {
    const pageIsHidden =
      document.visibilityState === "hidden" || document.hidden;
    this.#canvasContext.pageIsHidden = pageIsHidden;
  }

  createRenderer() {
    const renderer = new Renderer(this.#canvasContext);
    renderer.name = `R${this.#rendererList.length}`;
    const self = this;

    // 配置自毁程序
    Object.defineProperties(renderer, {
      __ruin: {
        enumerable: false,
        set(v) {
          if (Boolean(v)) {
            self.#rendererList = self.#rendererList.filter(
              (renderer) => renderer !== this
            );
          }
        },
      },
    });

    this.#rendererList.push(renderer);

    return renderer;
  }

  /**
   * 清空画布
   */
  #clearStage() {
    this.#canvasContext.clearRect(
      0,
      0,
      this.#canvasContext.canvasWidth,
      this.#canvasContext.canvasHeight
    );
  }

  #render() {
    if (!this.#isRunning) return;
    this.#clearStage();
    this.#rendererList.forEach((renderer) => renderer.render());
    requestAnimationFrame(this.#render.bind(this));
  }
}

// create only a single instance
const rendererProvider = new RendererProvider();
export default rendererProvider;
