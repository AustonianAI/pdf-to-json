import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer, { Multer, RequestHandler } from "multer";
import type { Field } from "multer";
import pdfParse from "pdf-parse";

const upload: Multer = multer({ storage: multer.memoryStorage() });
const uploadMiddleware: RequestHandler = upload.single("pdf");

type ExtendedNextApiRequest = NextApiRequest & {
  file: Express.Multer.File;
};

const handler = nextConnect<ExtendedNextApiRequest, NextApiResponse>();

handler.use(uploadMiddleware);

handler.post(async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file received");
    }

    console.log("Request received");
    console.log("File name:", req.file.originalname);

    // Extract text content from the PDF
    const dataBuffer: Buffer = req.file.buffer;
    const pdfData: pdfParse.PDFData = await pdfParse(dataBuffer);
    const extractedText: string = pdfData.text;

    console.log("Extracted text:", extractedText);

    res
      .status(200)
      .json({ fileName: req.file.originalname, text: extractedText });
  } catch (error: any) {
    console.error("Middleware error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
