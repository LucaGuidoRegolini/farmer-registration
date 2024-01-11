export interface ErrorInterface {
  name: string;
  message: string;
  type?: string;
}

export abstract class AppError extends Error {
  private _name: string;
  private _message: string;
  private _type: string;

  constructor({ name, message, type = 'ERROR' }: ErrorInterface) {
    super(message);
    this._name = name;
    this._message = message;
    this._type = type;
  }

  public get message(): string {
    return this._message;
  }

  public get type(): string {
    return this._type;
  }

  public get name(): string {
    return this._name;
  }
}
