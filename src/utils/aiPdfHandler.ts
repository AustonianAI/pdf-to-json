import { Buffer } from 'buffer';
import { sample_schema } from './data_schema';
import { extractText } from './pdf';
import { openai } from './api';
import { buildPromptArray, createChatCompletion } from './prompts';
import { generateJsonObject } from './generateObject';
import { Schema } from '@Types/schemaTypes';

export const aiPdfHandler = async (
  fileBuffer: Buffer,
  schema: Schema,
): Promise<any> => {
  try {
    // Extract the text from the PDF
    const documentText = await extractText(fileBuffer);

    const schemaToUse = schema || sample_schema;

    const prompts = buildPromptArray(documentText, schemaToUse);

    const aiResponsesPromises = prompts
      .map(subPrompt => {
        if (subPrompt.prompt) {
          return createChatCompletion(openai, subPrompt);
        }
      })
      .filter(promise => promise !== undefined);

    const completedPromptObjects = await Promise.all(aiResponsesPromises);
    const resultObjectArr = completedPromptObjects.map(completedPromptObj => {
      if (completedPromptObj?.output) {
        return generateJsonObject(completedPromptObj);
      }
    });
    return zipObjects(resultObjectArr);
  } catch (error: any) {
    console.error(error);

    throw new Error(error);
  }
};

const zipObjects = (aiResponse: any[]): any => {
  return Object.assign({}, ...aiResponse);
};
