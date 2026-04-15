import { AppProvider } from '@/context/AppContext';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Lumière - Premium Jewelry',
  description: 'A full-stack premium jewelry store built with Next.js and MongoDB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navbar />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
