const day5Program: number[] = require('fs')
    .readFileSync('2019/day05/input.txt').toString()
    .split(",")
    .map(Number);

const OPERATION_ADD = 1;
const OPERATION_MULTIPLY = 2;
const OPERATION_TAKE_INPUT = 3;
const OPERATION_PRINT = 4;
const OPERATION_JUMP_IF_TRUE = 5;
const OPERATION_JUMP_IF_FALSE = 6;
const OPERATION_LESS_THAN = 7;
const OPERATION_EQUALS = 8;
const OPERATION_TERMINATE = 99;
type Operation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 99;

const PARAMETER_MODE_POSITION = 0;
const PARAMETER_MODE_IMMEDIATE = 1;
type ParameterMode = 0 | 1;

class OperationDetails {
    constructor(public totalInputs: number, public totalOutputs: number) { }

    get totalSize() {
        return 1 + this.totalInputs + this.totalOutputs;
    }
}

const operationDetailLookup: {[key: number]: OperationDetails} = {};
operationDetailLookup[OPERATION_ADD] = new OperationDetails(2, 1);
operationDetailLookup[OPERATION_MULTIPLY] = new OperationDetails(2, 1);
operationDetailLookup[OPERATION_TAKE_INPUT] = new OperationDetails(0, 1);
operationDetailLookup[OPERATION_PRINT] = new OperationDetails(1, 0)
operationDetailLookup[OPERATION_JUMP_IF_TRUE] = new OperationDetails(2, 0);
operationDetailLookup[OPERATION_JUMP_IF_FALSE] = new OperationDetails(2, 0);
operationDetailLookup[OPERATION_LESS_THAN] = new OperationDetails(2, 1);
operationDetailLookup[OPERATION_EQUALS] = new OperationDetails(2, 1);
operationDetailLookup[OPERATION_TERMINATE] = new OperationDetails(0, 0);

const takeNextInput = (): number => 5;

const safeGetParameter = (index: number, parameters: number[]): number => {
    if (parameters.length <= index) {
        throw new Error("Tried to read non exising parameter at index: " + index + ", parameters are: " + parameters.join(","));
    }

    return parameters[index];
}

interface IOperationOutput {
    data?: number;
    jumpTo?: number;
}

const createDataOutput = (data: number): IOperationOutput => ({data});
const createJumpToOutput = (jumpTo: number): IOperationOutput => ({jumpTo});

const performOperation = (opCode: Operation, parameters: number[]): IOperationOutput => {
    switch (opCode) {
        case OPERATION_ADD:
            return createDataOutput(safeGetParameter(0, parameters) + safeGetParameter(1, parameters));
        case OPERATION_MULTIPLY:
            return createDataOutput(safeGetParameter(0, parameters) * safeGetParameter(1, parameters));
        case OPERATION_TAKE_INPUT:
            return createDataOutput(takeNextInput());
        case OPERATION_JUMP_IF_TRUE: {
            if (safeGetParameter(0, parameters) !== 0) {
                return createJumpToOutput(safeGetParameter(1, parameters));
            }
            return {};
        }
        case OPERATION_JUMP_IF_FALSE: {
            if (safeGetParameter(0, parameters) === 0) {
                return createJumpToOutput(safeGetParameter(1, parameters));
            }
            return {};
        }
        case OPERATION_LESS_THAN: {
            const isLess = safeGetParameter(0, parameters) < safeGetParameter(1, parameters)
            return createDataOutput(isLess ? 1 : 0);
        }
        case OPERATION_EQUALS: {
            const isEqual = safeGetParameter(0, parameters) === safeGetParameter(1, parameters)
            return createDataOutput(isEqual ? 1 : 0);
        }
        case OPERATION_PRINT: {
            console.log(safeGetParameter(0, parameters));
            return {};
        }
    }

    throw new Error("Unknown opCode: " + opCode);
}

const extractOperation = (opCode: number): Operation => {
    const output = opCode % 100;

    if (operationDetailLookup[output]) {
        return output as Operation;
    }

    throw new Error("Unknown operation: " + output + " for opcode: " + opCode);
};

const getParameterModesForOpCode = (opCode: number): ParameterMode[] => {
    const stringified = opCode.toString();

    if (stringified.length <= 2) {
        // Operation is 2 digits, can't have any parameter modes
        return [];
    }

    const withoutOpCode = stringified
        .substring(0, stringified.length - 2)
        .split("")
        .reverse()
        .map(Number);

    withoutOpCode.forEach((parameterMode) => {
        switch (parameterMode) {
            case PARAMETER_MODE_IMMEDIATE:
            case PARAMETER_MODE_POSITION:
                break;
            default: throw new Error("Unknown parameter mode: " + parameterMode);
        }
    });

    return withoutOpCode as ParameterMode[];
};

const getOperationSize = (operation: Operation): number => {
    if (operationDetailLookup[operation]) {
        return operationDetailLookup[operation].totalSize;
    }
    throw new Error("Unknown operation: " + operation);
};

const getTotalParameters = (operation: Operation): number => {
    if (operationDetailLookup[operation]) {
        return operationDetailLookup[operation].totalInputs;
    }
    throw new Error("Unknown operation: " + operation);
};

const executeProgram = (rawProgram: number[]) => {
    const memory: number[] = rawProgram.map(n => n);

    let instructionPointer = 0;
    let opCode: number = memory[0];

    while (opCode !== OPERATION_TERMINATE) {
        const parameterModes = getParameterModesForOpCode(opCode);
        const operation = extractOperation(opCode);
        const totalParameters = getTotalParameters(operation);

        const parameters: number[] = [];
        for (let i = 0; i < totalParameters; ++i) {
            let parameterMode = parameterModes[i] || PARAMETER_MODE_POSITION;

            const address = memory[instructionPointer + 1 + i];
            const value = (parameterMode == PARAMETER_MODE_IMMEDIATE) ? address : memory[address];

            parameters.push(value);
        }

        const operationOutput = performOperation(operation, parameters);
        if (operationOutput.data !== undefined) {
            const outputAddress = memory[instructionPointer + totalParameters + 1];
            memory[outputAddress] = operationOutput.data;
        }

        if (operationOutput.jumpTo === undefined) {
            instructionPointer += getOperationSize(operation);
        } else {
            instructionPointer = operationOutput.jumpTo;
        }

        opCode = memory[instructionPointer];
    }

    return memory[0];
};

export {}
