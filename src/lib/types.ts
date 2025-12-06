export interface Booking {
  id: string;
  username: string;
  phone: string;
  email: string;
  booking_date: string;
  start_time: string;
  duration: number;
  ground_size: 'full' | 'half';
  night_mode: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  amount: number;
  status: 'created' | 'success' | 'failed';
  created_at: string;
}
