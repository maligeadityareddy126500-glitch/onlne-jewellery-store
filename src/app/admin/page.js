'use client';
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function Admin() {
  const { user, token } = useAppContext();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', imageUrl: '', category: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/');
    } else {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if(Array.isArray(data)) setProducts(data);
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if(Array.isArray(data)) setOrders(data);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newProduct, price: parseFloat(newProduct.price) })
      });
      if (res.ok) {
        setNewProduct({ name: '', description: '', price: '', imageUrl: '', category: '' });
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') return <div className="container">Unauthorized...</div>;

  return (
    <div className="container fade-in">
      <h1 style={{ marginBottom: '2rem', color: 'var(--accent)' }}>Admin Portal</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
        <div>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required rows={3}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input type="number" step="0.01" className="form-input" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="url" className="form-input" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} required placeholder="https://unsplash.com/..." />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input type="text" className="form-input" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required placeholder="Ring, Necklace..." />
              </div>
              <button type="submit" className="premium-btn" style={{ width: '100%' }}>Add Product</button>
            </form>
          </div>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Recent Orders</h3>
          {orders.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No orders yet.</p> : (
            orders.map(order => (
              <div key={order._id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <strong>Order ID: {order._id}</strong>
                  <span style={{ color: 'var(--accent)' }}>Status: {order.status}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <p>Customer: {order.user?.name} ({order.user?.email})</p>
                  <p>Address: {order.shippingAddress}</p>
                  <p>Total: ₹{order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <strong>Items:</strong>
                  <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '0.5rem' }}>
                    {order.items?.map((item, idx) => (
                      <li key={idx} style={{ color: 'var(--text-secondary)' }}>
                        {item.quantity}x {item.product?.name || 'Unknown Product'} - ₹{(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
          
          <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Inventory Overview</h3>
          {products.map(product => (
            <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span>{product.name}</span>
              <span style={{ color: 'var(--accent)' }}>₹{product.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
