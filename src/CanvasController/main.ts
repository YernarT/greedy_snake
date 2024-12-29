// Types
import type { I_Layer } from "./Layer/types";
// Classes
import Layer from "./Layer/index";

export default class CanvasController {
  #layerList: I_Layer[] = [];

  /**
   * 创建层级
   */
  createLayer(layerName: string, zIndex: number) {
    const layer = new Layer(layerName, zIndex);
    this.#layerList.push(layer);
    return layer;
  }

  /**
   * 删除层级
   */
  removeLayer(layer: I_Layer) {
    layer.destroy();
    this.#layerList = this.#layerList.filter((record) => record !== layer);
  }
}
