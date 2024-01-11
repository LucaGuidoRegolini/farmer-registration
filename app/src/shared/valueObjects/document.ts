import { InvalidDocumentError } from '@infra/errors/domain_error';
import { Either, left, right } from '@infra/either';
import { cnpj } from '@shared/utils/cnpj';
import { cpf } from '@shared/utils/cpf';

export type DocumentType = 'cpf' | 'cnpj';

export class Document {
  private _document: string;
  private _type: DocumentType;

  private constructor(document: string, type: DocumentType) {
    const documentWithoutMask = document.replace(/[^\d]+/g, '');
    this._document = documentWithoutMask;
    this._type = type;
    Object.freeze(this);
  }

  static create(document: string): Either<InvalidDocumentError, Document> {
    if (this.validateCPF(document)) {
      return right(new Document(document, 'cpf'));
    }
    if (this.validateCNPJ(document)) {
      return right(new Document(document, 'cnpj'));
    }

    return left(new InvalidDocumentError());
  }

  private static validateCNPJ(document: string): boolean {
    return cnpj.isValid(document);
  }

  private static validateCPF(document: string): boolean {
    return cpf.isValid(document);
  }

  private formatCPF(document: string): string {
    return cpf.format(document);
  }

  private formatCNPJ(document: string): string {
    return cnpj.format(document);
  }

  public get value(): string {
    return this._document;
  }

  public get document(): string {
    if (this._type == 'cpf') {
      return this.formatCPF(this._document);
    } else if (this._type == 'cnpj') {
      return this.formatCNPJ(this._document);
    } else {
      return this._document;
    }
  }
}
