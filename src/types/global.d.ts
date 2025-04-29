// types/global.d.ts
export {};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Potree: any;
  }
}
