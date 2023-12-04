import { removeExtraSpacing } from "utilities/string";
import { INPUT } from "./input";

import _intersection from 'lodash/intersection';
import _sum from 'lodash/sum';

const ORIGINAL_LINES = INPUT.split('\n');

const getScoreForLine = (line: string) => {
  const [cardNo, numbers] = line.split(': ');
  const trimmedNumbers = removeExtraSpacing(numbers);
  const [winningSource, actualSource] = trimmedNumbers.split(' | ');

  const winningNumbersArray = (winningSource.split(' ').map(Number));
  const actualNumbersArray = (actualSource.split(' ').map(Number));

  const intersectionArray = _intersection(winningNumbersArray, actualNumbersArray);
  const totalMatchingNumbers = intersectionArray.length;

  if (totalMatchingNumbers === 0) {
    return 0;
  }
  if (totalMatchingNumbers === 1) {
    return 1;
  }

  return Math.pow(2, totalMatchingNumbers - 1);
}

const totalPoints = ORIGINAL_LINES.map(line => getScoreForLine(line));

console.log({
  part1: _sum(totalPoints),
});
