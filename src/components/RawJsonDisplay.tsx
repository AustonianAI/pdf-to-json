import React, { FC } from 'react';

interface RawJsonDisplayProps {
  data: Record<string, any>;
}

const RawJsonDisplay: FC<RawJsonDisplayProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-md">
      <pre className="text-sm font-mono whitespace-pre-wrap text-left">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default RawJsonDisplay;
