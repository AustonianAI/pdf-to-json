export type SchemaProperty = {
  description: string;
  type: 'string' | 'array' | 'object' | 'number' | 'boolean';
  items?: Record<string, SchemaProperty>;
  example?: string | number | boolean | object | Array<any>;
};

export type Schema = Record<string, SchemaProperty>;
