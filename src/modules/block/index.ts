// Types
import type { T_ScreenSize, T_MAP_Position } from "@/modules/dto";

/**
 * 该模块用于基础方块
 */
export default class Block {
  row: number;
  column: number;
  size: number;
  // 是否是边缘的块
  isEdge = false;
  $el: HTMLDivElement;
  #isRenderd = false;

  constructor({ row, column }: T_MAP_Position) {
    this.row = row;
    this.column = column;
    this.size = this.getBlockSize();
    this.$el = this.createDOM();
  }

  /**
   * 获取屏幕尺寸
   */
  getScreenSize(): T_ScreenSize {
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
   * 计算方格大小
   */
  getBlockSize(): number {
    const { screenWidth } = this.getScreenSize();

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

  /**
   * 修改方块大小
   */
  setBlockSize(size?: number) {
    this.size = size ?? this.getBlockSize();
    this.$el.style.setProperty("--size", `${this.size}px`);
    this.setPosition();
  }

  /**
   * 计算页面可容纳多少方格
   */
  getMapSize() {
    let { screenWidth, screenHeight } = this.getScreenSize();

    // 考虑 边框宽度
    const blockSize = this.size + 2;
    // 考虑 偏移量
    screenWidth = screenWidth - blockSize;
    screenHeight = screenHeight - blockSize;

    const rows = Math.floor(screenHeight / blockSize);
    const columns = Math.floor(screenWidth / blockSize);

    return { rows, columns };
  }

  /**
   * 计算方格位置, 设置 Transform [X, Y] 值
   */
  setPosition() {
    let { screenWidth, screenHeight } = this.getScreenSize();
    let { rows, columns } = this.getMapSize();

    // 考虑 偏移量
    screenWidth = screenWidth - this.size;
    screenHeight = screenHeight - this.size;

    // 分辨 横/竖 屏
    const whatKindOfScreen =
      screenWidth > screenHeight ? "Horizontal" : "Vertical";

    const offsetX = (screenWidth - columns * this.size) / 2;
    const offsetY = (screenHeight - rows * this.size) / 2;

    const transformX = this.column * this.size + offsetX;
    const transformY = this.row * this.size + offsetY;

    this.$el.style.setProperty("--transformX", `${transformX}px`);
    this.$el.style.setProperty("--transformY", `${transformY}px`);
  }

  /**
   * 创建 DOM节点
   */
  createDOM() {
    const $block = document.createElement("div");

    $block.classList.add("block");
    $block.style.setProperty("--size", `${this.size}px`);
    $block.style.setProperty("--index", `${this.row}-${this.column}`);

    return $block;
  }

  render() {
    if (this.#isRenderd) {
      return;
    }

    document.body.appendChild(this.$el);
    this.#isRenderd = true;
  }

  destroy() {
    this.$el.remove();
  }
}
