import { Schema, SchemaProperty } from '../types/schemaTypes';

export type PromptObject = {
  summary: string;
  schema: Schema;
  prompt?: string;
  output?: any[];
};

type ArrayHandling = 'include' | 'exclude' | 'only';

export const generateSubSchemaSummary = (
  schema: Schema,
  arrayHandling: ArrayHandling = 'include',
): string[] => {
  const summary: string[] = [];

  for (const key in schema) {
    const property = schema[key];

    if (property.type === 'array' && property.items) {
      if (arrayHandling === 'include' || arrayHandling === 'only') {
        summary.push(`${key} (${property.type}): ${property.description}`);
      }
    } else if (arrayHandling === 'include' || arrayHandling === 'exclude') {
      summary.push(`${key} (${property.type}): ${property.description}`);
    }
  }

  return summary;
};

const generateExample = (
  schema: Schema,
  schemaKeys: string[],
  arrayHandling: ArrayHandling = 'include',
): any[] => {
  const example: any[] = [];

  for (const key of schemaKeys) {
    const property = schema[key.split(' ')[0]];

    if (
      property.type === 'array' &&
      property.items &&
      (arrayHandling === 'include' || arrayHandling === 'only')
    ) {
      example.push(
        generateExample(
          property.items,
          generateSubSchemaSummary(property.items, 'include'),
          'only', // <-- Keep this line as is
        ),
      );
    } else if (arrayHandling === 'include' || arrayHandling === 'exclude') {
      example.push(property.example);
    }
  }

  return example;
};

export const generatePromptObjects = (schema: Schema): PromptObject[] => {
  const promptObjects: PromptObject[] = [];

  const mainSchemaKeys = generateSubSchemaSummary(schema, 'exclude');
  const mainSchemaExample = generateExample(schema, mainSchemaKeys, 'exclude');

  // Filter out subarray properties from the main schema
  const filteredMainSchema: Schema = {};
  for (const key in schema) {
    if (schema[key].type !== 'array') {
      filteredMainSchema[key] = schema[key];
    }
  }

  const mainPrompt: PromptObject = {
    summary: `[ "${mainSchemaKeys.join(
      '", "',
    )}" ]\n\nAn example of the data in this format is \n [ "${mainSchemaExample.join(
      '", "',
    )}" ] `,
    schema: filteredMainSchema,
  };
  promptObjects.push(mainPrompt);

  for (const key in schema) {
    const property = schema[key];
    if (property.type === 'array' && property.items) {
      const arraySchemaKeys = generateSubSchemaSummary(
        property.items,
        'include',
      );
      const arraySchemaExample = generateExample(
        property.items,
        arraySchemaKeys,
        'include',
      );
      const arrayPrompt: PromptObject = {
        summary: `[ [ "${arraySchemaKeys.join(
          '", "',
        )}" ] ]\n\nEach item should be in a nested array, like this example: \n [ [ "${arraySchemaExample.join(
          '", "',
        )}" ] ]`,
        schema: { [key]: property },
      };
      promptObjects.push(arrayPrompt);
    }
  }

  return promptObjects;
};
