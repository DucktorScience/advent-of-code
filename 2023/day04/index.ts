import { removeExtraSpacing } from "utilities/string";
import { INPUT } from "./input";

import _intersection from 'lodash/intersection';
import _sum from 'lodash/sum';
import _times from 'lodash/times';

const ORIGINAL_LINES = INPUT.split('\n');

const getTotalMatchingNumbersForLine = (line: string) => {
  const [_cardId, numbers] = line.split(': ');
  const trimmedNumbers = removeExtraSpacing(numbers);
  const [winningSource, actualSource] = trimmedNumbers.split(' | ');

  const winningNumbersArray = (winningSource.split(' ').map(Number));
  const actualNumbersArray = (actualSource.split(' ').map(Number));

  const intersectionArray = _intersection(winningNumbersArray, actualNumbersArray);
  return intersectionArray.length;
}

// index represents the scratchcard id (minus one) and value represents how many numbers are winning
const TotalWinningNumbers = ORIGINAL_LINES.map(getTotalMatchingNumbersForLine);

const getScoreFromTotalWinningNumbers = (totalMatchingNumbers: number) => {
  if (totalMatchingNumbers === 0) {
    return 0;
  }
  if (totalMatchingNumbers === 1) {
    return 1;
  }

  return Math.pow(2, totalMatchingNumbers - 1);
}

const totalPoints = TotalWinningNumbers.map(getScoreFromTotalWinningNumbers);

// Part 2

// Start with a copy of each unique scratchcard id
const scratchCardIdsCache = _times(ORIGINAL_LINES.length);
for (const scratchCardId of scratchCardIdsCache) {
  const totalWinningNumbersForThisScratchCard = TotalWinningNumbers[scratchCardId];
  if (totalWinningNumbersForThisScratchCard) {
    for (let i = 0; i < totalWinningNumbersForThisScratchCard; ++i) {
      const bonusCardIndex = scratchCardId + 1 + i;
      scratchCardIdsCache.push(bonusCardIndex);
    }
  }
}

console.log({
  part1: _sum(totalPoints), // 26346
  part2: scratchCardIdsCache.length,  // 8467762
});
