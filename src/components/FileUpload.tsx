'use client';

import { useState, useCallback } from 'react';
import DropZone from './Dropzone';
import clsx from 'clsx';
import RawJsonDisplay from './RawJsonDisplay';
import Spinner from './Spinner';

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

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('schema', JSON.stringify(schema));

      console.log(formData.get('schema'));

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
      <form onSubmit={handleSubmit}>
        <DropZone
          onDragStateChange={onDragStateChange}
          onFilesDrop={onFilesDrop}
          className={clsx(
            'relative w-full h-48 mb-4',
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

        <div className="my-4 text-left space-y-2">
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Data Structure
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Define the data structure that you would like to generate.
            </p>
          </div>

          {schemaProperties.map((property, index) => (
            <SchemaPropertyInput
              key={index}
              index={index}
              property={property}
              onChange={handleSchemaPropertyChange}
            />
          ))}
          {schemaProperties.length < 10 && (
            <button
              type="button"
              onClick={handleAddSchemaProperty}
              className="px-4 py-2 mt-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:ring-2 focus:ring-green-400"
            >
              Add Schema Property
            </button>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        >
          {isLoading ? <Spinner /> : 'Submit'}
        </button>
      </form>
      {rawJson && <RawJsonDisplay data={rawJson} />}
    </>
  );
}
