/**
 * External dependencies
 */
import { Inter } from 'next/font/google';
import Head from 'next/head';

/**
 * Internal dependencies
 */
import FileUploadForm from '@Components/FileUpload';

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
        <div className="max-w-3xl mx-auto sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">
            Generate Structured Data
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Convert a PDF to JSON
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Use this handy tool to JSONIFY generate structured data from an
            uploaded PDF file using your own data schema.
          </p>
        </div>
        <div className="py-2">
          <FileUploadForm />
        </div>
      </main>
    </>
  );
}
