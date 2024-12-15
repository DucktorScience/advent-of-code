import { arrowToDirection, Direction, nudgeDirection, Point, pointsEqual } from "utilities/space";
import { INPUT } from "./input"
import { CharacterGrid } from "utilities/grid";
import assert from "assert";
import { sumArray } from "utilities/number";

const lines = INPUT.split('\n');

const splitIndex = lines.findIndex(line => line.trim().length === 0);

const BOX = 'O';
const FLOOR = '.';
const WALL = '#';
const world = new CharacterGrid(lines.toSpliced(splitIndex), '£');

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

const startPosition = world.find('@');
assert(startPosition);
world.setValue(startPosition.x, startPosition.y, FLOOR);

const performMoves = () => {
  let position = startPosition;

  for (const instruction of instructions) {
    const nextPosition = nudgeDirection(position, instruction);
    const nextTile = world.getValue(nextPosition.x, nextPosition.y);

    if (nextTile === WALL) {
      // Nothing can happen
    } else if (nextTile === FLOOR) {
      position = nextPosition;
    } else {
      // Next position is a box
      const openSpot = findOpenSpotAfterBoxes(world, nextPosition, instruction);
      if (openSpot) {
        // "Pushing" a line of boxes looks the same as removing the one currently
        // blocking our path and adding it to the end of the line
        world.setValue(nextPosition.x, nextPosition.y, FLOOR);
        world.setValue(openSpot.x, openSpot.y, BOX);
        // And the robot moves
        position = nextPosition;
      }
    }
  }

  world.setValue(position.x, position.y, '@');
};

performMoves();

const values: Array<number> = [];
world.forEach((value, x, y) => {
  if (value === BOX) {
    values.push(x + (100 * y))
  }
})

console.log(`Part 1: ${sumArray(values)}`)