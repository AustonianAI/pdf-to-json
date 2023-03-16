import { Schema, SchemaProperty } from '../types/schemaTypes';

export const generateSchemaSummary = (schema: Schema): string => {
  let summary = '';

  for (const key in schema) {
    const property = schema[key];
    const descriptionWithType = `${key} (${property.type}): ${property.description}`;

    if (property.type === 'array' && property.items) {
      summary += `${descriptionWithType}\n`;

      const itemsSummary: string[] = [];

      for (const itemKey in property.items) {
        const item = property.items[itemKey];
        itemsSummary.push(
          `   - ${itemKey} (${item.type}): ${item.description}`,
        );
      }

      summary += itemsSummary.join('\n') + '\n';
    } else {
      summary += `${descriptionWithType}\n`;
    }
  }

  // Generate example JSON object
  const example: Record<string, any> = {};

  for (const key in schema) {
    const property = schema[key];

    if (property.type === 'array' && property.items) {
      const itemsExample: Record<string, any> = {};

      for (const itemKey in property.items) {
        const item = property.items[itemKey];
        itemsExample[itemKey] = item.example;
      }

      example[key] = [itemsExample];
    } else {
      example[key] = property.example;
    }
  }

  summary += '\nHere is an example JSON object that follows this schema:\n\n';
  summary += JSON.stringify(example, null, 2);

  return summary;
};
