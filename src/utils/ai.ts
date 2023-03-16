import { Configuration, OpenAIApi } from 'openai';

import { sample_schema } from './data_schema';
import { generateSchemaSummary } from './schema';
import { extractText } from './pdf';
import { Schema } from '@Types/schemaTypes';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const aiPdfHandler = async (fileBuffer: Buffer) => {
  // Extract the text from the PDF
  const documentText = await extractText(fileBuffer);

  console.log(countTokens(documentText));

  const prompt = buildPrompt(documentText);

  // Query to OpenAI API
  try {
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
  } catch (error: any) {
    console.error('Error creating completion:', error);
  }
};

const buildPrompt = (documentText: string, schema?: Schema) => {
  let prompt = 'I have the following text from a document:\n\n';

  prompt += documentText;

  prompt += '\n\nI need a JSON object that follows the schema below:\n\n';

  const schemaToUse = schema || sample_schema;

  prompt += generateSchemaSummary(schemaToUse);

  prompt +=
    '\n\nIf any piece of data is unclear, leave the field null.  Respond with only JSON.\n\n###';

  return prompt;
};

const countTokens = (text: string): number => {
  // Split the text on spaces and common punctuation marks
  const words = text.split(/[\s,.?!;()]+/);

  // Filter out empty strings caused by consecutive delimiters
  const nonEmptyWords = words.filter(word => word.length > 0);

  // Return the approximate token count
  return nonEmptyWords.length;
};
