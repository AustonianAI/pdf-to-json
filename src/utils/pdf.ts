import pdfParse from 'pdf-parse';

// Extracts the text from the Buffer object of the PDF and returns a string
export const extractText = async (dataBuffer: Buffer): Promise<string> => {
  const pdfData = await pdfParse(dataBuffer);
  const extractedText: string = pdfData.text;

  const tokenCount = countTokens(extractedText);

  if (tokenCount > 3000) {
    throw new Error(
      `Your PDF file has too much text to process (about ${tokenCount} tokens). Please use a file with less text.`,
    );
  }

  return extractedText;
};

const countTokens = (text: string): number => {
  const whitespaceRegex = /\s+/g;
  const tokenRegex = /[\p{L}\p{N}]+|[\p{P}\p{S}]+/gu;
  const cleanedText = text.replace(whitespaceRegex, ' ').trim();
  const tokens = cleanedText.match(tokenRegex) || [];

  return tokens.length;
};
