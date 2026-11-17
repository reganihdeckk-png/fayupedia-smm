export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  balance: number;
  avatar_url?: string;
  google_id?: string;
  created_at?: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  type: string;
  category: string;
  price: number; // Price per 1000 in IDR
  min: number;
  max: number;
  refill: number; // 1 = yes, 0 = no
  description: string;
}

export interface Order {
  id: string;
  user_id: string;
  user_email?: string;
  provider_order_id?: string | number;
  service_id: number;
  service_name: string;
  category: string;
  target: string;
  quantity: number;
  price: number;
  charge: number;
  status: 'pending' | 'processing' | 'completed' | 'canceled' | 'partial';
  start_count?: number;
  remains?: number;
  can_refill: number;
  refill_id?: string;
  refill_status?: string;
  created_at: string;
  updated_at?: string;
}

export interface Deposit {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  amount: number;
  payment_method: string;
  payment_code?: string;
  proof_url?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  sender_name: string;
  sender_role: 'user' | 'cs' | 'admin';
  message: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  channel_url: string;
  active: boolean;
  created_at: string;
}
