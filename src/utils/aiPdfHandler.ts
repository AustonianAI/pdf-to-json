import { Buffer } from 'buffer';
import { sample_schema } from './data_schema';
import { extractText } from './pdf';
import { openai } from './api';
import { buildPromptArray, createChatCompletion } from './prompts';
import { generatePromptObjects } from './buildSchemaPrompt';
import { document_metadata_schema } from '@Types/metaDataTypes';
import { generateJsonObject } from './generateObject';

export const aiPdfHandler = async (fileBuffer: Buffer): Promise<any> => {
  // Extract the text from the PDF
  const documentText = await extractText(fileBuffer);

  const schemaToUse = sample_schema;

  const prompts = buildPromptArray(documentText, schemaToUse);

  const aiResponsesPromises = prompts
    .map(subPrompt => {
      if (subPrompt.prompt) {
        return createChatCompletion(openai, subPrompt);
      }
    })
    .filter(promise => promise !== undefined);

  try {
    const completedPromptObjects = await Promise.all(aiResponsesPromises);
    const resultObjectArr = completedPromptObjects.map(completedPromptObj => {
      if (completedPromptObj?.output) {
        return generateJsonObject(completedPromptObj);
      }
    });
    return zipObjects(resultObjectArr);
  } catch (error) {
    console.error('Error in processing all the API calls:', error);
  }
};

const zipObjects = (aiResponse: any[]): any => {
  return Object.assign({}, ...aiResponse);
};
