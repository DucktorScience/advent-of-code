import * as fs from 'fs';
import * as path from 'path';
import assert from "assert";

import { sumArray } from "utilities/number";

const filePath = path.join(__dirname, 'input.txt');
const INPUT = fs.readFileSync(filePath, 'utf8');

const getValue = (line: string) => {
  const [toClosingBracket] = line.split(')');

  if (toClosingBracket.includes(' ')) {
    return Number.NaN;
  }

  const [left, right, ...rest] = toClosingBracket.split(',');


  if (rest.length !== 0) {
    return Number.NaN;
  }

  const leftNumber = Number(left);
  const rightNumber = Number(right);

  if (isNaN(leftNumber) || isNaN(rightNumber)) {
    return Number.NaN;
  }

  return leftNumber * rightNumber;
}

const runProgram = (input: string, considerStops = false) => {
  let isStopped = false;

  const data = input.split(`mul(`)
    .map(line => {
      const [toClosingBracket] = line.split(')');

      const doIndex = line.lastIndexOf('do()');
      const dontIndex = line.lastIndexOf(`don't()`);

      if (doIndex !== -1 || dontIndex !== -1) {

        if (doIndex > dontIndex || dontIndex === -1) {
          return { line: toClosingBracket, becomeStopped: false };
        } else if (doIndex < dontIndex || doIndex === -1) {
          return { line: toClosingBracket, becomeStopped: true };
        }
      }

      return { line: toClosingBracket, becomeStopped: null };
    })
    .map(({ line, becomeStopped }) => {
      let ret = isStopped ? 0 : getValue(line);

      if (considerStops && becomeStopped !== null) {
        isStopped = becomeStopped;
      }

      return isFinite(ret) ? ret : 0;
    })

  return sumArray(data);
}

assert(runProgram(`mul(79,304,<from()%`) === 0);
assert(runProgram(`mul(2,4)`) === 8);
assert(runProgram(`mul(2, 4)`) === 0);
assert(runProgram(`mul(2, 4`) === 0);
assert(runProgram(`mul(2)`) === 0);
assert(runProgram(`mul(`) === 0);
assert(runProgram(`(`) === 0);
assert(runProgram(`mul ( 2 , 4 )`) === 0);
assert(runProgram(`mul(6,9!`) === 0);
assert(runProgram(`mul(4*`) === 0);

console.log(runProgram(INPUT));
console.log(runProgram(INPUT, true));
