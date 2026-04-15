'use client';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, cart, logout } = useAppContext();
  const pathname = usePathname();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo">
        LUMIÈRE
      </Link>
      <div className="nav-links">
        <Link href="/store" className={`nav-link ${pathname === '/store' ? 'active' : ''}`}>
          Store
        </Link>
        {user?.role === 'admin' && (
          <Link href="/admin" className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}>
            Admin Dashboard
          </Link>
        )}
        <Link href="/cart" className={`nav-link ${pathname === '/cart' ? 'active' : ''}`}>
          Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
        </Link>
        {user ? (
          <button onClick={logout} className="secondary-btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            Logout
          </button>
        ) : (
          <Link href="/login" className="premium-btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
