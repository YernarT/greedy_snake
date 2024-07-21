// Modules
import Render from "@/modules/render";
import EventModule from "@/modules/event";
import Game from "@/modules/game";
import Map from "@/modules/map";
import Snake from "@/modules/snake";

// Entry
document.addEventListener("DOMContentLoaded", () => {
  // 初始化游戏模块
  const game = new Game();
  // 初始化渲染模块
  const render = new Render();
  render.render();
  // 初始化地图
  const map = new Map();
  render.add(map.render, map);
  // 初始化事件模块
  const eventModule = new EventModule();
  // 动态调整 canvas 尺寸
  eventModule.onResize(render.setCanvasSize.bind(render));
  // 动态调整 地图信息
  eventModule.onResize(map.setEdgePosition.bind(map));

  // 初始化蛇
  const snake = new Snake(map.getMapSize());
  //
  render.add<Snake>(snake.handleMove.bind(snake, map), snake);
  render.add(snake.render, snake);
  // 移动蛇
  eventModule.onMove((direction) =>
    snake.setDirection.bind(snake, direction)()
  );
  // 动态调整 蛇 尺寸
  // @TODO: 调整 蛇和食物的 的位置
  eventModule.onResize(snake.setSnakeSize.bind(snake));
});
