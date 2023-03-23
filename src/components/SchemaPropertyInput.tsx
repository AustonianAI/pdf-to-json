import React from 'react';
import { SchemaProperty } from '@Types/schemaTypes';

export interface SchemaPropertyWithTitle extends SchemaProperty {
  title: string;
}

const SchemaPropertyInput: React.FC<{
  index: number;
  property: SchemaPropertyWithTitle;
  onChange: (index: number, property: SchemaPropertyWithTitle) => void;
}> = ({ index, property, onChange }) => {
  const handlePropertyChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    onChange(index, { ...property, [name]: value });
  };

  return (
    <div className="border border-gray-200 p-2 rounded mb-2">
      <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
        <div>
          <label
            htmlFor={`title-${index}`}
            className="block text-xs font-medium leading-5 text-gray-900"
          >
            Data Title
          </label>
          <input
            type="text"
            name="title"
            id={`title-${index}`}
            value={property.title}
            onChange={handlePropertyChange}
            className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 
            ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
            focus:ring-indigo-600 text-xs leading-5"
            placeholder="e.g. Invoice ID"
          />
        </div>

        <div>
          <label
            htmlFor={`type-${index}`}
            className="block text-xs font-medium leading-5 text-gray-900"
          >
            Data Type
          </label>

          <select
            name="type"
            id={`type-${index}`}
            value={property.type}
            onChange={handlePropertyChange}
            className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 
            ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
            focus:ring-indigo-600 text-xs leading-5"
          >
            <option value="string">Text</option>
            <option value="number">Number</option>
            <option value="boolean">True/False</option>
          </select>
        </div>

        <div>
          <label
            htmlFor={`example-${index}`}
            className="block text-xs font-medium leading-5 text-gray-900"
          >
            Example
          </label>

          <input
            type="text"
            name="example"
            id={`example-${index}`}
            value={property.example?.toString() || ''}
            onChange={handlePropertyChange}
            className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 
            ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
            focus:ring-indigo-600 text-xs leading-5"
            placeholder="e.g. 81464-B"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`description-${index}`}
          className="block text-xs font-medium leading-5 text-gray-900"
        >
          Description
        </label>
        <div>
          <input
            type="text"
            name="description"
            id={`description-${index}`}
            value={property.description}
            onChange={handlePropertyChange}
            className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 
            ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
            focus:ring-indigo-600 text-xs leading-5"
            placeholder="e.g. The identifying number of the invoice."
          />
        </div>
      </div>
    </div>
  );
};

export default SchemaPropertyInput;
