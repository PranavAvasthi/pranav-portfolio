export interface SignatureData {
  paths: {
    d: string;
    length: number;
    character: string;
    offsetX: number;
    wordStart: boolean;
    strokes: readonly string[];
  }[];
  viewBox: string;
  width: number;
  height: number;
}
