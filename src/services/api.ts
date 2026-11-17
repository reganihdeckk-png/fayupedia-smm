import { User, Order, Deposit, ChatMessage, ServiceItem, Announcement } from '../types';
import { DEFAULT_SERVICES, calculateOrderPrice } from './fayupedia';

const STORAGE_KEYS = {
  USER: 'smm_user_session',
  USERS_DB: 'smm_d1_users',
  ORDERS_DB: 'smm_d1_orders',
  DEPOSITS_DB: 'smm_d1_deposits',
  CHAT_DB: 'smm_d1_chat',
};

// Initial admin & demo user
const SEED_USERS: User[] = [
  {
    id: 'user_admin_01',
    name: 'Administrator Fayupedia',
    email: 'admin@fayupedia.id',
    role: 'admin',
    balance: 5000000,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'user_demo_01',
    name: 'Pengguna VIP',
    email: 'user@fayupedia.id',
    role: 'user',
    balance: 250000,
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  }
];

const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-98210',
    user_id: 'user_demo_01',
    service_id: 101,
    service_name: 'Instagram Followers Real Indonesia [Aktif & Bergaransi 30 Hari]',
    category: 'Instagram Followers',
    target: 'fayupedia_id',
    quantity: 1000,
    price: 45000,
    charge: 45000,
    status: 'completed',
    start_count: 120,
    remains: 0,
    can_refill: 1,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'ORD-98211',
    user_id: 'user_demo_01',
    service_id: 201,
    service_name: 'TikTok Followers Indonesia [Real Human Akun Asli]',
    category: 'TikTok Followers',
    target: 'tiktok_creative',
    quantity: 500,
    price: 65000,
    charge: 32500,
    status: 'processing',
    start_count: 450,
    remains: 210,
    can_refill: 1,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'ORD-98212',
    user_id: 'user_demo_01',
    service_id: 103,
    service_name: 'Instagram Likes Indonesia [High Quality Super Cepat]',
    category: 'Instagram Likes',
    target: 'https://instagram.com/p/C8yZ123',
    quantity: 300,
    price: 12000,
    charge: 3600,
    status: 'pending',
    start_count: 0,
    remains: 300,
    can_refill: 0,
    created_at: new Date(Date.now() - 1800000).toISOString()
  }
];

