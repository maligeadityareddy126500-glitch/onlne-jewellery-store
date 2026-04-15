'use client';
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useAppContext();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>Loading our collection...</div>;
  }

  return (
    <div className="container fade-in">
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', letterSpacing: '2px' }}>OUR COLLECTION</h1>
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No jewelry found in the store. Admins need to add some!</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map(product => (
            <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                height: '250px', 
                background: `url(${product.imageUrl}) center/cover no-repeat`,
                borderBottom: '1px solid var(--border-color)'
              }}></div>
              <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flexGrow: 1 }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent)' }}>₹{product.price.toFixed(2)}</span>
                  <button onClick={() => addToCart(product)} className="secondary-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
