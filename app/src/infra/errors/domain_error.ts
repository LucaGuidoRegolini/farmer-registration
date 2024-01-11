import { AppError, ErrorInterface } from '.';

export abstract class DomainError extends AppError {
  constructor(data: ErrorInterface) {
    super({
      name: data.name,
      message: data.message,
      type: data.type,
    });
  }
}

export class InvalidDocumentError extends DomainError {
  constructor() {
    super({
      name: 'Invalid document',
      message: 'Invalid document',
      type: 'INVALID_DOCUMENT',
    });
  }
}

export class InvalidPasswordError extends DomainError {
  constructor() {
    super({
      name: 'Invalid password',
      message: 'Invalid password',
      type: 'INVALID_PASSWORD',
    });
  }
}
