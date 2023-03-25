import React, { FC } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

interface RawJsonDisplayProps {
  data: Record<string, any>;
}

const RawJsonDisplay: FC<RawJsonDisplayProps> = ({ data }) => {
  return (
    <div
      className="overflow-auto text-xs border border-gray-300 h-96"
      style={{ backgroundColor: 'rgb(250, 250, 250)' }}
    >
      <SyntaxHighlighter language="json" style={atomOneLight}>
        {/* <pre className="text-sm text-left whitespace-pre-wrap">
        
      </pre> */}
        {JSON.stringify(data, null, 2)}
      </SyntaxHighlighter>
    </div>
  );
};

export default RawJsonDisplay;
