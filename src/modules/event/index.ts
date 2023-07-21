// Types
import type { T_Direction } from "@/modules/dto";

/**
 * 该模块用于处理事件
 */

export default class EventModule {
  onResize(callback: () => void) {
    window.addEventListener("resize", callback);
  }

  onClickStart(callback: () => void) {
    const startGameBtn = document.querySelector('[data-js="startGame"]');
    startGameBtn?.addEventListener("click", () => callback());
  }

  onTabSpace(callback: () => void) {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        callback();
      }
    });
  }

  onMove(callback: (direction: T_Direction) => void) {
    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        callback("RIGHT");
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        callback("BOTTOM");
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        callback("LEFT");
      } else if (e.code === "ArrowUp" || e.code === "KeyW") {
        callback("TOP");
      }
    });
  }
}
