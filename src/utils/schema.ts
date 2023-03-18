import { Schema, SchemaProperty } from '../types/schemaTypes';

const generateSubSchemaSummary = (
  schema: Schema,
  includeArrays: boolean = true,
  prefix: string = '',
  parentKey?: string,
): string => {
  let summary = '';

  for (const key in schema) {
    const property = schema[key];

    if (property.type === 'array' && property.items) {
      if (includeArrays) {
        summary += `${prefix}${key} (${property.type}): ${property.description}\n`;
      }
    } else {
      summary += `${prefix}${key} (${property.type}): ${property.description}\n`;
    }
  }

  // Generate example JSON object for the current schema
  const example = generateExample(schema, includeArrays, parentKey);
  summary +=
    '\nHere is an example JSON object that follows this schema:\n\n' +
    JSON.stringify(example, null, 2);

  return summary;
};

const generateExample = (
  schema: Schema,
  includeArrays: boolean = true,
  parentKey?: string,
): Record<string, any> => {
  const example: Record<string, any> = {};

  for (const key in schema) {
    const property = schema[key];

    if (property.type === 'array' && property.items) {
      if (includeArrays) {
        example[key] = [generateExample(property.items, true)];
      }
    } else {
      example[key] = property.example;
    }
  }

  if (parentKey) {
    return { [parentKey]: example };
  } else {
    return example;
  }
};

export const generateSchemaSummaries = (schema: Schema): string[] => {
  const summaries: string[] = [];

  // Generate main summary without sub-arrays and their example JSON objects
  summaries.push(generateSubSchemaSummary(schema, false));

  // Generate summaries for nested arrays with the example JSON objects
  for (const key in schema) {
    const property = schema[key];

    if (property.type === 'array' && property.items) {
      summaries.push(generateSubSchemaSummary(property.items, true, '  ', key));
    }
  }

  return summaries;
};
