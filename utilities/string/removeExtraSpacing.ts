/**
 * Removes extra spaces from a given string, replacing consecutive spaces with a single space.
 *
 * @param source - The input string with extra spaces.
 * @returns - The string with extra spaces removed.
 */
export const removeExtraSpacing = (source: string) => {
  const words = source.split(' ');
  const filteredWords = words.filter(word => word !== '');
  return filteredWords.join(' ');
}
