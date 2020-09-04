export class HeadersAlreadyWrittenException extends Error {
  constructor(message: string) {
    super(message);
  }
}
