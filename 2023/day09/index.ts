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

  return output;
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

const summedExtrapolatedValues = _sum(PROCESSED_DATA_SETS.map(getLastExtrapolatedValue));
console.log(summedExtrapolatedValues)
