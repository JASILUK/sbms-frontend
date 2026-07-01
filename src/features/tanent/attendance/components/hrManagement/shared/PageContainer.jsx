import React from 'react';
import PropTypes from 'prop-types';

export default function PageContainer({ children, className = '' }) {
  return (
    <main 
      className={`mx-auto max-w-[1440px] w-full px-4 py-6 sm:px-6 lg:px-8 space-y-6 animate-fade-in ${className}`}
      role="main"
    >
      {children}
    </main>
  );
}

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};