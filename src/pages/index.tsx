import Head from 'next/head';
import { Inter } from 'next/font/google';
import FileUploadForm from '@/components/FileUpload';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>PDF to JSON</title>
        <meta
          name="description"
          content="Convert a PDF file into custom JSON."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="max-w-lg p-6 mx-4 my-10 text-center bg-white rounded-lg shadow-2xl sm:p-8 sm:mx-auto">
          <h3 className="mb-4 text-lg font-bold leading-6">Upload a PDF</h3>
          <FileUploadForm />
        </div>
      </main>
    </>
  );
}
