import { Document } from '@shared/valueObjects/document';

describe('Document value object', () => {
  it('should be create a document with cpf', () => {
    const document_resp = Document.create('865.580.820-20');

    const document = document_resp.map((document) => document);

    expect(document_resp.isRight()).toBeTruthy();
    expect(document_resp.value).toBeInstanceOf(Document);
    expect(document.document).toBe('865.580.820-20');
    expect(document.value).toBe('86558082020');
  });

  it('should be create a document with cnpj', () => {
    const document_resp = Document.create('11.222.333/0001-81');

    const document = document_resp.map((document) => document);

    expect(document_resp.isRight()).toBeTruthy();
    expect(document_resp.value).toBeInstanceOf(Document);
    expect(document.document).toBe('11.222.333/0001-81');
  });

  it('should not be create a document with invalid cpf', () => {
    const document_resp = Document.create('865.580.820-21');

    expect(document_resp.isLeft()).toBeTruthy();
  });
});
