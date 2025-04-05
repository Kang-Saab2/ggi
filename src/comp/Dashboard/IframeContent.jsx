import React from 'react';

const IframeContent = ({ url }) => {
  return (
    <div className="h-screen w-full bg-gray-100">
      <iframe 
        src={url} 
        className="w-full h-full border-none"
        title="External Content"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        loading="lazy"
      />
    </div>
  );
};

export default IframeContent; 