// src/pages/Contact.jsx
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    // validasi super sederhana
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', text: 'Lengkapi semua field dulu ya.' });
      return;
    }

    // TODO: ganti dengan API kirim pesan kamu sendiri
    console.log('Contact form:', form);

    setStatus({ type: 'success', text: 'Pesan terkirim (dummy). Ganti dengan API kamu.' });
    setForm({ name: '', email: '', message: '' });
    e.target.reset();
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white text-green-800">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-2">Kontak</h1>
        <p className="mb-8 opacity-80">
          Ada pertanyaan? Tinggalkan pesan lewat form di bawah.
        </p>

        {/* info cepat */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="p-4 rounded-xl border">
            <div className="text-sm opacity-70">Email</div>
            <div className="font-medium">you@example.com</div>
          </div>
          <div className="p-4 rounded-xl border">
            <div className="text-sm opacity-70">WhatsApp</div>
            <div className="font-medium">+62 812-3456-7890</div>
          </div>
        </div>

        {/* form kontak */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nama</label>
            <input
              name="name"
              onChange={onChange}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nama kamu"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={onChange}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="email@contoh.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Pesan</label>
            <textarea
              name="message"
              rows="5"
              onChange={onChange}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Tulis pesanmu di sini..."
            />
          </div>

          <button
            type="submit"
            className="rounded-lg px-4 py-2 bg-green-600 text-white hover:bg-green-700"
          >
            Kirim
          </button>

          {status && (
            <p
              className={
                status.type === 'success' ? 'text-green-600 pt-2' : 'text-red-600 pt-2'
              }
            >
              {status.text}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
