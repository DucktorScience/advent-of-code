import { arrowToDirection, Direction, HorizontalDirection, isHorizontalDirection, nudgeDirection, Point, pointsEqual, PointSet, VerticalDirection } from "utilities/space";
import { INPUT } from "./input"
import { CharacterGrid } from "utilities/grid";
import assert from "assert";
import { sumArray } from "utilities/number";

const lines = INPUT.split('\n');

const splitIndex = lines.findIndex(line => line.trim().length === 0);

const BOX = 'O';
const FLOOR = '.';
const WALL = '#';
const rawGridLines = lines.toSpliced(splitIndex);
const part1World = new CharacterGrid(rawGridLines, '£');

type Part2BoxPart = '[' | ']';

const findOpenSpotAfterBoxes = (grid: CharacterGrid, position: Point, direction: Direction): Point | null => {
  let location: Point = position;

  do {
    location = nudgeDirection(location, direction);
    const tile = grid.getValue(location.x, location.y);

    if (tile === WALL) {
      return null;
    }

    if (tile === FLOOR) {
      return location;
    }
  } while (true);
}

const instructions = lines.toSpliced(0, splitIndex + 1)
  .join('') // One uber line
  .split('') // All single characters
  .map(arrowToDirection);

const part1StartPosition = part1World.find('@');
assert(part1StartPosition);
part1World.setValue(part1StartPosition.x, part1StartPosition.y, FLOOR);

const performMoves = () => {
  let position = part1StartPosition;

  for (const instruction of instructions) {
    const nextPosition = nudgeDirection(position, instruction);
    const nextTile = part1World.getValue(nextPosition.x, nextPosition.y);

    if (nextTile === WALL) {
      // Nothing can happen
    } else if (nextTile === FLOOR) {
      position = nextPosition;
    } else {
      // Next position is a box
      const openSpot = findOpenSpotAfterBoxes(part1World, nextPosition, instruction);
      if (openSpot) {
        // "Pushing" a line of boxes looks the same as removing the one currently
        // blocking our path and adding it to the end of the line
        part1World.setValue(nextPosition.x, nextPosition.y, FLOOR);
        part1World.setValue(openSpot.x, openSpot.y, BOX);
        // And the robot moves
        position = nextPosition;
      }
    }
  }

  part1World.setValue(position.x, position.y, '@');
};

performMoves();

const values: Array<number> = [];
part1World.forEach((value, x, y) => {
  if (value === BOX) {
    values.push(x + (100 * y))
  }
})

console.log(`Part 1: ${sumArray(values)}`);

const part2lines = rawGridLines.map(line => {
  const chars = line.split('');

  return chars.map(char => {
    switch (char) {
      case '#':
        return '##';
      case '.':
        return '..';
      case BOX:
        return '[]';
      case '@':
        return '@.';
      default:
        throw new Error('Unknown input character')
    }
  }).join('')
})

const world = new CharacterGrid(part2lines, '+');
const part2StartPosition = world.find('@');
assert(part2StartPosition);
world.setValue(part2StartPosition.x, part2StartPosition.y, FLOOR);

const attemptHorizontalPush = (grid: CharacterGrid, position: Point, direction: HorizontalDirection): boolean => {
  const openSpot = findOpenSpotAfterBoxes(grid, position, direction);
  if (openSpot) {
    // The point we started on is no longer a box
    grid.setValue(position.x, position.y, FLOOR);

    let nextChar: Part2BoxPart = direction === 'W' ? ']' : '[';

    do {
      position = nudgeDirection(position, direction);
      grid.setValue(position.x, position.y, nextChar);
      nextChar = nextChar === '[' ? ']' : '[';
    } while (!pointsEqual(position, openSpot))

    return true;
  }

  return false;
}

function isPart2BoxPart(cell: string): cell is Part2BoxPart {
  return cell === '[' || cell === ']';
}

const identifyAllRelatedPoints = (cells: PointSet, grid: CharacterGrid, position: Point, direction: VerticalDirection) => {
  const currentPart = grid.getValue(position.x, position.y);

  if (!isPart2BoxPart(currentPart)) {
    throw new Error('Expected cell to be a part 2 box')
  }

  const myOtherPoint: Point = {
    x: currentPart === '[' ? position.x + 1 : position.x - 1,
    y: position.y,
  }

  cells.add(position);
  cells.add(myOtherPoint);

  const myNextPoint = nudgeDirection(position, direction);
  const otherNextPoint = nudgeDirection(myOtherPoint, direction);

  if (isPart2BoxPart(grid.getValue(myNextPoint.x, myNextPoint.y))) {
    identifyAllRelatedPoints(cells, grid, myNextPoint, direction);
  }

  if (isPart2BoxPart(grid.getValue(otherNextPoint.x, otherNextPoint.y))) {
    identifyAllRelatedPoints(cells, grid, otherNextPoint, direction);
  }
}

const doesMoveIntoWall = (grid: CharacterGrid, position: Point, direction: VerticalDirection): boolean => {
  const moved = nudgeDirection(position, direction);
  const value = grid.getValue(moved.x, moved.y);
  return value === WALL;
}

const attemptVerticalPush = (grid: CharacterGrid, position: Point, direction: VerticalDirection): boolean => {
  const originalBoxPositions = new PointSet();
  identifyAllRelatedPoints(originalBoxPositions, grid, position, direction);

  const originalPoints = [...originalBoxPositions.values()];
  if (originalPoints.some(point => doesMoveIntoWall(grid, point, direction))) {
    return false;
  }

  const originalGrid = grid.clone();
  // Set all affected boxes to empty spaces
  originalPoints.forEach(point => {
    grid.setValue(point.x, point.y, FLOOR);
  });

  // Write the nudged spaces
  originalPoints.forEach(point => {
    const originalValue = originalGrid.getValue(point.x, point.y);
    const movedPosition = nudgeDirection(point, direction);
    grid.setValue(movedPosition.x, movedPosition.y, originalValue);
  })

  return true;
}

const solvePart2 = () => {
  let position = part2StartPosition;

  for (const instruction of instructions) {
    const nextPosition = nudgeDirection(position, instruction);
    const nextCell = world.getValue(nextPosition.x, nextPosition.y);

    if (nextCell === FLOOR) {
      position = nextPosition;
    } else if (nextCell === WALL) {
      // Nothing happens
    } else {
      // Is part of some box

      if (isHorizontalDirection(instruction)) {
        if (attemptHorizontalPush(world, nextPosition, instruction)) {
          position = nextPosition;
        }
      } else
        if (attemptVerticalPush(world, nextPosition, instruction)) {
          position = nextPosition;
        }
    }
  }

  world.setValue(position.x, position.y, '@');
}

solvePart2();
console.log(world.toString());

let part2 = 0;
world.forEach((value, x, y) => {
  if (value === '[') {
    part2 += (x + (100 * y))
  }
})

console.log(`Part 2: ${part2}`);