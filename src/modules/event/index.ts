// Types
import type { T_Direction } from "@/modules/dto";

/**
 * 该模块用于处理事件
 */

export default class EventModule {
  #events: Partial<
    Record<keyof WindowEventMap | "startGame", CallableFunction[]>
  > = {};

  /**
   * 浏览器窗口尺寸发生改变
   */
  onResize(callback: () => void) {
    if (this.#events.resize) {
      this.#events.resize.push(callback);
    } else {
      window.addEventListener("resize", () => {
        this.#events.startGame = [callback];
        this.#events.startGame.forEach((cb) => cb());
      });
    }
  }

  /**
   * 用户点击了开始按钮
   */
  onClickStart(callback: () => void) {
    if (this.#events.startGame) {
      this.#events.startGame.push(callback);
    } else {
      const startGameBtn = document.querySelector('[data-js="startGame"]');
      startGameBtn?.addEventListener("click", () => {
        this.#events.startGame = [callback];
        this.#events.startGame.forEach((cb) => cb());
      });
    }
  }

  /**
   * 用户按下了移动键
   * `↑`, `←`, `↓`, `→`
   * `W`, `A`, `S`, `D`
   */
  onMove(callback: (direction: T_Direction) => void) {
    if (this.#events.keydown) {
      this.#events.keydown.push(callback);
    } else {
      this.#events.keydown = [callback];
      window.addEventListener("keydown", (e) => {
        this.#events.keydown!.forEach((cb) => {
          if (e.code === "ArrowRight" || e.code === "KeyD") {
            cb("RIGHT");
          } else if (e.code === "ArrowDown" || e.code === "KeyS") {
            cb("BOTTOM");
          } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
            cb("LEFT");
          } else if (e.code === "ArrowUp" || e.code === "KeyW") {
            cb("TOP");
          }
        });
      });
    }
  }
}
