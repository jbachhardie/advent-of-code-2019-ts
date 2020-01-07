class Param {
  protected input: number;
  constructor(input: number) {
    this.input = input;
  }

  get value(): number {
    throw new Error('Not implemented');
  }

  set value(newValue: number) {
    throw new Error('Not implemented');
  }
}

type Instruction = (...args: Param[]) => Promise<number | void>;

export async function* StaticInput(inputArray: number[]) {
  for (let x of inputArray) {
    yield x;
  }
}

export async function* IntcodeComputer(
  initialState: number[],
  input: AsyncIterator<number> = StaticInput([])
) {
  let pointer = 0;
  let base = 0;
  let state = [...initialState];
  let instructionSet: Record<string, Instruction> = {
    '01': async (x, y, z) => {
      z.value = x.value + y.value;
    },
    '02': async (x, y, z) => {
      z.value = x.value * y.value;
    },
    '03': async x => {
      let nextInput = await input.next();
      if (nextInput.done) throw new Error('Input exhausted');
      x.value = nextInput.value;
    },
    '04': async x => {
      return x.value;
    },
    '05': async (x, y) => {
      if (x.value !== 0) {
        pointer = y.value;
      }
    },
    '06': async (x, y) => {
      if (x.value === 0) {
        pointer = y.value;
      }
    },
    '07': async (x, y, z) => {
      z.value = x.value < y.value ? 1 : 0;
    },
    '08': async (x, y, z) => {
      z.value = x.value === y.value ? 1 : 0;
    },
    '09': async x => {
      base = x.value;
    }
  };
  class PositionalParam extends Param {
    get value() {
      return state[this.input];
    }
    set value(newValue) {
      state[this.input] = newValue;
    }
  }
  class ImmediateParam extends Param {
    get value() {
      return this.input;
    }
  }
  while (true) {
    let currentBit = state[pointer].toString().padStart(2, '0');
    let opCode = currentBit.slice(-2);
    let paramModes = currentBit.slice(0, -2).split('');
    if (opCode === '99') {
      return state;
    }
    let instruction = instructionSet[opCode];
    if (!instruction) throw new Error('Unknown opCode ' + opCode);
    let arity = instruction.length;
    let params: Param[] = [];
    for (let i = 1; i <= arity; i++) {
      let paramMode = paramModes[-i] || '0';
      let param = state[pointer + i];
      switch (paramMode) {
        case '0':
          params.push(new PositionalParam(param));
          break;
        case '1':
          params.push(new ImmediateParam(param));
          break;
        case '2':
          params.push(new PositionalParam(param + base));
          break;
        default:
          throw new Error('Unknown param mode ' + paramMode);
      }
    }
    let result = await instruction(...params);
    if (typeof result !== 'undefined') yield result;
    pointer = pointer + arity + 1;
  }
}
