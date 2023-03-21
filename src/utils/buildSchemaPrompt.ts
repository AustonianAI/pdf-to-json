import { Schema, SchemaProperty } from '../types/schemaTypes';

export const generateSubSchemaSummary = (
  schema: Schema,
  includeArrays: boolean = true,
): string[] => {
  const summary: string[] = [];

  for (const key in schema) {
    const property = schema[key];

    if (property.type === 'array' && property.items) {
      if (includeArrays) {
        summary.push(`${key} (${property.type}): ${property.description}`);
      }
    } else {
      summary.push(`${key} (${property.type}): ${property.description}`);
    }
  }

  return summary;
};

const generateExample = (
  schema: Schema,
  schemaKeys: string[],
  includeArrays: boolean = true,
): any[] => {
  const example: any[] = [];

  for (const key of schemaKeys) {
    const property = schema[key.split(' ')[0]];

    if (property.type === 'array' && property.items && includeArrays) {
      example.push([
        generateExample(
          property.items,
          generateSubSchemaSummary(property.items, true),
        ),
      ]);
    } else {
      example.push(property.example);
    }
  }

  return example;
};

export const generateSchemaSummaries = (schema: Schema): any[] => {
  const summaries: any[] = [];

  const mainSchemaKeys = generateSubSchemaSummary(schema, false);

  const mainSchemaExample = generateExample(schema, mainSchemaKeys, false);
  summaries.push(
    `[ "${mainSchemaKeys.join(
      '", "',
    )}" ]\n\nAn example of the data in this format is \n [ "${mainSchemaExample.join(
      '", "',
    )}" ] `,
  );

  for (const key in schema) {
    const property = schema[key];

    if (property.type === 'array' && property.items) {
      const arraySchemaKeys = generateSubSchemaSummary(property.items, true);

      const arraySchemaExample = generateExample(
        property.items,
        arraySchemaKeys,
        true,
      );
      summaries.push(
        `[ [ "${arraySchemaKeys.join(
          '", "',
        )}"] ]\n\nEach item should be in a nested array, like this example: \n [ [ "${arraySchemaExample.join(
          '", "',
        )}" ] ]`,
      );
    }
  }

  return summaries;
};
