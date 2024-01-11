export interface Either<L, R> {
  readonly _tag: 'Left' | 'Right';
  readonly value: L | R;

  isRight(): this is Right<L, R>;
  isLeft(): this is Left<L, R>;

  map<B>(f: (r: R) => B): B;
}

class Right<L, R> implements Either<L, R> {
  readonly _tag = 'Right';
  constructor(readonly value: R) {}

  isRight(): this is Right<L, R> {
    return true;
  }

  isLeft(): this is Left<L, R> {
    return false;
  }

  map<B>(f: (r: R) => B): B {
    return f(this.value);
  }
}

class Left<L, R> implements Either<L, R> {
  readonly _tag = 'Left';
  constructor(readonly value: L) {}

  isRight(): this is Right<L, R> {
    return false;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  map<B>(f: (r: R) => B): B {
    return this.value as any;
  }
}

export class SuccessfulResponse<T> {
  readonly isSuccessful = true;
  constructor(readonly value: T) {}

  static success<T>(value: T): SuccessfulResponse<T> {
    return new SuccessfulResponse(value);
  }
}

export const right = <L, R>(value: R): Either<L, R> => new Right(value);
export const left = <L, R>(value: L): Either<L, R> => new Left(value);
