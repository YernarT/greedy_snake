export type T_ScreenSize = {
  screenWidth: number;
  screenHeight: number;
};

/**
 * 获取屏幕尺寸
 */
export function getScreenSize(): T_ScreenSize {
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  const screenHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  return { screenWidth, screenHeight };
}
