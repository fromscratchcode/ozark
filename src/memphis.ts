import init, { compile, lex, parse } from "../pkg/memphis.js";

export interface Memphis {
  compile(code: string): unknown;
  lex(code: string): unknown;
  parse(code: string): unknown;
}

export const createMemphis = async (): Promise<Memphis> => {
  try {
    await init();
  } catch {
    throw new Error("Failed to initialize Memphis.");
  }

  return {
    compile,
    lex,
    parse,
  };
};