const SEED_DEPOSITS: Deposit[] = [
  {
    id: 'DEP-77312',
    user_id: 'user_demo_01',
    user_name: 'Pengguna VIP',
    user_email: 'user@fayupedia.id',
    amount: 100000,
    payment_method: 'QRIS',
    payment_code: 'QRIS-100482',
    notes: 'Topup Saldo Otomatis QRIS',
    status: 'approved',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'DEP-77313',
    user_id: 'user_demo_01',
    user_name: 'Pengguna VIP',
    user_email: 'user@fayupedia.id',
    amount: 150000,
    payment_method: 'BCA Transfer',
    payment_code: 'BCA-150291',
    notes: 'Transfer manual BCA',
    status: 'approved',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

const SEED_CHATS: ChatMessage[] = [
  {
    id: 'chat-1',
    user_id: 'user_demo_01',
    sender_name: 'Customer Support Fayupedia',
    sender_role: 'cs',
    message: 'Halo! Selamat datang di layanan Live Chat Fayupedia SMM. Ada yang bisa kami bantu seputar pesanan atau deposit?',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// Helper to get from local fallback store
function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Failed to write local cache', e);
  }
}

// API Service Client
export const api = {
  // Check backend server connection
  async testBackend(): Promise<boolean> {
    try {
      const res = await fetch('/api/announcements', { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth: Current logged in user
  getCurrentUser(): User | null {
    return getLocal<User | null>(STORAGE_KEYS.USER, null);
  },

  setCurrentUser(user: User | null): void {
    setLocal(STORAGE_KEYS.USER, user);
  },

  // Auth: Register
  async register(data: { name: string; email: string; password?: string; avatar_url?: string }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.setCurrentUser(json.user);
          return { success: true, user: json.user };
        }
        return { success: false, error: json.error || 'Pendaftaran gagal' };
      }
    } catch {}

    // Fallback local engine
    const users = getLocal<User[]>(STORAGE_KEYS.USERS_DB, SEED_USERS);
    const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'Email sudah terdaftar. Silakan login.' };
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: data.name,
      email: data.email,
      role: 'user',
      balance: 10000, // Bonus saldo pendaftaran awal Rp 10.000!
      avatar_url: data.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    setLocal(STORAGE_KEYS.USERS_DB, users);
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  // Auth: Login
  async login(data: { email: string; password?: string }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.setCurrentUser(json.user);
          return { success: true, user: json.user };
        }
        return { success: false, error: json.error || 'Email atau password salah' };
      }
    } catch {}

    // Fallback local engine
    const users = getLocal<User[]>(STORAGE_KEYS.USERS_DB, SEED_USERS);
    const user = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (!user) {
      // Auto-create or reject
      return { success: false, error: 'Akun tidak ditemukan. Silakan lakukan pendaftaran terlebih dahulu.' };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  },

  // Auth: Google Sign-in simulation & OAuth
  async loginWithGoogle(googleData?: { email: string; name: string; avatar?: string }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData || {})
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.setCurrentUser(json.user);
          return { success: true, user: json.user };
        }
      }
    } catch {}

    // Fallback Google auth
    const email = googleData?.email || 'google.user@gmail.com';
    const name = googleData?.name || 'Google User';
    const avatar = googleData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const users = getLocal<User[]>(STORAGE_KEYS.USERS_DB, SEED_USERS);
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
        name,
        email,
        role: 'user',
        balance: 15000, // Bonus Rp 15.000 untuk Google Sign In
        avatar_url: avatar,
        google_id: 'goog_' + Date.now(),
        created_at: new Date().toISOString()
      };
      users.push(user);
      setLocal(STORAGE_KEYS.USERS_DB, users);
    }

    this.setCurrentUser(user);
    return { success: true, user };
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Profile update
  async updateProfile(updates: Partial<User> & { currentPassword?: string; newPassword?: string }): Promise<{ success: boolean; user?: User; error?: string }> {
    const cur = this.getCurrentUser();
    if (!cur) return { success: false, error: 'Sesi berakhir' };

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cur.id, ...updates })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.setCurrentUser(json.user);
          return { success: true, user: json.user };
        }
      }
    } catch {}

    const users = getLocal<User[]>(STORAGE_KEYS.USERS_DB, SEED_USERS);
    const idx = users.findIndex(u => u.id === cur.id);
    const updated: User = {
      ...cur,
      name: updates.name || cur.name,
      avatar_url: updates.avatar_url || cur.avatar_url,
    };

    if (idx !== -1) {
      users[idx] = updated;
      setLocal(STORAGE_KEYS.USERS_DB, users);
    }
    this.setCurrentUser(updated);
    return { success: true, user: updated };
  },

  // Services
  async getServices(): Promise<ServiceItem[]> {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const json = await res.json();
        if (json.services && Array.isArray(json.services) && json.services.length > 0) {
          return json.services;
        }
      }
    } catch {}
    return DEFAULT_SERVICES;
  },

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const res = await fetch(`/api/orders?userId=${userId || ''}`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.orders)) return json.orders;
      }
    } catch {}

    const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS_DB, SEED_ORDERS);
    if (!userId) return orders;
    return orders.filter(o => o.user_id === userId);
  },

  async createOrder(data: { serviceId: number; target: string; quantity: number }): Promise<{ success: boolean; order?: Order; error?: string }> {
    const cur = this.getCurrentUser();
    if (!cur) return { success: false, error: 'Silakan login terlebih dahulu' };

    const services = await this.getServices();
    const service = services.find(s => s.id === data.serviceId);
    if (!service) return { success: false, error: 'Layanan tidak valid' };

    if (data.quantity < service.min) return { success: false, error: `Jumlah minimal pesanan adalah ${service.min}` };
    if (data.quantity > service.max) return { success: false, error: `Jumlah maksimal pesanan adalah ${service.max}` };

    const charge = calculateOrderPrice(service.price, data.quantity);
    if (cur.balance < charge) {
      return { success: false, error: `Saldo Anda tidak mencukupi (Kurang Rp ${(charge - cur.balance).toLocaleString('id-ID')}). Silakan lakukan deposit terlebih dahulu.` };
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cur.id, ...data })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          // deduct user local balance
          cur.balance -= charge;
          this.setCurrentUser(cur);
          return { success: true, order: json.order };
        }
        return { success: false, error: json.error };
      }
    } catch {}

    // Local engine order creation
    const newOrder: Order = {
      id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      user_id: cur.id,
      user_email: cur.email,
      provider_order_id: 'FYP-' + Math.floor(1000 + Math.random() * 9000),
      service_id: service.id,
      service_name: service.name,
      category: service.category,
      target: data.target,
      quantity: data.quantity,
      price: service.price,
      charge,
      status: 'pending',
      start_count: 0,
      remains: data.quantity,
      can_refill: service.refill,
      created_at: new Date().toISOString()
    };

    const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS_DB, SEED_ORDERS);
    orders.unshift(newOrder);
    setLocal(STORAGE_KEYS.ORDERS_DB, orders);

    // Deduct user balance
    cur.balance -= charge;
    this.setCurrentUser(cur);

    // Update in users db
    const users = getLocal<User[]>(STORAGE_KEYS.USERS_DB, SEED_USERS);
    const uIdx = users.findIndex(u => u.id === cur.id);
    if (uIdx !== -1) {
      users[uIdx].balance = cur.balance;
      setLocal(STORAGE_KEYS.USERS_DB, users);
    }

    return { success: true, order: newOrder };
  },

  async checkOrderStatus(orderId: string): Promise<{ success: boolean; status?: string; remains?: number; error?: string }> {
    try {
      const res = await fetch(`/api/orders/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch {}

    // Fallback status simulation (cycles pending -> processing -> completed)
    const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS_DB, SEED_ORDERS);
    const order = orders.find(o => o.id === orderId);
    if (order) {
      if (order.status === 'pending') {
        order.status = 'processing';
        order.remains = Math.floor(order.quantity * 0.4);
      } else if (order.status === 'processing') {
        order.status = 'completed';
        order.remains = 0;
      }
      setLocal(STORAGE_KEYS.ORDERS_DB, orders);
      return { success: true, status: order.status, remains: order.remains };
    }
    return { success: false, error: 'Pesanan tidak ditemukan' };
  },

  async requestRefill(orderId: string): Promise<{ success: boolean; refillId?: string; error?: string }> {
    try {
      const res = await fetch(`/api/orders/refill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS_DB, SEED_ORDERS);
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, error: 'Pesanan tidak ditemukan' };
    if (!order.can_refill) return { success: false, error: 'Layanan ini tidak menyediakan garansi refill' };

    order.refill_id = 'REF-' + Math.floor(1000 + Math.random() * 9000);
    order.refill_status = 'processing';
    setLocal(STORAGE_KEYS.ORDERS_DB, orders);

    return { success: true, refillId: order.refill_id };
  },

  // Deposits
  async getDeposits(userId?: string): Promise<Deposit[]> {
    try {
      const res = await fetch(`/api/deposits?userId=${userId || ''}`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.deposits)) return json.deposits;
      }
    } catch {}

    const deposits = getLocal<Deposit[]>(STORAGE_KEYS.DEPOSITS_DB, SEED_DEPOSITS);
    if (!userId) return deposits;
    return deposits.filter(d => d.user_id === userId);
  },

  async createDeposit(data: { amount: number; paymentMethod: string; notes?: string }): Promise<{ success: boolean; deposit?: Deposit; error?: string }> {
    const cur = this.getCurrentUser();
    if (!cur) return { success: false, error: 'Silakan login terlebih dahulu' };

    if (data.amount < 10000) {
      return { success: false, error: 'Minimal deposit adalah Rp 10.000' };
    }

    try {
      const res = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cur.id, ...data })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { success: true, deposit: json.deposit };
      }
    } catch {}

    const randomCode = Math.floor(100 + Math.random() * 900);
    const totalWithCode = data.amount + randomCode;

    const newDep: Deposit = {
      id: 'DEP-' + Math.floor(10000 + Math.random() * 90000),
      user_id: cur.id,
      user_name: cur.name,
      user_email: cur.email,
      amount: totalWithCode,
      payment_method: data.paymentMethod,
      payment_code: `${data.paymentMethod.substring(0, 3).toUpperCase()}-${randomCode}`,
      notes: data.notes || `Deposit Saldo Fayupedia via ${data.paymentMethod}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const deposits = getLocal<Deposit[]>(STORAGE_KEYS.DEPOSITS_DB, SEED_DEPOSITS);
    deposits.unshift(newDep);
    setLocal(STORAGE_KEYS.DEPOSITS_DB, deposits);

    return { success: true, deposit: newDep };
  },

  async approveDeposit(depositId: string): Promise<{ success: boolean; error?: string }> {
    const deposits = getLocal<Deposit[]>(STORAGE_KEYS.DEPOSITS_DB, SEED_DEPOSITS);
    const dep = deposits.find(d => d.id === depositId);
    if (!dep) return { success: false, error: 'Deposit tidak ditemukan' };
    if (dep.status === 'approved') return { success: false, error: 'Deposit sudah disetujui sebelumnya' };

    dep.status = 'approved';
    setLocal(STORAGE_KEYS.DEPOSITS_DB, deposits);

    // Add balance to user
    const users = getLocal<User[]>(STORAGE_KEYS.USERS_DB, SEED_USERS);
    const user = users.find(u => u.id === dep.user_id);
    if (user) {
      user.balance += dep.amount;
      setLocal(STORAGE_KEYS.USERS_DB, users);

      const cur = this.getCurrentUser();
      if (cur && cur.id === user.id) {
        cur.balance = user.balance;
        this.setCurrentUser(cur);
      }
    }

    return { success: true };
  },

  // Live Chat
  async getChatMessages(): Promise<ChatMessage[]> {
    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.messages)) return json.messages;
      }
    } catch {}
    return getLocal<ChatMessage[]>(STORAGE_KEYS.CHAT_DB, SEED_CHATS);
  },

  async sendChatMessage(message: string): Promise<{ success: boolean; chat?: ChatMessage }> {
    const cur = this.getCurrentUser();
    const senderName = cur ? cur.name : 'Pengunjung Web';
    const userId = cur ? cur.id : 'guest_' + Math.random().toString(36).substring(2, 6);
    const senderRole = cur && cur.role === 'admin' ? 'admin' : 'user';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, senderName, senderRole, message })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return { success: true, chat: json.chat };
      }
    } catch {}

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      user_id: userId,
      sender_name: senderName,
      sender_role: senderRole,
      message,
      created_at: new Date().toISOString()
    };

    const chats = getLocal<ChatMessage[]>(STORAGE_KEYS.CHAT_DB, SEED_CHATS);
    chats.push(newMsg);
    setLocal(STORAGE_KEYS.CHAT_DB, chats);

    // Auto reply from CS after 1 second if from user
    if (senderRole === 'user') {
      setTimeout(() => {
        const replies = [
          'Terima kasih telah menghubungi Customer Service Fayupedia! Tim kami sedang memeriksa pertanyaan Anda.',
          'Halo! Anda juga bisa langsung terhubung ke WhatsApp CS kami di +628815722784 untuk respon prioritas 24 jam.',
          'Pesanan sedang diproses oleh server secara otomatis. Jangan lupa pastikan akun Anda tidak di-private ya!'
        ];
        const autoMsg: ChatMessage = {
          id: 'msg-cs-' + Date.now(),
          user_id: 'cs_agent',
          sender_name: 'Customer Service (+628815722784)',
          sender_role: 'cs',
          message: replies[Math.floor(Math.random() * replies.length)],
          created_at: new Date().toISOString()
        };
        const updated = getLocal<ChatMessage[]>(STORAGE_KEYS.CHAT_DB, SEED_CHATS);
        updated.push(autoMsg);
        setLocal(STORAGE_KEYS.CHAT_DB, updated);
      }, 1000);
    }

    return { success: true, chat: newMsg };
  },

  // Post-login mandatory announcement channel
  async getAnnouncement(): Promise<Announcement> {
    return {
      id: 'ann-1',
      title: 'Saluran Resmi Fayupedia SMM',
      content: 'PENTING: Seluruh informasi update layanan, perbaikan server, dan promo saldo bonus harian akan SELALU diinfokan di Saluran WhatsApp Resmi kami. Pastikan Anda telah bergabung sekarang!',
      channel_url: 'https://whatsapp.com/channel/0029VbE5A9VBPzjScJYKA50E',
      active: true,
      created_at: new Date().toISOString()
    };
  }
};
