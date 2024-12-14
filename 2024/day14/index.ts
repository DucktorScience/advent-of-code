import { Point, pointsEqual } from "utilities/space";
import { INPUT } from "./input"
import { assert } from "console";
import { CharacterGrid } from "utilities/grid";
import { times } from "lodash";

const lines = INPUT.split('\n');

const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;

type Robot = {
  position: Point;
  velocity: Point;
}

const originalRobots: ReadonlyArray<Robot> = lines.map(line => {
  const [positionSection, velocitySection] = line.split(' ');
  const [rawPositionX, rawPositionY] = positionSection.slice(2).split(',');
  const [rawVelocityX, rawVelocityY] = velocitySection.slice(2).split(',');

  return {
    position: {
      x: Number(rawPositionX),
      y: Number(rawPositionY),
    },
    velocity: {
      x: Number(rawVelocityX),
      y: Number(rawVelocityY)
    }
  }
})

const moveWithWorldWrap = (position: Readonly<Point>, velocity: Readonly<Point>, worldWidth: number, worldHeight: number): Point => {
  return {
    x: ((position.x + velocity.x) % worldWidth + worldWidth) % worldWidth,
    y: ((position.y + velocity.y) % worldHeight + worldHeight) % worldHeight
  };
}

assert(
  pointsEqual(
    moveWithWorldWrap({ x: 0, y: 0 }, { x: -1, y: -1 }, 5, 10),
    { x: 4, y: 9 }
  )
)

assert(
  pointsEqual(
    moveWithWorldWrap({ x: 8, y: 5 }, { x: 3, y: -7 }, 10, 6),
    { x: 1, y: 4 }
  )
)

const doTick = (currentRobots: ReadonlyArray<Robot>, worldWidth: number, worldHeight: number): ReadonlyArray<Robot> => {
  return currentRobots.map(({ position, velocity }) => {
    return {
      position: moveWithWorldWrap(position, velocity, worldWidth, worldHeight),
      velocity,
    };
  });
}


let positions: ReadonlyArray<Robot> = originalRobots;
for (let i = 0; i < 100; ++i) {
  positions = doTick(positions, GRID_WIDTH, GRID_HEIGHT);
}

let northWestCount = 0;
let northEastCount = 0;
let southEastCount = 0;
let southWestCount = 0;

const midpointX = Math.floor(GRID_WIDTH / 2);
const midpointY = Math.floor(GRID_HEIGHT / 2);

positions.forEach(({ position }) => {
  if (position.x === midpointX || position.y === midpointY) {
    return;
  }

  if (position.x < midpointX) {
    // Is west
    if (position.y < midpointY) {
      ++northWestCount;
    } else {
      ++southWestCount;
    }
  } else {
    // Is east
    if (position.y < midpointY) {
      ++northEastCount;
    } else {
      ++southEastCount;
    }
  }
})

console.log(`Part 1: ${northEastCount * northWestCount * southEastCount * southWestCount}`);

const isChristmasTree = (points: ReadonlyArray<Point>) => {
  for (const point of points) {
    const hasPointBelow = points.some(p => p.x === point.x && p.y === point.y + 1);
    if (hasPointBelow) {
      if (times(7).every(n => {
        return points.some(p => p.x === point.x && p.y === point.y + n + 2);
      })) {
        return true;
      }
    }
  }

  return false;
}

let christmasTicks = 0;
positions = originalRobots;

const printWorld = (robots: ReadonlyArray<Robot>) => {
  const grid = new CharacterGrid(GRID_WIDTH, GRID_HEIGHT, ' ');

  robots.forEach(robot => {
    grid.setValue(robot.position.x, robot.position.y, '*');
  })

  console.log(grid.toString());
}

do {
  ++christmasTicks;
  positions = doTick(positions, GRID_WIDTH, GRID_HEIGHT);
} while (!isChristmasTree(positions.map(p => p.position)))

printWorld(positions)

console.log(`Part 2: ${christmasTicks}`)