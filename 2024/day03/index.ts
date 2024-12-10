import { sumArray } from "utilities/number";

import * as fs from 'fs';
import * as path from 'path';
import assert from "assert";
import { isNumber } from "lodash";

const filePath = path.join(__dirname, 'input.txt');
const INPUT = fs.readFileSync(filePath, 'utf8');

const runProgram = (input: string) => {
  const data = input.split(`mul(`)
    .filter(line => line.includes(')'))
    .map(line => {
      const [toClosingBracket] = line.split(')');
      return toClosingBracket;
    })
    .filter(line => !line.includes(' '))
    .map(line => line.split(','))
    .filter(([left, right, ...rest]) => rest.length === 0)
    .map(([left, right]) => {
      return [Number(left), Number(right)];
    })
    .filter(([left, right]) => {
      return isFinite(left) && isFinite(right);
    })
    .map(([left, right]) => {
      return left * right;
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
