import { Configuration, OpenAIApi } from 'openai';

import { sample_schema } from './data_schema';
import { generateSchemaSummary } from './schema';
import { extractText } from './pdf';
import { Schema } from '@Types/schemaTypes';

// export const aiHandler = async (text: String) => {
//   const model = new OpenAI({
//     openAIApiKey: process.env.OPENAI_API_KEY,
//   });

//   const res = await model.call(
//     'What would be a good company name a company that makes colorful socks?',
//   );
//   console.log(res);

//   return '';
// };

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const aiPdfHandler = async (fileBuffer: Buffer) => {
  // Extract the text from the PDF
  const documentText = await extractText(fileBuffer);

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
