import { ProblemFunction } from './interfaces';

const calculateFuelRequirement = (mass: number) => {
  return Math.floor(mass / 3) - 2;
};

export const day1part1: ProblemFunction = input => {
  return input
    .split('\n')
    .filter(Boolean)
    .reduce((acc, x) => acc + calculateFuelRequirement(parseInt(x)), 0)
    .toString();
};

const additionalFuelRequired = (initialFuelRequirements: number[]) => {
  let fuelRequirements = initialFuelRequirements;
  let additionalFuelRequirements = fuelRequirements;
  while (true) {
    additionalFuelRequirements = additionalFuelRequirements
      .map(calculateFuelRequirement)
      .filter(x => x > 0);
    if (additionalFuelRequirements.length > 0) {
      fuelRequirements = fuelRequirements.concat(additionalFuelRequirements);
    } else {
      return fuelRequirements;
    }
  }
};

export const day1part2: ProblemFunction = input => {
  const fuelRequirements = input
    .split('\n')
    .filter(Boolean)
    .map(x => calculateFuelRequirement(parseInt(x)));
  return additionalFuelRequired(fuelRequirements)
    .reduce((acc, x) => acc + x, 0)
    .toString();
};
