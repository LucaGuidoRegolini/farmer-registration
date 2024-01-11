import { Farmer } from '@modules/farm/domains/farmer.domain';
import { Document } from '@shared/valueObjects/document';

describe('farmer domain', () => {
  it('should be create a farmer', () => {
    const document_resp = Document.create('335.106.300-84');
    const document = document_resp.map((document) => document);
    const farmer = Farmer.create({
      name: 'any_name',
      document,
      user_id: 'any_user_id',
    });

    expect(farmer.name).toBe('any_name');
    expect(farmer.id).toBeDefined();
    expect(farmer.document).toBe('335.106.300-84');
    expect(farmer.user_id).toBe('any_user_id');
  });

  it('should be create a farmer with id', () => {
    const document_resp = Document.create('335.106.300-84');
    const document = document_resp.map((document) => document);
    const farmer = new Farmer({
      id: 'any_id',
      name: 'any_name',
      document,
      user_id: 'any_user_id',
    });

    expect(farmer.name).toBe('any_name');
    expect(farmer.id).toBe('any_id');
    expect(farmer.document).toBe('335.106.300-84');
    expect(farmer.user_id).toBe('any_user_id');
  });

  it('should be change user, document and name', () => {
    const document_resp = Document.create('335.106.300-84');
    const document = document_resp.map((document) => document);
    const farmer = new Farmer({
      id: 'any_id',
      name: 'any_name',
      document,
      user_id: 'any_user_id',
    });

    const newDocument_resp = Document.create('939.915.450-55');
    const newDocument = newDocument_resp.map((document) => document);

    farmer.setUser('new_user_id');
    farmer.setName('new_name');
    farmer.setDocument(newDocument);

    expect(farmer.name).toBe('new_name');
    expect(farmer.id).toBe('any_id');
    expect(farmer.document).toBe('939.915.450-55');
    expect(farmer.document_object).toBe(newDocument);
    expect(farmer.user_id).toBe('new_user_id');
  });
});
