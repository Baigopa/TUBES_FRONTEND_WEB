const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Baca dari .env
const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

console.log('Loaded env:', {
  LARAVEL_API_URL,
  AUTH_MODE: process.env.AUTH_MODE,
  SUPABASE_URL: !!process.env.SUPABASE_URL
});

// Data dummy untuk testing (ketika Laravel API tidak accessible)
const dummyUsers = [
  { id: 1, email: 'hisyam@umm.id', password: '123456', role: 'user', name: 'Hisyam' },
  { id: 2, email: 'admin@umm.id', password: 'admin123', role: 'admin', name: 'Admin' },
  { id: 3, email: 'test@example.com', password: 'secret', role: 'user', name: 'Test User' }
];

// Dummy products
const dummyProducts = [
  { id: 1, name: 'Biji Kopi Arabika', description: 'Kopi Arabika dengan rasa buah dan sedikit asam', price: 85000, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxhYjWioQIFgpISl751vjHT78adpHmiUp7JVAJYFjAKNGAZFpSda7zF8u_o447m9dyGIToG3AtOOtE9eqNs2IFgH9z7rZBtpQEUoHOTO7AmMGtpBQmlHLiVPbsGQFA9Yy5hdexy5d4EJ8_CT5zQ3UNojrTaJdDeyarnEXc1quPpiSKuMploG4sl-6ehqhn3RYQI5pNcGcZyupF_ZvK5uFD1sz8Uu5QpiQQwzEfy76jaP2webtpkmchn3Yb-4Za6viLPPWtVanwP4k' },
  { id: 2, name: 'Biji Kopi Robusta', description: 'Kopi Robusta dengan rasa pahit dan kuat', price: 65000, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6ZS8gWbWr4DyQ6qQRRZEp8tLe_tvPAhdtwClRdilGF0Fxiv--e_OZWACkec1I1mAT21QlEfRVi7zq-TTLQcHo8hFU_wEfa0iaJ27ZVdXlg_tQqXYxQwzMMC19BbR_FRcIoS2IoAR-n9-cPfIk0j9amWK1MpkdoCsHl243HuDnPd2EbtYhsv2ohOEwFLnI4pV_raEvDfi2oLtt1T8nRcvfYUMBQc8RFgdpxA5XVHC6lu3QzqW2nAxGu8Ulya5MOtZhh_qlVDMNdeA' },
  { id: 3, name: 'Biji Kopi Liberika', description: 'Kopi Liberika dengan aroma bunga dan rasa unik', price: 95000, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCasu0LZUVvmUxiQlinV2XPk5vCE6VfXTE0hibGOFhCGf4QWnyouHBLl6Y_6kAcJz8qriwRnBej4DfCgTBYL5UiK5o-yEcHu-sF5uEekRtDEHFO9v2cU2rB-dEJ4B36hVJdW9resCjbBH8LGRzFmBiSjCUI-Eg3buTRq2cjRUZPicfDhzg47S3JSSJkM1F20QZeG3BemOuQnLuCM_YlPt3o2OCfMP6GW_NGNauaMlyGwLGJyRT7wA5l2yieG9OmbUQ2ZT_OtbD9AGg' },
  { id: 4, name: 'Biji Kopi Excelsa', description: 'Kopi Excelsa dengan rasa asam dan sedikit manis', price: 90000, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB75KL6GGGUyHjRi7lUNgseVZjAnKT-a9H77Kwms_2wUXzk7cQ1hrsxJ6Y3PffW9170kQSNFep3zRsjaAG22wCgzXaidEmAas4PPV7YuW0HbNVBEKqAifhCsSiFog65TN9umdQBad8tDp-QbOF1vzjRaNA9jqCzrVIACfLXxk11YZqLZfcJrhZSU-TCKenXGYEdJpLkFVRL9xfIrzFpKo_ir_TJUclekS_roPwzxrMG6ivyNqxHknllbXusc1xKGCS-TFyCH9bKxFc' },
  { id: 5, name: 'Biji Kopi Blend', description: 'Campuran biji kopi dengan berbagai rasa', price: 75000, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPeduNz9W5HSzwkfoz-xA4PyU8WAolZD1qdVJ5HREBs5Y44v8mhwbTJsYiLYiQAU-WWDJhDePqay2DQT2p6NR7T1KazeVHh5O6KuYqctjkiN80rIRi24SRoms8qBnBoO_hwL63kfpcNNYZExa2HKLc_HnBSPDZ-vYja6WuSwNbQAoKo_2ThMqhmJf_puDMTZm9EGakRwWl_teHh5iD7orLQhXhIvpCEARIS65ZxwQFUIi1m06D4qOJUKymuQLB4h6TYe7jtA3K_So' }
];

// Login endpoint - coba Laravel API dulu, kalau gagal pakai dummy
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};

  try {
    // Coba Laravel API
    const response = await axios.post(`${LARAVEL_API_URL}/login`, { email, password }, { timeout: 5000 });
    return res.json(response.data);
  } catch (laravel_error) {
    console.log('Laravel API tidak accessible, menggunakan dummy data...');
    
    // Fallback ke dummy data
    const user = dummyUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      return res.json({ 
        token: `dummy-token-${user.id}`, 
        user: { 
          id: user.id,
          email: user.email, 
          name: user.name,
          role: user.role 
        } 
      });
    }

    return res.status(401).json({ message: 'Email atau password salah' });
  }
});

// Products endpoint
app.get('/api/products', async (req, res) => {
  try {
    // Coba Laravel API dulu
    const response = await axios.get(`${LARAVEL_API_URL}/products`, { timeout: 5000 });
    return res.json(response.data);
  } catch (laravel_error) {
    console.log('Laravel API tidak accessible, menggunakan dummy products...');
    // Fallback ke dummy data
    return res.json({ 
      data: dummyProducts,
      message: 'Using dummy data'
    });
  }
});

// Profile endpoint
app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Coba Laravel API dulu
    const response = await axios.get(`${LARAVEL_API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
      timeout: 5000
    });
    return res.json(response.data);
  } catch (laravel_error) {
    console.log('Laravel API tidak accessible, menggunakan dummy profile...');
    // Fallback ke dummy data
    return res.json({ 
      data: {
        id: 1,
        name: 'Hisyam',
        email: 'hisyam@umm.id',
        phone: '08123456789',
        birth_date: '2000-01-01',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBObuYeumA7R4RwRqg0RuhuW9rkJ7xTq9DhCQhxnCu-6hCwSbjFH_cQbDYG72hIAqVy75yx4PHtLlo1o3SDrnTSZR7CiWZkEuvzhEF6vdcEKwf7xfeU19QppJEXhxHHv8azmy1UOHRwnqNONMQN5-YRpu0JOnrw6cJGW_a2tuOqY9frS0a2bn9NOM_vj0vf5aEjxEYj_J4fRkdWW3ntikqGzA-5F63JsW5Vy2JTFuaGj-mnrJqNcfNjtew1CmQwcolVkWbmrD_iWCk'
      }
    });
  }
});

// Endpoint untuk kirim config ke frontend (membaca dari .env)
app.get('/config', (req, res) => {
  console.log('✓ /config endpoint dipanggil');
  res.json({ 
    LARAVEL_API_URL: LARAVEL_API_URL
  });
});

// Endpoint untuk cek config (debug)
app.get('/api/config', (req, res) => {
  res.json({ 
    env: process.env.NODE_ENV || 'development', 
    laravel_api: LARAVEL_API_URL,
    auth_mode: process.env.AUTH_MODE,
    dummy_users: dummyUsers.map(u => ({ email: u.email, password: u.password, role: u.role })),
    products_count: dummyProducts.length
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`\nDummy credentials untuk testing:`);
  dummyUsers.forEach(u => console.log(`  - ${u.email} / ${u.password} (role: ${u.role})`));
});
