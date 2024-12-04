import { ascendingComparator, sumArray } from "utilities/number";
import { INPUT } from "./input"

const lines = INPUT.split('\n');
const left: number[] = [];
const right: number[] = [];

lines.forEach(line => {
  const parts = line.split(' ');
  left.push(Number(parts[0]));
  right.push(Number(parts.at(-1)));
});

left.sort(ascendingComparator);
right.sort(ascendingComparator);

console.log({
  left,
  right
})

const distances = left.map((a, index) => {
  const b = right[index];

  return Math.abs(a - b);
});

console.log({ distances })

const summed = sumArray(distances);
console.log({ summed });