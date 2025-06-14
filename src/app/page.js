import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to Renewed</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>The New Man Story</p>
        <Link 
          href="/book" 
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Go to Guidebook
        </Link>
      </div>
    </div>
  );
}