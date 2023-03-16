export type DocumentMetaDataProperty = {
  description: string;
  type: 'string' | 'object' | 'number' | 'boolean';
  example?: string | number | boolean | object;
};

export type DocumentMetaData = Record<string, DocumentMetaDataProperty>;

export const document_metadata_schema: Record<
  string,
  DocumentMetaDataProperty
> = {
  name: {
    description: 'The name of the document',
    type: 'string',
    example: 'Invoice from Acme, Inc.',
  },
  type: {
    description: 'The type of document',
    type: 'string',
    example: 'Invoice',
  },
  tokens: {
    description: 'The approximate number of tokens contained in the document.',
    type: 'number',
    example: 1050,
  },
};
