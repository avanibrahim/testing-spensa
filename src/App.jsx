import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar'; // navbar tunggal di atas
import ErrorBoundary from './ErrorBoundary.jsx';

import Home from '@/pages/Home';
import Contact from '@/pages/Contact';
import IrigasiTetes from '@/pages/IrigasiTetes';
import Hidroponik from '@/pages/Hidroponik';
import BerandaIrigasi from '@/pages/BerandaIrigasi';
import Monitoring from '@/pages/Monitoring';
import NotificationGate from '@/components/NotificationGate';

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Navbar />
        <NotificationGate />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/irigasitetes" element={<IrigasiTetes />} />
          <Route path="/hidroponik" element={<Hidroponik />} />
          <Route path="/berandairigasi" element={<BerandaIrigasi />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}
