import { ProblemFunction } from './interfaces';
import { IntcodeComputer } from './intcode-computer';

async function run(
  initialState: number[],
  noun: number,
  verb: number
): Promise<number> {
  initialState[1] = noun;
  initialState[2] = verb;
  let computer = IntcodeComputer(initialState);
  while (true) {
    let output = await computer.next();
    if (output.done) return output.value[0];
  }
}

export const day2problem1: ProblemFunction = async input => {
  let initialState = input.split(',').map(x => parseInt(x));
  return (await run(initialState, 12, 2)).toString();
};

export const day2problem2: ProblemFunction = async input => {
  let initialState = input.split(',').map(x => parseInt(x));
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      try {
        let result = await run(initialState, noun, verb);
        console.log(result);
        if (result === 19690720) return (100 * noun + verb).toString();
      } catch (_) {}
    }
  }
  throw new Error('No result');
};
