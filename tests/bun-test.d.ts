declare module 'bun:test' {
  export function describe(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function expect(received: unknown): {
    toBe(expected: unknown): void;
    toMatchObject(expected: Record<string, unknown>): void;
    toBeUndefined(): void;
    toBeNull(): void;
    toHaveLength(expected: number): void;
  };
}
