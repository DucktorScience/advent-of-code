import { movePoint, Point, pointsEqual } from "utilities/space"
import { INPUT } from "./input"
import { sumArray } from "utilities/number";

type Game = {
  buttonA: Point;
  buttonB: Point;
  prize: Point;
  priceOfA: number;
  priceOfB: number;
}

const games: Game[] = [];

const lines = INPUT.split('\n')
  .filter(line => line.trim().length);
do {
  const [aX, aY] = lines.shift().slice('Button A: X+'.length).split(', Y+').map(Number);
  const [bX, bY] = lines.shift().slice('Button B: X+'.length).split(', Y+').map(Number);
  const [pX, pY] = lines.shift().slice('Prize: X='.length).split(', Y=').map(Number);

  games.push({
    buttonA: { x: aX, y: aY },
    buttonB: { x: bX, y: bY },
    prize: { x: pX, y: pY },
    priceOfA: 3,
    priceOfB: 1,
  })

} while (lines.length);

const hasBusted = (currentPosition: Point, game: Game) => {
  return currentPosition.x > game.prize.x || currentPosition.y > game.prize.y;
}

const resultsCache = new Map<string, number>();


const determineCost = (currentPosition: Point, game: Game) => {
  const key = `${currentPosition.x}, ${currentPosition.y}`;
  const cachedResult = resultsCache.get(key);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  const hasReachedPrize = pointsEqual(currentPosition, game.prize);

  if (hasReachedPrize) {
    // We have reached the destination
    resultsCache.set(key, 0);
    return 0;
  }

  if (hasBusted(currentPosition, game)) {
    resultsCache.set(key, Infinity);
    return Infinity;
  }

  const positionAfterPushingA = movePoint(currentPosition, game.buttonA);
  const positionAfterPushingB = movePoint(currentPosition, game.buttonB);

  const costOfA = determineCost(positionAfterPushingA, game);
  const costOfB = determineCost(positionAfterPushingB, game);

  if (costOfA < costOfB) {
    const priceIncrease = game.priceOfA + costOfA;
    resultsCache.set(key, priceIncrease);
    return priceIncrease;
  } else {
    const priceIncrease = game.priceOfB + costOfB;
    resultsCache.set(key, priceIncrease);
    return priceIncrease;
  }
}

const results = games.map(game => {
  const result = determineCost({ x: 0, y: 0 }, game);
  resultsCache.clear();
  return result;
}).filter(Number.isFinite);

const part1 = sumArray(results);

console.log({ part1 });
