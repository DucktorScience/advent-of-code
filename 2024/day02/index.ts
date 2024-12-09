import { INPUT } from "./input"

const lines = INPUT.split('\n');
const rows = lines.map(line => {
  return line.split(' ').map(Number);
});

const isSafe = (row: Array<number>) => {
  const isAllSafeAscending = row.every((value, index) => {
    if (index === 0) {
      return true;
    }

    const previous = row[index - 1];
    if (previous >= value) {
      return false;
    }

    const difference = Math.abs(value - previous);
    return difference <= 3;
  });

  if (isAllSafeAscending) {
    return true;
  }

  const isAllSafeDescending = row.every((value, index) => {
    if (index === 0) {
      return true;
    }

    const previous = row[index - 1];
    if (previous <= value) {
      return false;
    }

    const difference = Math.abs(value - previous);
    return difference <= 3;
  });

  return isAllSafeDescending
}

const safeRows = rows.filter(isSafe)
console.log(`Part1 = ${safeRows.length}`);

const isSafeRowWithTolerance = (row: Array<number>) => {
  const isGenerallySafe = isSafe(row);
  if (isGenerallySafe) {
    return true;
  }

  for (let i = 0; i < row.length; ++i) {
    const rowWithoutPositionI = row.toSpliced(i, 1);
    if (isSafe(rowWithoutPositionI)) {
      return true;
    }
  }

  return false
}

const tolerableRows = rows.filter(isSafeRowWithTolerance)
console.log(`Part2 = ${tolerableRows.length}`);