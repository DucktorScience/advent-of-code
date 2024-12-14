import { Point } from "./types";

export const pointsEqual = (a: Readonly<Point>, b: Readonly<Point>) => {
  return (a.x === b.x) && (a.y === b.y);
}
