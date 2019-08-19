declare module 'keycoder' {
  export class Key {
    name: string[];
    keyCode: {
      ie: number,
      mozilla: number,
    };
    character: string | null;
    charCode: number | null;
    shift: {
      character: string | null,
      charCode: number | null,
    };
    isPrintableCharacter(): boolean;
    hasCharCode(): boolean;
    hasDistinctShiftCharacter(): boolean;
    equals(): boolean;
  };

  export function fromEvent(e: Event): Key
}
