import { removeExtraSpacing } from "utilities/string";

const INPUT = `Time:      7  15   30
Distance:  9  40  200`;

const LINES = removeExtraSpacing(INPUT).split('\n');
const TIMES = LINES[0].split(' ').map(Number).slice(1);
const DISTANCES = LINES[1].split(' ').map(Number).slice(1);

type Race = {
  distance: number;
  time: number;
}

const races: Array<Race> = TIMES.map((time, index) => ({
  distance: DISTANCES[index],
  time,
}));

console.log({
  races
});
