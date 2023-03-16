import { OpenAI } from 'langchain/llms';
import { PDFLoader } from 'langchain/document_loaders';

import { PromptTemplate } from 'langchain/prompts';

import { LLMChain } from 'langchain/chains';

import { sample_schema } from './data_schema';
import { generateSchemaSummary } from './schema';

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

export const aiPdfHandler = async (pdf: Blob) => {
  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
  });

  const doc = await loadPdfAsDocument(pdf);

  const prompt = new PromptTemplate({
    template: `I have the following document:

    {document}

    I need a JSON object that follows the schema below: 

    {responseSchema}

    If any piece of data is unclear, leave the field null.  Respond with only JSON.
    `,
    inputVariables: ['document', 'responseSchema'],
  });

  const chain = new LLMChain({ llm: model, prompt: prompt });

  const schemaSummary = generateSchemaSummary(sample_schema);

  const res = await chain.call({
    document: doc[0].pageContent,
    responseSchema: schemaSummary,
  });

  return JSON.parse(res.text);
};

const loadPdfAsDocument = async (pdf: Blob) => {
  const loader = new PDFLoader(pdf);

  const doc = await loader.load();

  return doc;
};
