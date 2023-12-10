import { INPUT } from "./input";

const RAW_LINES = INPUT.split('\n');
const GRID = RAW_LINES.map(line => line.split(''));

type Coord = `${number}, ${number}`;

const findStartCoord = (): Coord => {
  for (let y = 0; y < GRID.length; ++y) {
    const row = GRID[y];
    const startingColIndex = row.indexOf('S');

    if (startingColIndex !== -1) {
      return `${startingColIndex}, ${y}`;
    }
  }

  throw new Error('did not find a start position');
}

const startCoord = findStartCoord();
console.log({ startCoord });

const distancesFromStart: Map<Coord, number> = new Map();

distancesFromStart.set(startCoord, 0);

const getCell = (x: number, y: number) => GRID[y][x];

const canTravelWest = (x: number, y: number) => {
  switch (getCell(x, y)) {
    case 'S':
    case '-':
    case 'J':
    case '7':
      return true;
    default:
      return false;
  }
}

const canTravelEast = (x: number, y: number) => {
  switch (getCell(x, y)) {
    case 'S':
    case '-':
    case 'L':
    case 'F':
      return true;
    default:
      return false;
  }
}

const canTravelNorth = (x: number, y: number) => {
  switch (getCell(x, y)) {
    case 'S':
    case '|':
    case 'L':
    case 'J':
      return true;
    default:
      return false;
  }
}

const canTravelSouth = (x: number, y: number) => {
  switch (getCell(x, y)) {
    case 'S':
    case '|':
    case 'F':
    case '7':
      return true;
    default:
      return false;
  }
}

const claimAndReturnIfPossible = (coord: Coord, depth: number): Coord | null => {
  if (!distancesFromStart.has(coord)) {
    distancesFromStart.set(coord, depth);
    return coord;
  }
}

const claimAndReturnWestIfPossible = (center: Coord, depth: number): Coord | null => {
  const [x, y] = center.split(', ').map(Number);
  const westX = x - 1;

  if (canTravelWest(x, y) && canTravelEast(westX, y)) {
    return claimAndReturnIfPossible(`${westX}, ${y}`, depth);
  }

  return null;
}

const claimAndReturnEastIfPossible = (center: Coord, depth: number): Coord | null => {
  const [x, y] = center.split(', ').map(Number);
  const eastX = x + 1;

  if (canTravelEast(x, y) && canTravelWest(eastX, y)) {
    return claimAndReturnIfPossible(`${eastX}, ${y}`, depth);
  }

  return null;
}

const claimAndReturnNorthIfPossible = (center: Coord, depth: number): Coord | null => {
  const [x, y] = center.split(', ').map(Number);
  const northY = y - 1;

  if (canTravelNorth(x, y) && canTravelSouth(x, northY)) {
    return claimAndReturnIfPossible(`${x}, ${northY}`, depth);
  }

  return null;
}

const claimAndReturnSouthIfPossible = (center: Coord, depth: number): Coord | null => {
  const [x, y] = center.split(', ').map(Number);
  const southY = y + 1;

  if (canTravelSouth(x, y) && canTravelNorth(x, southY)) {
    return claimAndReturnIfPossible(`${x}, ${southY}`, depth);
  }

  return null;
}

const getAvailableMovesFromCoord = (center: Coord, depth: number): Array<Coord> => {
  return [
    claimAndReturnEastIfPossible(center, depth),
    claimAndReturnWestIfPossible(center, depth),
    claimAndReturnSouthIfPossible(center, depth),
    claimAndReturnNorthIfPossible(center, depth),
  ].filter(neighbourMaybe => !!neighbourMaybe);
}

let movesForThisCycle = getAvailableMovesFromCoord(startCoord, 1);
let cycle = 2;

while (movesForThisCycle.length > 0) {
  movesForThisCycle = movesForThisCycle.flatMap(coord => getAvailableMovesFromCoord(coord, cycle));
  ++cycle;
}

console.log(
  Array.from(distancesFromStart.values()).sort((a, b) => b - a)[0]
)