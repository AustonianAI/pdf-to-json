/**
 * External dependencies
 */
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';

/**
 * Internal dependencies
 */
import FileUploadForm from '@Components/FileUpload';
import JSONIFYLogoTextOnly from '@Assets/jsonify-logo-text-only.png';

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
        <div className="mx-auto sm:text-center">
          <div className="my-4 text-center">
            <Image
              width={270}
              height={105}
              alt="JSONIFY Logo"
              src={JSONIFYLogoTextOnly}
              className="mx-auto"
            />
          </div>
          <h2 className="text-2xl font-semibold leading-7 text-white">
            Convert a PDF to JSON
          </h2>
          {/* <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Convert a PDF to JSON
          </p> */}
          <p className="mb-6 text-lg leading-8 text-gray-300">
            Use this handy tool to generate structured data from an uploaded PDF
            file using your own data schema.
          </p>
        </div>
        <div className="py-2">
          <FileUploadForm />
        </div>
      </main>
    </>
  );
}
