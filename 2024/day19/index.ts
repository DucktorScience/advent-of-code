import { INPUT } from "./input"

const [rawStock, _, ...patterns] = INPUT.split('\n');
const stock = rawStock.split(', ');

const patternCanBeMade = (pattern: string) => {
  for (const towel of stock) {
    if (pattern.startsWith(towel)) {
      const remainingPattern = pattern.substring(towel.length);

      if (remainingPattern.length === 0) {
        // That was the end of the input
        return true;
      }

      if (patternCanBeMade(remainingPattern)) {
        // The remaining pattern can be made all the way to the end!
        return true;
      }
    }
  }

  return false;
}

const validPatterns = patterns.filter(patternCanBeMade);

console.log({ part1: validPatterns.length })