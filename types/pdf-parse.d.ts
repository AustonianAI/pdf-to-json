declare module "pdf-parse" {
  export interface PDFData {
    info: object;
    metadata: object;
    content: string;
    text: string;
    version: string;
    numpages: number;
    numrender: number;
    attachments: object[];
    javascript: string[];
  }

  function pdfParse(dataBuffer: Buffer, options?: object): Promise<PDFData>;

  export default pdfParse;
}
