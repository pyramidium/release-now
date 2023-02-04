// source/types.ts
// Type definitions for the CLI.

// The options you can pass to the CLI.
export declare interface Options {
  '--help': boolean;
  '--version': boolean;
  '--debug': boolean;
}

// The arguments passed to the CLI (the options + the positional arguments)
export declare type Arguments = Partial<Options> & {
  _: string[];
};
