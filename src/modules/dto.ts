export type T_ScreenSize = {
  screenWidth: number;
  screenHeight: number;
};

export type T_Position = {
  x: number;
  y: number;
};

export type T_Direction = "NULL" | "RIGHT" | "BOTTOM" | "LEFT" | "TOP";

export type T_GameStatus = "READY" | "PAUSE" | "RUNNING" | "WIN" | "FAIL";

export type T_SnakeNode = {
  previousPosition: T_Position;
  currentPosition: T_Position;
};

export interface I_Task<T = any> {
  taskId: string;
  renderFunction: (this: T, ctx: CanvasRenderingContext2D) => void;
  thisArg: T;
}
