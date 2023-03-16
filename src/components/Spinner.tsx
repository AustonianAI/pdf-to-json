import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center px-4 py-2 ">
      <div className="w-3 h-3 bg-white rounded-full mx-1 animate-bounce"></div>
      <div className="w-3 h-3 bg-white rounded-full mx-1 animate-bounce"></div>
      <div className="w-3 h-3 bg-white rounded-full mx-1 animate-bounce"></div>
    </div>
  );
};

export default Spinner;
