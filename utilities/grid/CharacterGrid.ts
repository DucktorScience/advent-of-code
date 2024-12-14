export class CharacterGrid {
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
