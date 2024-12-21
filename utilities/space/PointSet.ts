import { KeyedSet } from "utilities/collections/KeyedSet";
import { Point } from "./types";
import { getPointKey } from "./getPointKey";

export class PointSet extends KeyedSet<Point> {
  constructor() {
    super(getPointKey);
  }
}
