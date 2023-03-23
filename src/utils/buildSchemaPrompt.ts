import { Schema, SchemaProperty } from '../types/schemaTypes';

export type PromptObject = {
  id: number;
  summary: string;
  schema: Schema;
  prompt?: string;
  output?: any[];
};

let currentPromptId = 1;

export const generatePromptObjects = (schema: Schema): PromptObject[] => {
  const promptObjects: PromptObject[] = [];

  const filteredMainSchema: Schema = {};
  const mainSchemaSummary: string[] = [];
  const mainSchemaExample: any[] = [];

  for (const key in schema) {
    const property = schema[key];
    if (property.type !== 'array') {
      filteredMainSchema[key] = property;
      mainSchemaSummary.push(
        `{${key} is a ${property.type} with the following description- ${property.description}}`,
      );
      mainSchemaExample.push(property.example);
    } else {
      const arraySchemaSummary: string[] = [];
      const arraySchemaExample: any[] = [];

      if (property.items) {
        for (const subKey in property.items) {
          const subProperty = property.items[subKey];
          arraySchemaSummary.push(
            `{${subKey} is a ${subProperty.type} with the following description- ${subProperty.description}}`,
          );
          arraySchemaExample.push(subProperty.example);
        }

        const arrayPrompt: PromptObject = {
          id: currentPromptId++,
          summary: `[ [ "${arraySchemaSummary.join(
            '", "',
          )}" ] ]\n\nEach item should be in a nested array, like this example: \n [ [ "${arraySchemaExample.join(
            '", "',
          )}" ] ]`,
          schema: { [key]: property },
        };
        promptObjects.push(arrayPrompt);
      }
    }
  }

  const mainPrompt: PromptObject = {
    id: currentPromptId++,
    summary: `[ "${mainSchemaSummary.join(
      '", "',
    )}" ]\n\nAn example of the data in this expected format is \n [ "${mainSchemaExample.join(
      '", "',
    )}" ] `,
    schema: filteredMainSchema,
  };

  promptObjects.push(mainPrompt);

  return promptObjects;
};
