// Types
import type { T_ScreenSize } from "@/utils/screen";

export type T_CanvasContext = CanvasRenderingContext2D &
  T_ScreenSize & {
    canvasWidth: number;
    canvasHeight: number;
  } & {
    pageIsHidden: boolean;
  };

export interface I_Task<T = any> {
  taskId: string;
  renderFunction: (this: T, ctx: T_CanvasContext) => Promise<void>;
  thisArg: T;
}
