import _last from 'lodash/last'
import _sum from 'lodash/sum'
import { INPUT } from "./input";

const RAW_DATA_SETS = INPUT.split('\n').map(line => {
  return line.split(' ').map(Number);
});

const isAllZero = (line: Readonly<Array<number>>) => line.every(value => value === 0);

const processToZero = (originalLine: Readonly<Array<number>>) => {
  const output: Array<Array<number>> = [[...originalLine]];

  let prevLine = originalLine;
  while (!isAllZero(prevLine)) {
    const nextLine: Array<number> = [];

    for (let i = 0; i < prevLine.length - 1; ++i) {
      const left = prevLine[i];
      const right = prevLine[i + 1];
      nextLine.push(right - left);
    }

    output.push(nextLine);
    prevLine = nextLine;
  }

  const reversed = output.toReversed();
  const calculatedFirsts: Array<number> = [];
  reversed.forEach((line, index) => {
    if (index === 0) {
      calculatedFirsts.push(0);
    }

    const priorFirst = _last(calculatedFirsts);
    const myNewFirst = line[0] - priorFirst;

    calculatedFirsts.push(myNewFirst);
    return [myNewFirst, ...line];
  });
  calculatedFirsts.reverse();

  return output.map((line, index) => [calculatedFirsts[index], ...line]);
}

const PROCESSED_DATA_SETS = RAW_DATA_SETS.map(processToZero);

const getLastExtrapolatedValue = (processedDataSet: Readonly<Array<Array<number>>>) => {
  const toProcess = processedDataSet.toReversed();
  const originalLastLine = toProcess[0];
  toProcess.shift();

  const extrapolatedValues: Array<number> = [];

  let prevLine: Array<number> = [...originalLastLine, 0];
  while (toProcess.length > 0) {
    const thisLine = toProcess.shift();

    const thisLineExtrapolatedValue = _last(thisLine) + _last(prevLine);
    extrapolatedValues.push(thisLineExtrapolatedValue);

    prevLine = [...thisLine, thisLineExtrapolatedValue];
  }

  return _last(extrapolatedValues);
}

const part1 = _sum(PROCESSED_DATA_SETS.map(getLastExtrapolatedValue));
const part2 = _sum(PROCESSED_DATA_SETS.map(dataSet => dataSet[0][0]));

console.log({
  part1,
  part2,
});
