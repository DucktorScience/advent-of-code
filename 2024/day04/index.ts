import { assert } from "console";
import { INPUT } from "./input"
import { reverseString, rotateLines } from "utilities/string";

const lines = INPUT.split('\n');

class CharacterGrid {
  private cells: string[][];

  constructor(input: Readonly<Array<string>>, private readonly fallbackCharacter = '.') {
    this.cells = input.map(line => line.split(''));
  }

  getValue(x: number, y: number) {
    return this.cells[y]?.[x] ?? this.fallbackCharacter;
  }

  getLines() {
    return this.cells.map(line => line.join('')).join('\n');
  }

  map(callbackfn: (value: string) => string) {
    this.cells = this.cells.map(line => line.map(callbackfn))
  }

  filter(callbackfn: (value: string) => boolean) {
    this.map((value) => {
      if (callbackfn(value)) {
        return value;
      }

      return this.fallbackCharacter;
    })
  };

  forEach(callbackfn: (value: string, x: number, y: number) => void) {
    this.cells.forEach((line, y) => {
      line.forEach((character, x) => {
        callbackfn(character, x, y);
      })
    })
  }
}

const grid = new CharacterGrid(lines);

let totalXmas = 0;

const isMAS = (x: number, y: number, xDirection: number, yDirection: number) => {
  if (grid.getValue(x + xDirection, y + yDirection) !== 'M') {
    return false;
  }
  if (grid.getValue(x + (xDirection * 2), y + (yDirection * 2)) !== 'A') {
    return false;
  }

  if (grid.getValue(x + (xDirection * 3), y + (yDirection * 3)) !== 'S') {
    return false;
  }
  return true;
}

grid.forEach((value, x, y) => {
  if (value === 'X') {
    // Lef to right
    totalXmas += isMAS(x, y, 1, 0) ? 1 : 0;
    // Right to left
    totalXmas += isMAS(x, y, -1, 0) ? 1 : 0;

    // Top to bottom
    totalXmas += isMAS(x, y, 0, 1) ? 1 : 0;
    // Bottom to top
    totalXmas += isMAS(x, y, 0, -1) ? 1 : 0;

    // Right and downwards
    totalXmas += isMAS(x, y, 1, 1) ? 1 : 0;
    // Right and upwards
    totalXmas += isMAS(x, y, 1, -1) ? 1 : 0;

    // Left and downwards
    totalXmas += isMAS(x, y, -1, 1) ? 1 : 0;
    // Left and upwards
    totalXmas += isMAS(x, y, -1, -1) ? 1 : 0;
  }
})

console.log({ part1: totalXmas });
