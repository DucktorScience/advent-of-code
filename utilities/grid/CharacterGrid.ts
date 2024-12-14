import { times } from "lodash";
import { Point } from "utilities/space";

/**
 * top-left-origin
 */
export class CharacterGrid {
  private cells: string[][];
  private readonly fallbackCharacter: string;

  constructor(input: Readonly<Array<string>>, fallbackCharacter?: string);
  constructor(width: number, height: number, fillCharacter?: string, fallbackCharacter?: string);

  constructor(inputOrWidth: Readonly<Array<string>> | number, fallbackOrHeight?: string | number, constructorArgC?: string, constructorArgD?: string) {
    if (Array.isArray(inputOrWidth)) {
      this.cells = inputOrWidth.map(line => line.split(''));
      if (typeof fallbackOrHeight === 'number') {
        throw new Error(`unexpected route in constructor, expected fallback character to be a string, it is: ${fallbackOrHeight}`);
      }
      this.fallbackCharacter = fallbackOrHeight ?? '.';
    } else {
      const width = inputOrWidth as number;
      const height = fallbackOrHeight as number;
      const fillCharacter = constructorArgC ?? '.';
      this.fallbackCharacter = constructorArgD ?? '.';
      this.cells = times(height).map(() => times(width).map(() => fillCharacter));
    }
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
