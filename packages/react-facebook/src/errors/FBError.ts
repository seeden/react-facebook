export default class FBError extends Error {
  readonly code: number;
  readonly type: string;
  readonly name = 'FBError';

  constructor(message: string, code: number, type: string) {
    super(`[react-facebook] ${message} (code: ${code}, type: ${type})`);

    this.code = code;
    this.type = type;
  }
}
