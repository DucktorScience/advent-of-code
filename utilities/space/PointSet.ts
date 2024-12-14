import { KeyedSet } from "utilities/collections/KeyedSet";
import { Point } from "./types";

export class PointSet extends KeyedSet<Point> {
  constructor() {
    super((point => `[${point.x}, ${point.y}]`));
  }
}
