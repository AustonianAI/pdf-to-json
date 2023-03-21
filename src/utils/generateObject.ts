import { Schema, SchemaProperty } from '@Types/schemaTypes';

export const createJsonObject = (
  data: any[][],
  schema: Record<string, SchemaProperty>,
): { [key: string]: any } => {
  console.log(data);

  const entry: { [key: string]: any } = {};
  const row = data[0];
  let index = 0;

  for (const key in schema) {
    entry[key] = row[index];
    index++;
  }

  return entry;
};
