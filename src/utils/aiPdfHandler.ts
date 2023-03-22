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

  let metadata;
  try {
    metadata = await getDocumentMetaData(documentText);
  } catch (error) {
    console.error('Error getting document metadata:', error);
  }

  const schemaToUse = sample_schema;

  const prompts = buildPromptArray(metadata, documentText, schemaToUse);

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

const getDocumentMetaData = async (documentText: string) => {
  let prompt = 'I have the following text from a document:\n\n';
  prompt += documentText;
  prompt +=
    '\n\nCreate an ordered list as a valid Javascript array with data about this text in the format below:\n\n';

  prompt += generatePromptObjects(document_metadata_schema)[0].summary;

  prompt +=
    '\n\nIf a data field is unknown, use a null value. Respond with only a valid Javascript array in the exact exmaple schema.\n\n###';

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const message = response.data.choices[0]?.message?.content;

  if (!message) {
    throw new Error('No message returned from OpenAI');
  } else {
    return JSON.parse(message);
  }
};

const zipObjects = (aiResponse: any[]): any => {
  return Object.assign({}, ...aiResponse);
};
