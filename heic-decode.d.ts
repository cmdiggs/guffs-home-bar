declare module 'heic-decode' {
  interface DecodeOptions {
    buffer: Buffer | ArrayBuffer;
  }

  interface DecodeResult {
    width: number;
    height: number;
    data: Uint8ClampedArray;
  }

  function decode(options: DecodeOptions): Promise<DecodeResult>;

  export default decode;
}
