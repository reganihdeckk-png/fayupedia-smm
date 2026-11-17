import { ServiceItem } from '../types';

// Default / fallback services catalog matching Fayupedia SMM standards
export const DEFAULT_SERVICES: ServiceItem[] = [
  // Instagram
  {
    id: 101,
    name: "Instagram Followers Real Indonesia [Aktif & Bergaransi 30 Hari]",
    type: "default",
    category: "Instagram Followers",
    price: 45000,
    min: 100,
    max: 50000,
    refill: 1,
    description: "Followers akun asli Indonesia, aktif, profil lengkap. Drop rate sangat rendah. Bergaransi isi ulang (Refill) otomatis selama 30 hari. Masukkan username tanpa tanda @"
  },
  {
    id: 102,
    name: "Instagram Followers Global HQ [Proses Kilat 1-5 Menit]",
    type: "default",
    category: "Instagram Followers",
    price: 18500,
    min: 50,
    max: 100000,
    refill: 1,
    description: "Followers worldwide kualitas tinggi dengan foto profil & bio. Kecepatan hingga 20k/hari. Garansi refill 30 hari."
  },
  {
    id: 103,
    name: "Instagram Likes Indonesia [High Quality Super Cepat]",
    type: "default",
    category: "Instagram Likes",
    price: 12000,
    min: 50,
    max: 20000,
    refill: 0,
    description: "Likes postingan / reels dari akun Indonesia. Masuk seketika setelah dipesan. Masukkan URL postingan lengkap."
  },
  {
    id: 104,
    name: "Instagram Likes Worldwide [Murah & Instan]",
    type: "default",
    category: "Instagram Likes",
    price: 4500,
    min: 20,
    max: 50000,
    refill: 0,
    description: "Likes internasional termurah dan stabil. Masukkan link postingan."
  },
  {
    id: 105,
    name: "Instagram Reels Views + Reach & Impressions [Organik Algo Booster]",
    type: "default",
    category: "Instagram Views",
    price: 2500,
    min: 100,
    max: 500000,
    refill: 0,
    description: "Meningkatkan views reels secara eksponensial membantu masuk Explore Instagram. Masukkan link video Reels."
  },

  // TikTok
  {
    id: 201,
    name: "TikTok Followers Indonesia [Real Human Akun Asli]",
    type: "default",
    category: "TikTok Followers",
    price: 65000,
    min: 100,
    max: 20000,
    refill: 1,
    description: "Followers TikTok asli dari Indonesia. Bagus untuk syarat akun Live Streaming TikTok (min 1000 followers). Garansi 30 hari."
  },
  {
    id: 202,
    name: "TikTok Followers Worldwide HQ [Instant Speed]",
    type: "default",
    category: "TikTok Followers",
    price: 28000,
    min: 100,
    max: 100000,
    refill: 1,
    description: "Followers TikTok global kualitas HQ. Masukkan link profil TikTok."
  },
  {
    id: 203,
    name: "TikTok Likes Video [Real Speed 10K/Day]",
    type: "default",
    category: "TikTok Likes",
    price: 9500,
    min: 50,
    max: 50000,
    refill: 0,
    description: "Likes TikTok cepat dan aman. Masukkan link video TikTok."
  },
  {
    id: 204,
    name: "TikTok FYP Views Super Fast [1 Juta Views Ready]",
    type: "default",
    category: "TikTok Views",
    price: 800,
    min: 1000,
    max: 5000000,
    refill: 0,
    description: "Booster views TikTok kilat! Membantu video tembus algoritma For You Page (FYP). Masukkan link video."
  },
  {
    id: 205,
    name: "TikTok Saves & Shares [Rekomendasi FYP Booster]",
    type: "default",
    category: "TikTok Shares",
    price: 3500,
    min: 100,
    max: 50000,
    refill: 0,
    description: "Simpan & bagikan video TikTok untuk mendongkrak engagement score."
  },

  // YouTube
  {
    id: 301,
    name: "YouTube Subscribers [Non-Drop Garansi 60 Hari - Aman Monetisasi]",
    type: "default",
    category: "YouTube Subscribers",
    price: 185000,
    min: 50,
    max: 10000,
    refill: 1,
    description: "Subscribers kualitas premium, stabil, aman untuk syarat monetisasi Adsense channel YouTube. Masukkan link channel lengkap."
  },
  {
    id: 302,
    name: "YouTube Views High Retention [Tontonan Lama + Real Algo]",
    type: "default",
    category: "YouTube Views",
    price: 32000,
    min: 500,
    max: 200000,
    refill: 1,
    description: "Views dengan retensi penonton tinggi (high watchtime), aman dan direkomendasikan sistem YouTube."
  },
  {
    id: 303,
    name: "YouTube Jam Tayang (Watchtime 4000 Jam) Paket Monetesasi",
    type: "package",
    category: "YouTube Watchtime",
    price: 380000,
    min: 1000,
    max: 4000,
    refill: 1,
    description: "Layanan jam tayang khusus video berdurasi minimal 15-60 menit untuk mengejar target 4.000 jam tayang Adsense."
  },

  // Telegram & Lainnya
  {
    id: 401,
    name: "Telegram Channel / Group Members [Zero Drop 90 Days]",
    type: "default",
    category: "Telegram Members",
    price: 24000,
    min: 100,
    max: 50000,
    refill: 1,
    description: "Anggota saluran dan grup Telegram, tidak mudah drop. Masukkan link channel publik (t.me/username)."
  },
  {
    id: 501,
    name: "Facebook Fanspage Likes + Followers [Indonesia HQ]",
    type: "default",
    category: "Facebook",
    price: 52000,
    min: 100,
    max: 20000,
    refill: 1,
    description: "Meningkatkan likes halaman FB sekaligus followers profil bisnis Anda."
  },
  {
    id: 601,
    name: "Twitter / X Followers Real HQ [Instant Refill 30 Hari]",
    type: "default",
    category: "Twitter / X",
    price: 78000,
    min: 100,
    max: 15000,
    refill: 1,
    description: "Followers akun Twitter / X dengan avatar dan tweet aktif."
  },
  {
    id: 701,
    name: "Spotify Track Plays / Streams [Royalty Eligible USA/Global]",
    type: "default",
    category: "Spotify Streams",
    price: 19000,
    min: 1000,
    max: 100000,
    refill: 1,
    description: "Plays lagu Spotify dari pendengar premium global, aman untuk artis dan rilisan baru."
  }
];

export function calculateOrderPrice(pricePerThousand: number, quantity: number): number {
  if (!quantity || quantity <= 0) return 0;
  return Math.ceil((pricePerThousand / 1000) * quantity);
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}
