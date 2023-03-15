import pdfParse from 'pdf-parse';

// Extracts the text from the Buffer object of the PDF and returns a string
export const extractText = async (dataBuffer: Buffer): Promise<string> => {
  const pdfData = await pdfParse(dataBuffer);
  const extractedText: string = pdfData.text;

  return extractedText;
};
