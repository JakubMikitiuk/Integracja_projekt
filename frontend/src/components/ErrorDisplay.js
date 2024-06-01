import React from 'react';

const ErrorDisplay = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  );
};

export default ErrorDisplay;