import { Point } from "./types";

export const movePoint = (point: Readonly<Point>, offset: Readonly<Point>): Point => ({
  x: point.x + offset.x,
  y: point.y + offset.y,
});
