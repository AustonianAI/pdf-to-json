import React, { useState } from 'react';
import { SchemaProperty } from '@Types/schemaTypes';
import styles from './SchemaPropertyInput.module.css';

export interface SchemaPropertyWithTitle extends SchemaProperty {
  title: string;
  items?: Record<string, SchemaPropertyWithTitle>;
}

const SchemaPropertyInput: React.FC<{
  index: number;
  property: SchemaPropertyWithTitle;
  onChange: (index: number, property: SchemaPropertyWithTitle) => void;
  className?: string;
  isSubProperty?: true;
}> = ({ index, property, onChange, className, isSubProperty }) => {
  const [subProperties, setSubProperties] = useState<SchemaPropertyWithTitle[]>(
    property.items ? Object.values(property.items) : [],
  );

  // const handlePropertyChange = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  // ) => {
  //   const { name, value } = event.target;

  //   onChange(index, { ...property, [name]: value });
  // };

  const handlePropertyChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    if (name === 'type' && value === 'array') {
      onChange(index, { ...property, [name]: value, items: {} });
    } else {
      onChange(index, { ...property, [name]: value });
    }
  };

  const handleSubPropertyChange = (
    subIndex: number,
    subProperty: SchemaPropertyWithTitle,
  ) => {
    const updatedSubProperties = [...subProperties];
    updatedSubProperties[subIndex] = subProperty;
    setSubProperties(updatedSubProperties);
    onChange(index, {
      ...property,
      items: { ...property.items, [subProperty.title]: subProperty },
    });
  };

  const handleAddSubProperty = () => {
    if (subProperties.length < 10) {
      const updatedSubProperties = [...subProperties];
      const newSubPropertyKey =
        property.items !== undefined ? Object.keys(property.items).length : 0;
      updatedSubProperties[newSubPropertyKey] = {
        title: '',
        description: '',
        type: 'string',
        example: '',
      };
      setSubProperties(updatedSubProperties);
      onChange(index, {
        ...property,
        items: {
          ...property.items,
          [newSubPropertyKey]: updatedSubProperties[newSubPropertyKey],
        },
      });
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-3 mb-3 md:grid-cols-3">
        <div>
          <label htmlFor={`title-${index}`} className={styles.formControlLabel}>
            Data title
          </label>

          <input
            type="text"
            name="title"
            id={`title-${index}`}
            value={property.title}
            onChange={handlePropertyChange}
            className={styles.formControl}
            placeholder="e.g. Invoice ID"
          />
        </div>

        <div>
          <label htmlFor={`type-${index}`} className={styles.formControlLabel}>
            Data type
          </label>

          <select
            name="type"
            id={`type-${index}`}
            value={property.type}
            onChange={handlePropertyChange}
            className={styles.formControl}
          >
            <option value="string">Text</option>
            <option value="number">Number</option>
            <option value="boolean">True/False</option>
            {!isSubProperty && <option value="array">Array</option>}
          </select>
        </div>

        <div>
          <label
            htmlFor={`example-${index}`}
            className={styles.formControlLabel}
          >
            Example
          </label>

          <input
            type="text"
            name="example"
            id={`example-${index}`}
            value={property.example?.toString() || ''}
            onChange={handlePropertyChange}
            className={styles.formControl}
            placeholder="e.g. 81464-B"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`description-${index}`}
          className={styles.formControlLabel}
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
            className={styles.formControl}
            placeholder="e.g. The identifying number of the invoice."
          />
        </div>
      </div>

      {property.type === 'array' && (
        <div className="mt-3 mb-2 ml-5">
          <div className="mb-0.5 mt-6 font-medium">Array items</div>
          <ul>
            {subProperties.map((item, index) => (
              <li
                key={`item-${index}`}
                className="p-3 mb-3 bg-gray-200 rounded-lg"
              >
                <SchemaPropertyInput
                  index={index}
                  property={item}
                  onChange={() => handleSubPropertyChange(index, property)}
                  isSubProperty
                />
              </li>
            ))}
          </ul>
          <div>
            <button
              type="button"
              className="flex items-center px-4 py-2 text-sm font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:ring-2 focus:ring-green-400"
              onClick={handleAddSubProperty}
            >
              Add item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemaPropertyInput;
