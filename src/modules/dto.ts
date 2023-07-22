import Block from "@/modules/block";

export type T_ScreenSize = {
  screenWidth: number;
  screenHeight: number;
};

export type T_DOM_Position = {
  transformX: number;
  transformY: number;
};

export type T_MAP_Position = {
  row: number;
  column: number;
};

export type T_Direction = "RIGHT" | "BOTTOM" | "LEFT" | "TOP";

export type T_GameStatus = "READY" | "PAUSE" | "RUNNING" | "WIN" | "FAIL";

export type T_SnakeNode = {
  block: Block;
  previousPosition: T_MAP_Position;
  currentPosition: T_MAP_Position;
};
