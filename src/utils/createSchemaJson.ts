import { Schema, SchemaProperty } from '@Types/schemaTypes';
import { generateSubSchemaSummary } from './buildSchemaPrompt';

const processSubarray = (
  subSchema: Schema,
  subarray: (string | number)[],
): object[] => {
  const items = [];
  const subarrayLength = subarray.length;

  for (let i = 0; i < subarrayLength; i += Object.keys(subSchema).length) {
    const itemData = subarray.slice(i, i + Object.keys(subSchema).length);
    const item = createJsonObject(subSchema, itemData.join('\n'));
    items.push(item);
  }

  return items;
};

export const createJsonObject = (
  schema: Schema,
  orderedListString: string,
): object => {
  const orderedList = JSON.parse(
    '[' +
      orderedListString
        .replace(/[\n\s]+/g, ' ')
        .replace(/'/g, '"')
        .trim() +
      ']',
  );

  const mainSchemaKeys = generateSubSchemaSummary(schema, false);
  const result: { [key: string]: any } = {};

  mainSchemaKeys.forEach((key, index) => {
    const keyName = key.split(' ')[0];
    const isArray = key.includes('[]');
    if (isArray) {
      const subSchema = schema[keyName] as unknown as Schema;
      result[keyName] = processSubarray(
        subSchema,
        orderedList[index] as (string | number)[],
      );
    } else {
      if (index < orderedList.length) {
        result[keyName] = orderedList[index];
      }
    }
  });

  return result;
};
