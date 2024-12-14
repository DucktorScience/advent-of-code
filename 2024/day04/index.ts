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
    totalXmas += [
      // Lef to right
      isMAS(x, y, 1, 0),
      // Right to left
      isMAS(x, y, -1, 0),

      // Top to bottom
      isMAS(x, y, 0, 1),
      // Bottom to top
      isMAS(x, y, 0, -1),

      // Right and downwards
      isMAS(x, y, 1, 1),
      // Right and upwards
      isMAS(x, y, 1, -1),

      // Left and downwards
      isMAS(x, y, -1, 1),
      // Left and upwards
      isMAS(x, y, -1, -1),
    ].filter(Boolean).length;
  }
})

console.log({ part1: totalXmas });

let totalMas = 0;

grid.forEach((value, x, y) => {
  if (value === 'A') {
    const NE = grid.getValue(x + 1, y - 1);
    const SW = grid.getValue(x - 1, y + 1);

    if ((NE === 'M' && SW === 'S') || (SW === 'M' && NE === 'S')) {
      const SE = grid.getValue(x + 1, y + 1);
      const NW = grid.getValue(x - 1, y - 1);

      if ((NW === 'M' && SE === 'S') || (SE === 'M' && NW === 'S')) {
        totalMas++;
      }
    }
  }
});

console.log({ part2: totalMas });
