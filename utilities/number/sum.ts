
export const sumArray = (input: Readonly<Array<number>>) => {
  return input.reduce((previous, current) => {
    return previous + current;
  }, 0)
}