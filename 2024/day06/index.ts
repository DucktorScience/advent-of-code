import assert from "assert";
import { CharacterGrid } from "utilities/grid";
import { INPUT } from "./input"
import { PointSet } from "utilities/space/PointSet";
import { Direction, nudgeDirection, Point, turnTo } from "utilities/space";

const lines = INPUT.split('\n');

const OUT_OF_BOUNDS = '@'
const OBSTACLE = '#';
const grid = new CharacterGrid(lines, OUT_OF_BOUNDS);

const startPoint = grid.find('^');
assert(startPoint);

const getTotalVisitedPoints = () => {
  let direction: Direction = 'N';
  let position: Point = startPoint;
  const visited = new PointSet();
  visited.add(startPoint);

  while (true) {
    const nextPosition = nudgeDirection(position, direction);
    const nextValue = grid.getValue(nextPosition.x, nextPosition.y);

    if (nextValue === OUT_OF_BOUNDS) {
      return visited.size;
    }

    if (nextValue === OBSTACLE) {
      direction = turnTo(direction, 'R');
    } else {
      position = nextPosition;
      visited.add(nextPosition);
    }
  }
}

console.log({ part1: getTotalVisitedPoints() });
