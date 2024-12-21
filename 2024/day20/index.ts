import { CharacterGrid } from "utilities/grid";
import { INPUT } from "./input"
import { Direction, getPointKey, nudgeDirection, Point, pointsEqual } from "utilities/space";
import assert from "assert";
import { KeyedMap } from "utilities/collections/KeyedMap";

const lines = INPUT.split('\n');

const FLOOR = '.';
const directions = Object.freeze<Array<Direction>>(['E', 'N', 'W', 'S']);

let start: Point;
let end: Point;
const grid = new CharacterGrid(lines);

grid.map((cell, x, y) => {
  if (cell === 'S') {
    start = { x, y };
    return FLOOR;
  }

  if (cell === 'E') {
    end = { x, y };
    return FLOOR;
  }
  return cell;
});

assert(start);
assert(end);

const buildTrack = () => {
  /**
   * Maps a position on the track to the total number of
   * steps to reach the end.
   */
  const track = new KeyedMap<Readonly<Point>, number>(getPointKey);

  let position = start;

  const findNextPosition = () => {
    for (const direction of directions) {
      const candidateNextPosition = nudgeDirection(position, direction);
      const gridValue = grid.getValue(candidateNextPosition.x, candidateNextPosition.y);

      if (gridValue === FLOOR && !track.has(candidateNextPosition)) {
        return candidateNextPosition;
      }
    }

    throw new Error(`Could not find an open position to move into. Currently at ${getPointKey(position)}`);
  }

  while (!pointsEqual(position, end)) {
    const cost = track.size;
    track.set(position, cost);
    position = findNextPosition();
  }
  // Need to also set the cost for the start position
  track.set(position, track.size);

  return track;
}

const track = buildTrack();

const trackLength = track.size;

type Cheat = {
  startPosition: Point;
  endPosition: Point;
  timeSaved: number;
}

const identifyCheats = (allowedToMoveDistance = 2) => {
  const cheats: Array<Cheat> = [];
  const trackPositions = track.keys();

  for (const position of trackPositions) {
    const myMovesSoFar = track.get(position);

    if (myMovesSoFar === undefined) {
      throw new Error(`Did not expect to be on a non track position ${position.x}, ${position.y}`)
    }

    for (const direction of directions) {
      let cheatedPosition = position;
      let didPassWall = false;
      for (let attempt = 0; attempt < allowedToMoveDistance; ++attempt) {
        cheatedPosition = nudgeDirection(cheatedPosition, direction);
        if (grid.getValue(cheatedPosition.x, cheatedPosition.y) !== FLOOR) {
          didPassWall = true;
        }
      }

      const cheatedMovesSoFar = track.get(cheatedPosition);

      if (cheatedMovesSoFar !== undefined && didPassWall && cheatedMovesSoFar > myMovesSoFar) {
        const myTimeToCompleteCourse = trackLength - myMovesSoFar;
        const cheatTimeToCompleteCourse = trackLength - cheatedMovesSoFar;
        const timeSaved = myTimeToCompleteCourse - cheatTimeToCompleteCourse - allowedToMoveDistance;

        const thisCheat: Cheat = {
          startPosition: position,
          endPosition: cheatedPosition,
          timeSaved,
        }

        cheats.push(thisCheat);
      }
    }
  }

  return cheats;
}

const cheats = identifyCheats();
/*
const grouped = groupBy(cheats, (cheat) => cheat.timeSaved);
for (const [key, value] of Object.entries(grouped)) {
  console.log(
    (value.length === 1) ? `There is one cheat that saves ${key} picoseconds.` :
      `There are ${value.length} cheats that save ${key} picoseconds.`)
}

*/
const cheatsThatSaveAtLeast100 = cheats.filter(cheat => cheat.timeSaved >= 100);

console.log({
  part1: cheatsThatSaveAtLeast100.length
});
