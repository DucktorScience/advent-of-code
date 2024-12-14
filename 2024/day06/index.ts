import assert from "assert";
import { CharacterGrid } from "utilities/grid";
import { INPUT } from "./input"
import { PointSet } from "utilities/space/PointSet";
import { Direction, nudgeDirection, Point, pointsEqual, turnTo } from "utilities/space";
import { KeyedSet } from "utilities/collections";

const lines = INPUT.split('\n');

const OUT_OF_BOUNDS = '@'
const OBSTACLE = '#';
const masterGrid = new CharacterGrid(lines, OUT_OF_BOUNDS);

const startPoint = masterGrid.find('^');
assert(startPoint);

type DirectionAndPosition = {
  direction: Direction;
  position: Point;
}

const getDirectionAndPositionKey = (value: DirectionAndPosition) => `(${value.direction})[${value.position.x}, ${value.position.y}]`;
class DirectionAndPositionSet extends KeyedSet<DirectionAndPosition> {
  constructor() {
    super(getDirectionAndPositionKey);
  }
}

const isLooping = (grid: CharacterGrid) => {
  let direction: Direction = 'N';
  let position: Point = startPoint;

  const visited = new DirectionAndPositionSet();
  visited.add({ direction, position })

  while (true) {
    const nextPosition = nudgeDirection(position, direction);
    const nextValue = grid.getValue(nextPosition.x, nextPosition.y);

    if (nextValue === OUT_OF_BOUNDS) {
      return false;
    }

    if (nextValue === OBSTACLE) {
      direction = turnTo(direction, 'R');
    }
    else {
      position = nextPosition;
    }


    if (visited.has({ direction, position })) {
      return true;
    }

    visited.add({ direction, position });
  }
}

const solve = () => {
  let direction: Direction = 'N';
  let position: Point = startPoint;
  const visited = new PointSet();
  visited.add(startPoint);

  const loopingObstacleLocations = new PointSet();

  while (true) {
    const nextPosition = nudgeDirection(position, direction);
    const nextValue = masterGrid.getValue(nextPosition.x, nextPosition.y);

    if (nextValue === OUT_OF_BOUNDS) {
      return {
        totalVisitedPoints: visited.size,
        totalObstacleCandidates: loopingObstacleLocations.size,
      }
    }

    if (nextValue === OBSTACLE) {
      direction = turnTo(direction, 'R');
    } else {

      if (!pointsEqual(nextPosition, startPoint)) {
        // What if that was an obstacle!
        const theoreticalGrid = masterGrid.clone();
        theoreticalGrid.setValue(nextPosition.x, nextPosition.y, OBSTACLE);

        if (!loopingObstacleLocations.has(nextPosition) && isLooping(theoreticalGrid)) {
          loopingObstacleLocations.add(nextPosition);
        }
      }

      position = nextPosition;
      visited.add(nextPosition);
    }
  }
}

const { totalVisitedPoints: part1, totalObstacleCandidates: part2 } = solve();

console.log({ part1, part2 });
