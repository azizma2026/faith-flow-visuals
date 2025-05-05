
import React from 'react';

const SkipToContent: React.FC = () => {
  return (
    <a 
      href="#main-content" 
      className="skip-link focus:fixed focus:top-0 focus:left-0 p-2 bg-background z-50"
      aria-label="Skip to main content"
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
