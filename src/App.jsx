import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

import Home from '@/pages/Home';
import Contact from '@/pages/Contact';
import IrigasiTetes from '@/pages/IrigasiTetes';
import Hidroponik from '@/pages/Hidroponik';
import BerandaIrigasi from '@/pages/BerandaIrigasi';
import Monitoring from '@/pages/Monitoring'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-green-800">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monitoring" element={<Monitoring />} /> 
          <Route path="/monitoring/irigasitetes" element={<IrigasiTetes />} />
          <Route path="/monitoring/hidroponik" element={<Hidroponik />} />
          <Route path="/berandairigasi" element={<BerandaIrigasi />} /> 
          <Route path="/contact" element={<Contact />} /> 
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
