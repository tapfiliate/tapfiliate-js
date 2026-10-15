export interface TapCreateOptions {
  integration?: string;
  [option: string]: unknown;
}

export interface Tap {
  /** Loads tapfiliate.js once, then runs `create` and `detect`. */
  init(
    accountId: string,
    createOptions?: TapCreateOptions,
    createCallback?: (...args: unknown[]) => void,
    detectOptions?: Record<string, unknown>,
    detectCallback?: (...args: unknown[]) => void
  ): void;
  /** Any other tapfiliate.js method, e.g. Tap.conversion(id, amount) or Tap.customer(id). */
  [method: string]: (...args: any[]) => void;
}

declare const Tap: Tap;
export default Tap;
