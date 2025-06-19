import React, { useState } from 'react';
import FullPageLoader from './FullPageLoader';

const FullPageLoaderDemo = () => {
  const [loading, setLoading] = useState(false);

  const handleShowLoader = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <button
        onClick={handleShowLoader}
        style={{
          padding: '12px 32px',
          fontSize: '1.2rem',
          borderRadius: '8px',
          background: '#00FFFF',
          color: '#222',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '2rem',
        }}
      >
        Show Full Page Loader
      </button>
      <p>Click the button to simulate loading for 2 seconds.</p>
      {loading && <FullPageLoader />}
    </div>
  );
};

export default FullPageLoaderDemo; 