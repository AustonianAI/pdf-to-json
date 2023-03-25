'use client';

import { useState, useCallback, useMemo } from 'react';
import DropZone from './Dropzone';
import clsx from 'clsx';
import RawJsonDisplay from './RawJsonDisplay';
import Spinner from './Spinner';

import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'; // Import the necessary icons

import { Schema } from '@Types/schemaTypes';
import SchemaPropertyInput, {
  StatefulSchemaPropertyWithTitle,
} from './SchemaPropertyInput';
import SchemaContext from '@Context/schema-context';

export default function FileUploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDropActive, setIsDropActive] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rawJson, setRawJson] = useState<any[]>([]);

  const onDragStateChange = useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, []);

  const onFilesDrop = useCallback((files: File[]) => {
    if (files && files.length > 0) setFiles(files);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setFiles(Array.from(event.target.files));
  };

  const [schemaProperties, setSchemaProperties] = useState<
    StatefulSchemaPropertyWithTitle[]
  >([
    {
      title: '',
      description: '',
      type: 'string',
      example: '',
    },
  ]);

  const memoizedSchemaContext = useMemo(
    () => ({
      schemaProperties,
      handleAddSchemaProperty: (parentIndex?: number) => {
        if (parentIndex !== undefined) {
          const parentProperty = schemaProperties[parentIndex];
          const updatedSubProperties = parentProperty.items || [];
          updatedSubProperties?.push({
            title: '',
            description: '',
            type: 'string',
            example: '',
          });

          parentProperty.items = updatedSubProperties;

          const updatedSchemaProperties = [...schemaProperties];
          updatedSchemaProperties[parentIndex] = parentProperty;
          setSchemaProperties(updatedSchemaProperties);
        } else {
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
        }
      },
      handleRemoveSchemaProperty: (index: number, parentIndex?: number) => {
        if (parentIndex !== undefined) {
          const parentProperty = schemaProperties[parentIndex];
          const updatedSubProperties = parentProperty.items || [];
          updatedSubProperties.splice(index, 1);

          parentProperty.items = updatedSubProperties;

          const updatedSchemaProperties = [...schemaProperties];
          updatedSchemaProperties[parentIndex] = parentProperty;
          setSchemaProperties(updatedSchemaProperties);
        } else {
          const updatedSchemaProperties = [...schemaProperties];
          updatedSchemaProperties.splice(index, 1);
          setSchemaProperties(updatedSchemaProperties);
        }
      },
      handleSchemaPropertyChange: (
        index: number,
        property: StatefulSchemaPropertyWithTitle,
        parentIndex?: number,
      ) => {
        if (parentIndex !== undefined) {
          const parentProperty = schemaProperties[parentIndex];
          const updatedSubProperties = parentProperty.items || [];
          updatedSubProperties[index] = property;

          parentProperty.items = updatedSubProperties;

          const updatedSchemaProperties = [...schemaProperties];
          updatedSchemaProperties[parentIndex] = parentProperty;
          setSchemaProperties(updatedSchemaProperties);
        } else {
          const updatedSchemaProperties = [...schemaProperties];
          updatedSchemaProperties[index] = property;
          setSchemaProperties(updatedSchemaProperties);
        }
      },
    }),
    [schemaProperties],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!files.length) return;

    // Create schema object from schemaProperties array
    const schema: Schema = schemaProperties.reduce((acc, property) => {
      if (property.items !== undefined) {
        return {
          ...acc,
          [property.title]: {
            description: property.description,
            type: property.type,
            items: property.items.reduce((xcc, item) => ({
              ...xcc,
              [item.title]: {
                description: item.description,
                type: item.type,
                example: item.example,
              },
            })),
          },
        };
      } else {
        return {
          ...acc,
          [property.title]: {
            description: property.description,
            type: property.type,
            example: property.example,
          },
        };
      }
    }, {});

    console.log(schema);

    setRawJson([]);
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Iterate through each file and send individual requests
      for (const file of files) {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('schema', JSON.stringify(schema));

        const response = await fetch('/api/upload-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error);
        }

        const { data } = await response.json();

        // Set the raw JSON data
        if (data) {
          // Append the data object to the same array in rawJson state
          setRawJson(prevRawJson => {
            return prevRawJson ? [...prevRawJson, data] : [data];
          });
        }

        console.log('AI RESPONSE JSON:', data);
      }
    } catch (error: any) {
      setErrorMessage(`${error.message}`);
    }

    setIsLoading(false);
  };

  return (
    <SchemaContext.Provider value={memoizedSchemaContext}>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-start">
        <div className="w-full p-1 lg:w-3/5">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Define Your Data</h2>
            <div className="text-left">
              {schemaProperties.map((property, index) => (
                <div className="relative" key={index}>
                  <SchemaPropertyInput
                    index={index}
                    property={property}
                    className="p-3 pb-4 mb-2 bg-gray-100 rounded-lg"
                  />
                  {schemaProperties.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        memoizedSchemaContext.handleRemoveSchemaProperty(index)
                      }
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
                  className="flex items-center px-4 py-2 mt-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                  onClick={() =>
                    memoizedSchemaContext.handleAddSchemaProperty()
                  }
                >
                  <AiOutlinePlus size={24} className="mx-2" /> Add Field
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-full p-1 lg:w-2/5">
          <div className="p-6 mb-4 bg-white rounded-lg shadow-md lg:mb-0">
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
                multiple
              />

              <label
                htmlFor="fileUpload"
                className="flex items-center justify-center w-full h-full p-4 mb-2 font-semibold text-center text-gray-700 cursor-pointer"
              >
                {files.length ? (
                  <div>
                    {files.length} file&#40;s&#41; selected
                    <br />
                    <span className="text-blue-500 hover:text-blue-700">
                      Change PDF&#40;s&#41;
                    </span>
                  </div>
                ) : (
                  <div>
                    Drag and drop PDFs here, or
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
          <div className="p-6 mt-2 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Generate Data</h2>
            <div className="mt-auto">
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
              >
                {isLoading ? <Spinner /> : 'Generate Data'}
              </button>
            </div>
            <div className="mt-4 text-red-600">
              {errorMessage && <p>{errorMessage}</p>}
            </div>
            <div className="flex flex-col h-full">
              <div className="mb-4">
                {rawJson.length ? (
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
    </SchemaContext.Provider>
  );
}
