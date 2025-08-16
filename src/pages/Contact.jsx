
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Github, 
  Linkedin,
  MessageCircle,
  Clock,
  Users,
  Award,
  Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Pesan Terkirim!",
      description: "Terima kasih atas pesan Anda. Kami akan segera merespons.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@hidroponikiot.com',
      description: 'Kirim email untuk pertanyaan teknis'
    },
    {
      icon: Phone,
      title: 'Telepon',
      value: '+62 838-7106-9314 (WhatsApp)',
      description: 'Hubungi kami untuk konsultasi'
      
    },
    {
      icon: MapPin,
      title: 'Lokasi',
      value: 'gorontalo, Indonesia',
      description: 'Kantor pusat pengembangan'
    }
  ];

  const teamStats = [
    { icon: Users, number: '5+', label: 'Tim Developer' },
    { icon: Award, number: '3+', label: 'Tahun Pengalaman' },
    { icon: Clock, number: '24/7', label: 'Support' }
  ];

  return (
    <>
      <Helmet>
        <title>Kontak - HidroponikIoT</title>
        <meta name="description" content="Hubungi tim HidroponikIoT untuk konsultasi sistem monitoring hidroponik berbasis IoT. Kami siap membantu implementasi teknologi pertanian modern." />
      </Helmet>

      <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Hubungi Kami
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Punya pertanyaan tentang sistem hidroponik IoT? Tim ahli kami siap membantu 
              Anda mengimplementasikan teknologi pertanian modern.
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-effect p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-4 bg-green-500 rounded-xl w-fit mx-auto mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{info.title}</h3>
                  <p className="text-lg font-semibold text-green-600 mb-2">{info.value}</p>
                  <p className="text-gray-600">{info.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-effect p-8 rounded-2xl shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Kirim Pesan</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="nama@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Subjek pesan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full gradient-bg text-white py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Kirim Pesan
                </Button>
              </form>
            </motion.div>

            {/* Team Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              {/* Team Image */}
              <div className="glass-effect p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Tim Pengembang</h2>
                <div className="relative mb-6">
                  <img  
                    alt="Tim pengembang HidroponikIoT sedang bekerja dengan teknologi IoT"
                    className="w-full h-64 object-cover rounded-xl"
                   src="https://images.unsplash.com/photo-1690292884582-b434b00946a3" />
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Tim kami terdiri dari para ahli teknologi IoT, pertanian modern, dan 
                  pengembangan sistem yang berpengalaman dalam menciptakan solusi 
                  inovatif untuk pertanian hidroponik.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {teamStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      className="glass-effect p-6 rounded-xl shadow-lg text-center"
                    >
                      <div className="p-3 bg-green-500 rounded-lg w-fit mx-auto mb-3">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="glass-effect p-8 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Ikuti Kami</h3>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                    onClick={() => toast({
                      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
                    })}
                  >
                    <Linkedin className="h-5 w-5 text-blue-600" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-gray-300 hover:border-gray-800 hover:bg-gray-50"
                    onClick={() => toast({
                      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
                    })}
                  >
                    <Github className="h-5 w-5 text-gray-800" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-gray-300 hover:border-green-500 hover:bg-green-50"
                    onClick={() => toast({
                      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
                    })}
                  >
                    <Facebook className="h-5 w-5 text-green-600" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 glass-effect p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Pertanyaan Umum
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Bagaimana cara kerja sistem monitoring?
                </h3>
                <p className="text-gray-600 mb-4">
                  Sistem menggunakan sensor DHT22 yang terhubung ke mikrokontroler ESP32 
                  untuk mengukur suhu dan kelembaban secara real-time.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Apakah sistem dapat diakses dari jarak jauh?
                </h3>
                <p className="text-gray-600 mb-4">
                  Ya, sistem dapat diakses melalui web dashboard dari mana saja 
                  selama terhubung dengan internet.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Berapa akurasi sensor DHT22?
                </h3>
                <p className="text-gray-600 mb-4">
                  Sensor DHT22 memiliki akurasi ±0.5°C untuk suhu dan ±2% untuk 
                  kelembaban relatif.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Apakah data dapat diekspor?
                </h3>
                <p className="text-gray-600 mb-4">
                  Ya, data monitoring dapat diekspor dalam format CSV untuk 
                  analisis lebih lanjut.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;