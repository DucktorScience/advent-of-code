
export const getMiddleValue = <T,>(input: Array<T>): T => {
  if (input.length % 2 === 0) {
    throw new Error(`Array length must be odd, it is ${input.length}`);
  }

  const middleIndex = Math.floor(input.length / 2);
  return input[middleIndex];
}
