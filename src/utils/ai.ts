import { Configuration, OpenAIApi } from 'openai';

import { sample_schema } from './data_schema';
import { generateSchemaSummaries } from './schema';
import { extractText } from './pdf';
import { Schema } from '@Types/schemaTypes';
import { document_metadata_schema } from '@Types/metaDataTypes';
import { arrayBuffer } from 'stream/consumers';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const aiPdfHandler = async (fileBuffer: Buffer, dataSchema: Schema) => {
  // Extract the text from the PDF
  const documentText = await extractText(fileBuffer);

  const metadata = await getDocumentMetaData(documentText);

  const schemaToUse = dataSchema || sample_schema;

  const prompts = buildPromptArray(metadata, documentText, schemaToUse);

  const aiResponsesPromises = prompts.map(prompt =>
    createChatCompletion(openai, prompt),
  );

  try {
    const aiResponses = await Promise.all(aiResponsesPromises);
    return zipObjects(aiResponses);
  } catch (error) {
    console.error('Error in processing all the API calls:', error);
  }
};

const buildPromptArray = (
  metadata: any,
  documentText: string,
  schema: Schema,
) => {
  const schemaSummaries: string[] = generateSchemaSummaries(schema);

  //loop through each schema summary and build a prompt
  const prompts: string[] = [];

  for (const summary of schemaSummaries) {
    const prompt = buildPrompt(metadata, documentText, summary);
    prompts.push(prompt);
  }

  return prompts;
};

const buildPrompt = (metadata: any, documentText: string, summary: string) => {
  let prompt = `I have the following document text, which from a(n) ${metadata.type} called ${metadata.name} :\n\n`;

  prompt += documentText;

  prompt += '\n\nCreate JSON data about this text in the format below:\n\n';

  prompt += summary;

  prompt +=
    '\n\nLeave unknown fields null. Response with only JSON in the exact example schema.\n\n###';

  return prompt;
};

const getDocumentMetaData = async (documentText: string) => {
  let prompt = 'I have the following text from a document:\n\n';
  prompt += documentText;
  prompt += '\n\nCreate JSON data about this text in the format below:\n\n';

  prompt += generateSchemaSummaries(document_metadata_schema)[0];

  prompt +=
    '\n\nLeave unknown fields null. Response with only JSON in the exact example schema.\n\n###';

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

const createChatCompletion = async (
  openai: OpenAIApi,
  prompt: string,
): Promise<any> => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
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
      console.log('completed prompt');
      return JSON.parse(message);
    }
  } catch (error: any) {
    console.error('Error creating completion:', error);
    throw error;
  }
};
