-- Cloudflare D1 SQL Schema for SMM Panel
-- Database ID: 8854cd69-aa83-4b05-8c28-ac62e269eb00

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT DEFAULT 'user',
    balance INTEGER DEFAULT 0,
    avatar_url TEXT,
    google_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deposits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT,
    user_email TEXT,
    amount INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    payment_code TEXT,
    proof_url TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_email TEXT,
    provider_order_id TEXT,
    service_id INTEGER NOT NULL,
    service_name TEXT NOT NULL,
    category TEXT,
    target TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    charge INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, processing, completed, canceled, partial
    start_count INTEGER DEFAULT 0,
    remains INTEGER DEFAULT 0,
    can_refill INTEGER DEFAULT 0,
    refill_id TEXT,
    refill_status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL, -- user, cs, admin
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    channel_url TEXT DEFAULT 'https://whatsapp.com/channel/0029VbE5A9VBPzjScJYKA50E',
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed default announcement
INSERT OR IGNORE INTO system_announcements (id, title, content, channel_url, active)
VALUES (
    'announcement-1',
    'Saluran Resmi Fayupedia SMM',
    'Selamat datang di Fayupedia SMM! Dapatkan update layanan terbaru, promo saldo bonus harian, serta maintenance berkala langsung di Saluran WhatsApp Resmi kami.',
    'https://whatsapp.com/channel/0029VbE5A9VBPzjScJYKA50E',
    1
);
