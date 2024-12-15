import { Direction } from "./types"

export const arrowToDirection = (arrow: string): Direction => {
  switch (arrow) {
    case '<':
      return 'W';
    case '>':
      return 'E';
    case '^':
      return 'N';
    case 'v':
      return 'S';
  }

  throw new Error(`Unexpected arrow input "${arrow}"`)
}