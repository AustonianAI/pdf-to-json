'use client';

import React, { useState } from 'react';
import DropZone from './Dropzone';

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isDropActive, setIsDropActive] = React.useState(false);

  const onDragStateChange = React.useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, []);

  const onFilesDrop = React.useCallback((files: File[]) => {
    if (files && files.length > 0) setFile(files[0]);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0)
      setFile(event.target.files[0]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('File uploaded:', data.fileName);
      console.log('Extracted text:', data.text);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DropZone
        onDragStateChange={onDragStateChange}
        onFilesDrop={onFilesDrop}
        className={'relative w-full h-48 mb-4'}
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
          className="flex items-center justify-center h-full p-4 mb-2 font-semibold text-gray-700 bg-gray-100 border-2 border-gray-300 border-dashed cursor-pointer rounded-xl"
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
      <button
        type="submit"
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
      >
        Submit
      </button>
    </form>
  );
}
