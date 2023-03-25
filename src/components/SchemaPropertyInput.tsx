import React, { useContext, useState } from 'react';
import { SchemaProperty, StatefulSchemaProperty } from '@Types/schemaTypes';
import styles from './SchemaPropertyInput.module.css';
import SchemaContext from '@Context/schema-context';

export interface StatefulSchemaPropertyWithTitle
  extends Omit<StatefulSchemaProperty, 'items'> {
  title: string;
  items?: StatefulSchemaPropertyWithTitle[];
}

const SchemaPropertyInput: React.FC<{
  index: number;
  property: StatefulSchemaPropertyWithTitle;
  className?: string;
  parentIndex?: number;
}> = ({ index, property, className, parentIndex }) => {
  const {
    schemaProperties,
    handleSchemaPropertyChange,
    handleAddSchemaProperty,
  } = useContext(SchemaContext);

  const handlePropertyChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    handleSchemaPropertyChange(
      index,
      { ...property, [name]: value },
      parentIndex,
    );
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
            {parentIndex === undefined && <option value="array">Array</option>}
          </select>
        </div>

        {property.type !== 'array' && (
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
        )}
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
            {property.items?.map((item, itemIndex) => (
              <li
                key={`item-${itemIndex}`}
                className="p-3 mb-3 bg-gray-200 rounded-lg"
              >
                <SchemaPropertyInput
                  index={itemIndex}
                  property={item}
                  parentIndex={index}
                />
              </li>
            ))}
          </ul>
          <div>
            <button
              type="button"
              className="flex items-center px-4 py-2 text-sm font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:ring-2 focus:ring-green-400"
              onClick={() => handleAddSchemaProperty(index)}
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
