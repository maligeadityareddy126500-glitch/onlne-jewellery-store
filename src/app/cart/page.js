'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Cart() {
  const { cart, user, token, clearCart } = useAppContext();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    
    setLoading(true);
    try {
      const items = cart.map(item => ({ product: item.product._id, quantity: item.quantity, price: item.price }));
      const orderData = { items, totalAmount, shippingAddress: address };
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        setSuccess(true);
        clearCart();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container text-center" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Thank you for shopping at Lumière. Your order is being processed.</p>
        <Link href="/store" className="premium-btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <h1 style={{ marginBottom: '2rem' }}>Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '4rem 0' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your cart is empty.</p>
          <Link href="/store" className="premium-btn">Browse Collection</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '3rem' }}>
          <div>
            {cart.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ width: '80px', height: '80px', background: `url(${item.product.imageUrl}) center/cover`, borderRadius: '8px' }}></div>
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.product.name}</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>Qty: {item.quantity}</p>
                </div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent)' }}>
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            
            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label className="form-label">Shipping Address</label>
                <textarea 
                  className="form-input" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  required 
                  rows={3}
                  placeholder="Enter your full address..."
                ></textarea>
              </div>
              <button disabled={loading} type="submit" className="premium-btn" style={{ width: '100%' }}>
                {loading ? 'Processing...' : (user ? 'Checkout Now' : 'Login to Checkout')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
