import { isDigit } from "utilities/number";
import { INPUT } from "./input";
import _sum from 'lodash/sum';

const RAW_GRID = INPUT.split('\n').map(line => line.split(''));

const isSymbol = (char: string) => {
  if (char === '.' || isDigit(char)) {
    return false
  }

  return true;
}

const isTouchingAnySymbol = (rowIndex: number, columnIndex: number, searchWidth: number) => {
  const lineUnderTest = RAW_GRID[rowIndex];

  if (columnIndex > 0) {
    // Check the position to the left of the start of the row under test
    if (isSymbol(lineUnderTest[columnIndex - 1])) {
      return true;
    }
  }

  if (columnIndex + searchWidth < lineUnderTest.length - 1) {
    // Check the position to the right of the end of the area under test on the row under test
    if (isSymbol(lineUnderTest[columnIndex + searchWidth])) {
      return true;
    }
  }

  // Will need to search the lines above and below (including diagonals on the corners)
  const searchStartColIndex = Math.max(0, columnIndex - 1); // Prevent reading less than 0
  const searchEndColIndex = Math.min(lineUnderTest.length - 1, columnIndex + searchWidth + 1);

  const lineAboveIndex = rowIndex - 1;
  const lineBelowIndx = rowIndex + 1;

  for (let x = searchStartColIndex; x < searchEndColIndex; ++x) {
    if (rowIndex > 0) {
      if (isSymbol(RAW_GRID[lineAboveIndex][x])) {
        return true;
      }
    }

    if (rowIndex < RAW_GRID.length - 1) {
      if (isSymbol(RAW_GRID[lineBelowIndx][x])) {
        return true;
      }
    }
  }

  return false;
}

type NumberArea = {
  endColIndex: number;
  rowIndex: number;
  startColIndex: number;
  value: number;
}

const findPartNumberAreas = () => {
  const foundPartNumbers: Array<NumberArea> = [];

  RAW_GRID.forEach((line, rowIndex) => {
    let inProgressNumber: null | Array<string> = null;
    let inProgressStartColumn = 0;

    line.forEach((currentCharacter, columnIndex) => {
      const currentIsDigit = isDigit(currentCharacter);

      if (inProgressNumber === null) {
        if (currentIsDigit) {
          // This is the beginning of a new number on the line we are looking at
          inProgressNumber = [currentCharacter];
          inProgressStartColumn = columnIndex;
        }
      } else {
        // We are constructing a number and will either continue to do so or end the current number
        if (currentIsDigit) {
          inProgressNumber.push(currentCharacter);
        }

        const isEndOfLine = columnIndex === line.length - 1;
        if (!currentIsDigit || isEndOfLine) {
          const totalDigits = inProgressNumber.length;
          if (isTouchingAnySymbol(rowIndex, inProgressStartColumn, totalDigits)) {
            const asNumber = Number(inProgressNumber.join(''));
            foundPartNumbers.push({
              endColIndex: columnIndex - 1,
              rowIndex,
              startColIndex: inProgressStartColumn,
              value: asNumber,
            });
          }

          inProgressNumber = null;
        }
      }
    });
  });

  return foundPartNumbers;
};

const areas = findPartNumberAreas();
const part1numbers = areas.map(({ value }) => value);

const getArea = (x: number, y: number) => areas.find(area => (area.rowIndex === y) && x >= area.startColIndex && x <= area.endColIndex)

const inferGear = (x: number, y: number): null | Array<number> => {
  const areasMaybe = [
    getArea(x - 1, y - 1), getArea(x, y - 1), getArea(x + 1, y - 1),
    getArea(x - 1, y),     /****************/ getArea(x + 1, y),
    getArea(x - 1, y + 1), getArea(x, y + 1), getArea(x + 1, y + 1),
  ].filter(Boolean);

  const uniqueAreas = new Set(areasMaybe);
  if (uniqueAreas.size === 2) {
    return Array.from(uniqueAreas.values()).map(area => area.value);
  }

  return null;
}

const findGearRatios = () => {
  const gearRatios: number[] = [];

  RAW_GRID.forEach((line, rowIndex) => {
    line.forEach((char, colIndx) => {
      if (char === '*') {
        const gear = inferGear(colIndx, rowIndex);
        if (gear) {
          gearRatios.push(gear[0] * gear[1]);
        }
      }
    });
  });

  return gearRatios;
}

const gearRatios = findGearRatios();

console.log({
  part1: _sum(part1numbers), // 544433
  part2: _sum(gearRatios),   // 76314915
})
