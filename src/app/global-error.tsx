'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Something went wrong!
      </h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', maxWidth: '600px' }}>
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#0051cc'}
        onMouseOut={(e) => e.currentTarget.style.background = '#0070f3'}
      >
        Try again
      </button>
    </div>
  )
}
