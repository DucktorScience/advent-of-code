import { alphaComparator } from "utilities/string";
import { INPUT } from "./input"
import assert from "assert";

const lines = INPUT.split('\n').filter(line => line.trim().length);

const wireValues = new Map<string, number | null>();

type Operation = 'AND' | 'XOR' | 'OR';

function assertIsOperation(operationMaybe: string): asserts operationMaybe is Operation {
  if (operationMaybe !== 'AND' && operationMaybe !== 'OR' && operationMaybe !== 'XOR') {
    throw new Error(`"${operationMaybe}" is not a valid operation name`);
  }
}

type Gate = {
  inputWireA: string;
  inputWireB: string;
  operation: Operation;
  outputWire: string;
}

const gates: Array<Gate> = [];

lines.forEach(line => {
  const wireParts = line.split(': ');
  if (wireParts.length === 2) {
    wireValues.set(wireParts[0], Number(wireParts[1]));
  } else {
    const [inputWireA, operation, inputWireB, _, outputWire] = line.split(' ');
    assertIsOperation(operation);

    gates.push({
      inputWireA,
      inputWireB,
      operation,
      outputWire,
    });

    [inputWireA, inputWireB, outputWire].forEach(wire => {
      if (!wireValues.has(wire)) {
        wireValues.set(wire, null);
      }
    })
  }
});

const printWireValues = () => {
  const wireLines = [...wireValues.entries()]
    .map(([key, value]) => `${key}: ${value}`)
    .sort(alphaComparator);
  console.log(wireLines.join('\n'));
}

const allWiresStartingWithZ = Object.freeze([...wireValues.keys()].filter(wire => wire.startsWith('z')).sort(alphaComparator));

const allWiresStartingWithZWithValues = () => {
  return allWiresStartingWithZ.every(wire => {
    const value = wireValues.get(wire);
    assert(value !== undefined);
    return value !== null;
  })
}

const calculateOutput = (operation: Operation, inputValueA: number, inputValueB: number) => {
  switch (operation) {
    case 'AND':
      return inputValueA && inputValueB ? 1 : 0;
    case 'OR':
      return inputValueA || inputValueB ? 1 : 0;
    case "XOR":
      return ((inputValueA && !inputValueB) || (inputValueB && !inputValueA)) ? 1 : 0;
  }
}

assert(calculateOutput('AND', 0, 0) === 0);
assert(calculateOutput('AND', 1, 0) === 0);
assert(calculateOutput('AND', 0, 1) === 0);
assert(calculateOutput('AND', 1, 1) === 1);

assert(calculateOutput('OR', 0, 0) === 0);
assert(calculateOutput('OR', 1, 0) === 1);
assert(calculateOutput('OR', 0, 1) === 1);
assert(calculateOutput('OR', 1, 1) === 1);

assert(calculateOutput('XOR', 0, 0) === 0);
assert(calculateOutput('XOR', 1, 0) === 1);
assert(calculateOutput('XOR', 0, 1) === 1);
assert(calculateOutput('XOR', 1, 1) === 0);

const tickGate = (gate: Gate) => {
  const valueA = wireValues.get(gate.inputWireA);
  const valueB = wireValues.get(gate.inputWireB);

  if (valueA === null || valueB === null) {
    // No input values yet
    return;
  }

  const output = calculateOutput(gate.operation, valueA, valueB);
  wireValues.set(gate.outputWire, output);
}

const solvePart1 = () => {
  while (!allWiresStartingWithZWithValues()) {
    for (const gate of gates) {
      tickGate(gate);
    }
  }

  const binary = allWiresStartingWithZ.map(id => wireValues.get(id)).toReversed().join('');
  return parseInt(binary, 2);
}

const part1 = solvePart1();

console.log({
  part1,
})
