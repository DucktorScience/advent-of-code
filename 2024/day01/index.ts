import { ascendingComparator, sumArray } from "utilities/number";
import { INPUT } from "./input"

const lines = INPUT.split('\n');
const left: number[] = [];
const right: number[] = [];

const timesAppearingInTheRightList = new Map<number, number>();

lines.forEach(line => {
  const parts = line.split(' ');
  left.push(Number(parts[0]));

  const rightNumber = Number(parts.at(-1));
  right.push(rightNumber);

  const currentLookup = timesAppearingInTheRightList.get(rightNumber) ?? 0;
  timesAppearingInTheRightList.set(rightNumber, 1 + currentLookup)
});

left.sort(ascendingComparator);
right.sort(ascendingComparator);

const distances = left.map((a, index) => {
  const b = right[index];

  return Math.abs(a - b);
});

const summed = sumArray(distances);
console.log({ part1: summed });

const similarities = left.map((a) => {
  return a * (timesAppearingInTheRightList.get(a) ?? 0);
});

console.log({ part2: sumArray(similarities) })