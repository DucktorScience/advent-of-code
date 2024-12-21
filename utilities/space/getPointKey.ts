import { Point } from "./types";

export const getPointKey = (point: Readonly<Point>) => {
  return `[${point.x}, ${point.y}]`;
}
