import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Thermometer, 
  Droplets, 
  Wifi, 
  Smartphone, 
  BarChart3, 
  Shield,
  ArrowRight,
  Leaf,
  Cpu,
  Droplet,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Home = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: Thermometer,
      title: 'Monitoring Suhu',
      description: 'Pantau suhu lingkungan secara real-time dengan sensor DHT22 yang akurat'
    },
    {
      icon: Droplets,
      title: 'Kelembaban Udara',
      description: 'Kontrol kelembaban optimal untuk pertumbuhan tanaman hidroponik'
    },
    {
      icon: Wifi,
      title: 'Konektivitas IoT',
      description: 'Terhubung melalui ESP32 dengan koneksi WiFi yang stabil'
    },
    {
      icon: BarChart3,
      title: 'Data Logger',
      description: 'Simpan dan analisis data historis untuk optimasi pertanian'
    },
    {
      icon: Smartphone,
      title: 'Akses Mobile',
      description: 'Interface responsif yang dapat diakses dari berbagai perangkat'
    },
    {
      icon: Shield,
      title: 'Sistem Reliable',
      description: 'Monitoring 24/7 dengan sistem yang handal dan terpercaya'
    }
  ];

  const stats = [
    { number: '24/7', label: 'Monitoring' },
    { number: '±0.5°C', label: 'Akurasi Suhu' },
    { number: '±2%', label: 'Akurasi Kelembaban' },
    { number: '1s', label: 'Update Rate' }
  ];

  return (
    <>
    <header>
      <Navbar />
    </header>
      <Helmet>
        <title>HidroponikIoT - Sistem Monitoring Pertanian Hidroponik Berbasis IoT</title>
        <meta name="description" content="Sistem monitoring profesional untuk pertanian hidroponik dengan sensor DHT22 dan mikrokontroler ESP32. Pantau suhu dan kelembaban secara real-time." />
      </Helmet>

      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden nature-pattern">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 to-blue-50/80"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="p-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-2xl"
                >
                  <Leaf className="h-16 w-16 text-white" />
                </motion.div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">
                Sistem Monitoring
                <span className="block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 roundedblock gradient-bg bg-clip-text text-transparent">
                  Smart Farming 
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Pantau suhu dan kelembaban tanaman hidroponik Anda secara real-time dengan 
                teknologi sensor DHT22 dan mikrokontroler YD-ESP32-23
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/hidroponik">
                  <Button size="lg" className="gradient-bg text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    Mulai Monitoring
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 border-green-500 text-green-700 hover:bg-green-50">
                    Hubungi Kami
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 floating">
            <div className="p-3 bg-green-100 rounded-full shadow-lg">
              <Thermometer className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="absolute top-40 right-20 floating" style={{ animationDelay: '1s' }}>
            <div className="p-3 bg-blue-100 rounded-full shadow-lg">
              <Droplets className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="absolute bottom-40 left-20 floating" style={{ animationDelay: '2s' }}>
            <div className="p-3 bg-purple-100 rounded-full shadow-lg">
              <Wifi className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold gradient-bg bg-clip-text text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Teknologi IoT Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Teknologi IoT Terdepan
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Menggunakan sensor DHT22 yang presisi dan mikrokontroler YD-ESP32-23 
                  untuk konektivitas yang handal dan monitoring yang akurat.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Waves className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">YF-S201</h3>
                      <p className="text-gray-600">Akurasi tinggi untuk penggunaan air</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Thermometer className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">DS18B20</h3>
                      <p className="text-gray-600">Akurasi tinggi untuk suhu pada air</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Droplet className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">PH Meter</h3>
                      <p className="text-gray-600">Sensor pH untuk mengukur tingkat keasaman dan kebasaan larutan</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Cpu className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">YD-ESP32</h3>
                      <p className="text-gray-600">Mikrokontroler dengan WiFi terintegrasi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Real-time Dashboard</h3>
                      <p className="text-gray-600">Interface modern untuk monitoring data</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative z-10">
                  <img  
                    alt="Sistem hidroponik IoT dengan sensor dan monitoring"
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                   src="https://images.unsplash.com/photo-1614846027182-cecfee3a427b" />
                </div>
                <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-green-400 to-blue-400 rounded-2xl -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Fitur Unggulan
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Teknologi canggih untuk monitoring pertanian hidroponik yang efisien dan akurat
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="glass-effect p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="p-4 bg-green-500 rounded-xl w-fit mb-6">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ikuti Kami + Foto Kegiatan */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Lokasi Kami */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center lg:text-left">Lokasi Kami</h2>
                <p className="text-lg text-gray-600 mb-6 text-center lg:text-left">
                  Jl. Jaksa Agung Suprapto No.1, Limba U Dua, Kota Sel., Kota Gorontalo, Gorontalo 96138
                </p>
                <div className="w-full h-[350px] rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    title="Lokasi Hidroponik"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127523.08935559715!2d123.0524029!3d0.5499599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32792b3fc27a3a19%3A0x3ae10c5b4c8084dd!2sSMP%20Negeri%201%20Gorontalo!5e0!3m2!1sid!2sid!4v1721066495102!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="text-center lg:text-left mt-4">
                  <a 
                    href="https://www.google.com/maps/place/SMP+Negeri+1+Gorontalo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-green-600 hover:underline font-semibold"
                  >
                    Lihat di Google Maps
                  </a>
                </div>
              </motion.div>

              {/* Ikuti Kami */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center lg:text-left"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ikuti Kami</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Terhubung di sosial media untuk update teknologi, tutorial, dan tips bertani hidroponik.
                </p>

                {/* Social Icons */}
                <div className="flex justify-center lg:justify-start items-center space-x-6 mb-10">
                  <a href="https://facebook.com" className="text-blue-600 hover:text-blue-800">
                    <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.2 3-3.2.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0022 12z" /></svg>
                  </a>
                  <a href="https://instagram.com" className="text-pink-500 hover:text-pink-700">
                    <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24"><path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.8a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" /></svg>
                  </a>
                  <a href="https://youtube.com" className="text-red-600 hover:text-red-800">
                    <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24"><path d="M10 15l5.2-3L10 9v6zm12-3c0-2-.2-3.3-.4-4.2-.2-.8-.8-1.5-1.6-1.6C18.3 6 12 6 12 6s-6.3 0-8 .2c-.8.1-1.4.8-1.6 1.6C2.2 8.7 2 10 2 12s.2 3.3.4 4.2c.2.8.8 1.5 1.6 1.6 1.7.2 8 .2 8 .2s6.3 0 8-.2c.8-.1 1.4-.8 1.6-1.6.2-.9.4-2.2.4-4.2z" /></svg>
                  </a>
                </div>

                {/* Foto Kegiatan */}
                <section className="mt-10">
                  <h2 className="text-2xl font-semibold mb-4">Dokumentasi Kegiatan</h2>
                  <div className="overflow-hidden relative w-full h-48 rounded-xl shadow-lg bg-gray-100">
                    <div
                      className="flex gap-4 absolute"
                      style={{
                        animation: 'scroll-left 35s linear infinite'
                      }}
                    >
                      <img
                        src="/images/kegiatan-1.jpg"
                        alt="Kegiatan 1"
                        className="w-64 h-48 object-cover rounded-lg"
                      />
                      <img
                        src="/images/kegiatan-2.jpg"
                        alt="Kegiatan 2"
                        className="w-64 h-48 object-cover rounded-lg"
                      />
                      <img
                        src="/images/kegiatan-3.jpg"
                        alt="Kegiatan 3"
                        className="w-64 h-48 object-cover rounded-lg"
                      />
                      {/* Duplikasi untuk looping */}
                      <img
                        src="/images/kegiatan-1.jpg"
                        alt="Kegiatan 1"
                        className="w-64 h-48 object-cover rounded-lg"
                      />
                      <img
                        src="/images/kegiatan-2.jpg"
                        alt="Kegiatan 2"
                        className="w-64 h-48 object-cover rounded-lg"
                      />
                      <img
                        src="/images/kegiatan-3.jpg"
                        alt="Kegiatan 3"
                        className="w-64 h-48 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </section>


              </motion.div>
            </div>
          </div>
        </section>

      </div>
      
              {/* Scroll To Top */}
              {showButton && (
                <button
                  onClick={scrollToTop}
                  className="fixed bottom-5 right-5 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
                >
                  ↑
                </button>
              )}
              <footer className="bg-green-100 text-center py-6 mt-10 border-t border-green-300">
          <p className="text-sm text-green-800">
            &copy; {new Date().getFullYear()} Sistem Monitoring Irigasi Tetes Cabai. itelVore
          </p>
          <p className="text-xs text-green-600 mt-1">
            Dibuat dengan 💧 dan semangat bertani cerdas.
          </p>
        </footer>

    </>
  );
};

export default Home;
