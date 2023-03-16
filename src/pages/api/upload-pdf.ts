import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer, { Multer } from 'multer';

import { extractText } from '@/utils/pdf';
import { aiPdfHandler } from '@/utils/ai';

const upload: Multer = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = upload.single('pdf');

type ExtendedNextApiRequest = NextApiRequest & {
  file: Express.Multer.File;
};

const handler = nextConnect<ExtendedNextApiRequest, NextApiResponse>();

handler.use(uploadMiddleware);

handler.post(async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file received');
    }

    // Get the Blob from the file
    const blob = new Blob([req.file.buffer], { type: 'application/pdf' });

    const aiResponse = await aiPdfHandler(blob);

    res.status(200).json({ fileName: req.file.originalname, data: aiResponse });
  } catch (error: any) {
    console.error('Middleware error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
