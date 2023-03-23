import { PromptObject, generatePromptObjects } from './buildSchemaPrompt';
import { OpenAIApi } from 'openai';
import { Schema } from '@Types/schemaTypes';

export const buildPromptArray = (
  documentText: string,
  schema: Schema,
): PromptObject[] => {
  const promptObjects: PromptObject[] = generatePromptObjects(schema);

  // loop over each prompt object
  promptObjects.forEach(subPrompt => {
    const { summary } = subPrompt;

    subPrompt.prompt = buildPrompt(documentText, summary);
  });

  return promptObjects;
};

const buildPrompt = (documentText: string, summary: string): string => {
  let prompt = `I have the following document text :\n\n`;

  prompt += documentText;

  prompt +=
    '\n\nCreate an ordered list as a valid Javascript array with data about this text in the format below:\n\n';

  prompt += summary;

  prompt +=
    '\n\nIf a data field is unknown, use a null value. Respond with only a valid Javascript array in the exact example schema.\n\n###';

  return prompt;
};

export const createChatCompletion = async (
  openai: OpenAIApi,
  promptObject: PromptObject,
): Promise<PromptObject> => {
  try {
    if (!promptObject.prompt) {
      return promptObject;
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.4,
      messages: [
        {
          role: 'user',
          content: promptObject.prompt,
        },
      ],
    });

    const message = response.data.choices[0]?.message?.content;

    if (!message) {
      throw new Error('No message returned from OpenAI');
    } else {
      // copy the prompt object
      const resultPromptObject = { ...promptObject };
      resultPromptObject.output = convertTextToValidArray(message);

      return resultPromptObject;
    }
  } catch (error: any) {
    console.error('Error creating completion:', error);
    throw error;
  }
};

function convertTextToValidArray(jsonString: string): any[] {
  const openedBrackets = (jsonString.match(/\[/g) || []).length;
  const closedBrackets = (jsonString.match(/\]/g) || []).length;
  const missingBrackets = openedBrackets - closedBrackets;

  if (missingBrackets > 0) {
    // Check if the last character is not a double quote
    if (jsonString[jsonString.length - 1] !== '"') {
      jsonString += '"';
    }
    for (let i = 0; i < missingBrackets; i++) {
      jsonString += ']';
    }
  }

  try {
    // Remove leading/trailing white spaces and newline characters
    const trimmedString = jsonString.trim();

    // Remove the trailing comma before the closing bracket
    const fixedString = trimmedString.replace(/,\s*\]$/, ']');

    const afterParse = JSON.parse(fixedString);

    if (missingBrackets > 0) {
      afterParse.pop();
    }

    return afterParse;
  } catch (error) {
    console.error('Error parsing JSON string:', jsonString);

    throw new Error('Error parsing JSON string');
  }
}
