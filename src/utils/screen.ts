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

/**
 * 根据屏幕尺寸计算并获取方格大小
 * @returns 方格大小
 */
export function getBlockSize(): number {
  const { screenWidth } = getScreenSize();

  // 大屏幕
  if (screenWidth >= 992) {
    return 36;
    // 中屏幕
  } else if (screenWidth < 992 && screenWidth >= 576) {
    return 30;
    // 小屏幕
  } else {
    return 22;
  }
}
