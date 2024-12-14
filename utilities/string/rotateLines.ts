
import { times } from "lodash";

/**
 * Rotates an array of strings
 * 123    147
 * 456 -> 258
 * 789    389
 *
 * Assumes that each line provided is of uniform length */
export const rotateLines = (lines: Readonly<Array<string>>) => {
  if (lines.length === 0) {
    return [];
  }

  // Grid of characters
  const newGrid: Array<string[]> = times(lines.length, () => ([]));

  lines.forEach((line) => {
    const characters = line.split('');
    characters.forEach((character, column) => {
      newGrid[column].push(character);
    })
  });

  return newGrid.map(gridRow => gridRow.join(''));
}
