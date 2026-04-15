import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="hero fade-in" style={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.9)), url("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop") center/cover',
        padding: '0 5%'
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '4px' }}>
          TIMELESS ELEGANCE
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
          Discover our exclusive collection of handcrafted jewelry, designed to illuminate your most precious moments.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/store" className="premium-btn">
            Explore Collection
          </Link>
        </div>
      </section>

      <section className="container fade-in" style={{ textAlign: 'center', margin: '4rem auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--accent)' }}>Our Promise</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ethical Sourcing</h3>
            <p style={{ color: 'var(--text-secondary)' }}>All our diamonds and gemstones are conflict-free and ethically sourced.</p>
          </div>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Master Craftsmanship</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Every piece is handcrafted by artisans with decades of experience.</p>
          </div>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Lifetime Warranty</h3>
            <p style={{ color: 'var(--text-secondary)' }}>We stand behind our quality with a comprehensive lifetime warranty.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
