export default class FBError extends Error {
  readonly code: number;
  readonly type: string;

  constructor(message: string, code: number, type: string) {
    super(message);

    this.code = code;
    this.type = type;
  }
}