import { sumArray } from "utilities/number";
import { INPUT } from "./input"

const [rawStock, _, ...patterns] = INPUT.split('\n');
const stock = rawStock.split(', ');

let cache: Record<string, number | null> = {};

const patternCanBeMade = ((pattern: string) => {
  const plausibleStock = stock.filter(s => pattern.includes(s));

  if (cache[pattern] !== undefined) {
    return cache[pattern];
  }

  let workingParts: number = 0;

  for (const towel of plausibleStock) {
    if (pattern.startsWith(towel)) {
      const remainingPattern = pattern.substring(towel.length);

      if (remainingPattern.length === 0) {
        workingParts++;
      }

      const restOfTheParts = patternCanBeMade(remainingPattern);
      if (restOfTheParts) {
        workingParts += restOfTheParts;
      }
    }
  }

  cache[pattern] = workingParts;
  return workingParts;
})

const validPatterns = patterns.map((pattern) => {
  cache = {};
  return patternCanBeMade(pattern);
}).filter(Boolean);

console.log({ part1: validPatterns.length, part2: sumArray(validPatterns) });
