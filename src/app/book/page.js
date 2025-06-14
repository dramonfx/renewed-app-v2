import Link from 'next/link';

export default function BookPage() {
  return (
    <div style={{ 
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e40af', marginBottom: '1rem' }}>
          Renewed: The New Man Story
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#374151', maxWidth: '600px', margin: '0 auto' }}>
          Welcome to your interactive guidebook experience. Navigate through the sections using the sidebar,
          or begin your journey with the first section.
        </p>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link
          href="/book/prologue"
          style={{
            backgroundColor: '#eab308',
            color: '#1e40af',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            display: 'inline-block',
            fontWeight: 'bold',
            fontSize: '1.125rem'
          }}
        >
          Start with: Prologue
        </Link>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Alternatively, listen to the entire audiobook continuously.
        </p>
        <Link
          href="/full-audio-player"
          style={{
            color: '#2563eb',
            padding: '0.5rem 1.5rem',
            border: '2px solid #2563eb',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Go to Full Audiobook Player
        </Link>
      </div>
    </div>
  );
}