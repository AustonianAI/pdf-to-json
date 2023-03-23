'use client';

import { useState, useCallback } from 'react';
import DropZone from './Dropzone';
import clsx from 'clsx';
import RawJsonDisplay from './RawJsonDisplay';
import Spinner from './Spinner';

import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'; // Import the necessary icons

import { Schema } from '@Types/schemaTypes';
import SchemaPropertyInput, {
  SchemaPropertyWithTitle,
} from './SchemaPropertyInput';

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isDropActive, setIsDropActive] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [rawJson, setRawJson] = useState(null);

  const onDragStateChange = useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, []);

  const onFilesDrop = useCallback((files: File[]) => {
    if (files && files.length > 0) setFile(files[0]);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0)
      setFile(event.target.files[0]);
  };

  const [schemaProperties, setSchemaProperties] = useState<
    SchemaPropertyWithTitle[]
  >([
    {
      title: '',
      description: '',
      type: 'string',
      example: '',
    },
  ]);

  const handleAddSchemaProperty = () => {
    if (schemaProperties.length < 10) {
      setSchemaProperties([
        ...schemaProperties,
        {
          title: '',
          description: '',
          type: 'string',
          example: '',
        },
      ]);
    }
  };

  const handleRemoveSchemaProperty = (index: number) => {
    const updatedSchemaProperties = [...schemaProperties];
    updatedSchemaProperties.splice(index, 1);
    setSchemaProperties(updatedSchemaProperties);
  };

  const handleSchemaPropertyChange = (
    index: number,
    property: SchemaPropertyWithTitle,
  ) => {
    const updatedSchemaProperties = [...schemaProperties];
    updatedSchemaProperties[index] = property;
    setSchemaProperties(updatedSchemaProperties);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    // Create schema object from schemaProperties array
    const schema: Schema = schemaProperties.reduce(
      (acc, property) => ({
        ...acc,
        [property.title]: {
          description: property.description,
          type: property.type,
          example: property.example,
        },
      }),
      {},
    );

    setRawJson(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('schema', JSON.stringify(schema));

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { data } = await response.json();

      // Set the raw JSON data
      if (data) {
        setRawJson(data);
      }

      console.log('AI RESPONSE JSON:', data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-start">
        <div className="w-full lg:w-3/5 p-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="mb-4 text-lg font-semibold">Define Your Data</h2>
            <div className="text-left">
              {schemaProperties.map((property, index) => (
                <div className="relative" key={index}>
                  <SchemaPropertyInput
                    index={index}
                    property={property}
                    onChange={handleSchemaPropertyChange}
                  />
                  {schemaProperties.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSchemaProperty(index)}
                      className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                    >
                      <AiOutlineClose size={24} />
                    </button>
                  )}
                </div>
              ))}
              {schemaProperties.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddSchemaProperty}
                  className="flex items-center px-4 py-2 mt-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                >
                  <AiOutlinePlus size={24} className="mx-2" /> Add Field
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/5 p-1">
          <div className="bg-white shadow-md rounded-lg p-6 mb-4 lg:mb-0">
            <h2 className="mb-4 text-lg font-semibold">Upload Your PDF</h2>
            <DropZone
              onDragStateChange={onDragStateChange}
              onFilesDrop={onFilesDrop}
              className={clsx(
                'relative w-full h-32',
                'border-2 border-dashed rounded-xl',
                isDropActive
                  ? 'bg-blue-200 border-blue-500'
                  : 'bg-gray-100 border-gray-300',
              )}
            >
              <input
                type="file"
                id="fileUpload"
                className="absolute top-0 left-0 invisible w-full h-full"
                onChange={handleFileChange}
                accept="application/pdf"
              />
              <label
                htmlFor="fileUpload"
                className="flex items-center justify-center w-full h-full p-4 mb-2 font-semibold text-gray-700 cursor-pointer"
              >
                {file && file.name ? (
                  <div>
                    {file.name}
                    <br />
                    <span className="text-blue-500 hover:text-blue-700">
                      Change PDF
                    </span>
                  </div>
                ) : (
                  <div>
                    Drag and drop a PDF here, or
                    <br />
                    <span className="text-blue-500 hover:text-blue-700">
                      browse your device
                    </span>
                    .
                  </div>
                )}
              </label>
            </DropZone>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mt-2">
            <h2 className="mb-4 text-lg font-semibold">Generate Data</h2>
            <div className="mt-auto">
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
              >
                {isLoading ? <Spinner /> : 'Generate Data'}
              </button>
            </div>
            <div className="flex flex-col h-full">
              <div className="mb-4">
                {rawJson ? (
                  <RawJsonDisplay data={rawJson} />
                ) : (
                  <p className="text-gray-500">
                    The extracted data will be displayed here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
