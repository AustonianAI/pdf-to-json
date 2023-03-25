import { StatefulSchemaPropertyWithTitle } from '@Components/SchemaPropertyInput';
import { createContext } from 'react';

type SchemaContextType = {
  schemaProperties: StatefulSchemaPropertyWithTitle[];
  handleAddSchemaProperty: (parentIndex?: number) => void;
  handleRemoveSchemaProperty: (index: number, parentIndex?: number) => void;
  handleSchemaPropertyChange: (
    index: number,
    property: StatefulSchemaPropertyWithTitle,
    parentIndex?: number,
  ) => void;
};

const SchemaContext = createContext<SchemaContextType>({
  schemaProperties: [],
  handleAddSchemaProperty: () => undefined,
  handleRemoveSchemaProperty: () => undefined,
  handleSchemaPropertyChange: () => undefined,
});

export default SchemaContext;
