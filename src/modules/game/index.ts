// Types
import type { T_GameStatus } from "@/modules/dto";

/**
 * 该模块用于控制游戏
 */
export default class Game {
  #status: T_GameStatus = "READY";

  getStatus() {
    return this.#status;
  }

  setStatus(status: T_GameStatus) {
    this.#status = status;
  }
}
