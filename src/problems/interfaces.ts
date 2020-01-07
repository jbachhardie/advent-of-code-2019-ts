export interface ProblemFunction {
  (input: string): Promise<string>;
}
