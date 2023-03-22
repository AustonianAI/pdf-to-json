import { Schema, SchemaProperty } from '@Types/schemaTypes';
import { PromptObject } from './buildSchemaPrompt';

interface ResultObject {
  [key: string]: any;
}

export const generateJsonObject = (completedPrompt: PromptObject) => {
  const { schema, output } = completedPrompt;
  let result: ResultObject = {};

  let index = 0;
  for (const key in schema) {
    if (
      schema[key].type === 'array' &&
      schema[key].items &&
      output &&
      Array.isArray(output[index]) &&
      typeof schema[key].items === 'object'
    ) {
      const subSchemaKeys = Object.keys(
        schema[key].items as Record<string, SchemaProperty>,
      );

      result[key] = output.map((item: any[]) => {
        const obj: ResultObject = {};
        subSchemaKeys.forEach((subKey, subIndex) => {
          obj[subKey] = item[subIndex];
        });
        return obj;
      });
    } else if (schema[key].type !== 'array') {
      result[key] = output?.[index];
    }
    index++;
  }

  return result;
};
