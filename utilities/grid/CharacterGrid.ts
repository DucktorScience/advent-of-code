import { Point } from "utilities/space";

/**
 * top-left-origin
 */
export class CharacterGrid {
  private cells: string[][];

  constructor(input: Readonly<Array<string>>, private readonly fallbackCharacter = '.') {
    this.cells = input.map(line => line.split(''));
  }

  getValue(x: number, y: number) {
    return this.cells[y]?.[x] ?? this.fallbackCharacter;
  }

  setValue(x: number, y: number, value: string) {
    if (y >= 0 && x >= 0 && y < this.cells.length && x < this.cells[y].length) {
      this.cells[y][x] = value;
    } else {
      throw new Error('Out of bounds')
    }
  }

  getLines() {
    return this.cells.map(line => line.join(''));
  }

  toString() {
    return this.getLines().join('\n');
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

  find(character: string): Point | null {
    for (let y = 0; y < this.cells.length; ++y) {
      const row = this.cells[y];

      for (let x = 0; x < row.length; ++x) {
        if (row[x] === character) {
          return { x, y };
        }
      }
    }

    return null;
  }

  clone(): CharacterGrid {
    return new CharacterGrid(this.getLines(), this.fallbackCharacter)
  }
}
