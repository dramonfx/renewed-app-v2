
'use client';

export default function TestDebugPage() {
  return (
    <div style={{ 
      backgroundColor: 'lime', 
      color: 'black', 
      padding: '50px', 
      fontSize: '40px', 
      textAlign: 'center',
      minHeight: '100vh'
    }}>
      <h1>TEST DEBUG PAGE WORKING!</h1>
      <p style={{ fontSize: '20px', margin: '20px' }}>
        If you see this lime green page, the server is working correctly.
      </p>
      <p style={{ fontSize: '16px' }}>
        Current URL: {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
      </p>
    </div>
  );
}
