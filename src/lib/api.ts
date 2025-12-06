// API client to replace Supabase
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Include cookies for session
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
    }
    const errorMessage = errorData.error || errorData.message || 'Request failed';
    const error = new Error(errorMessage);
    (error as any).code = errorData.code;
    throw error;
  }

  return response.json();
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
    return request('/auth/logout', {
      method: 'POST',
    });
  },

  async getSession() {
    return request('/auth/session');
  },

  // Bookings
  async getBookings() {
    return request('/bookings');
  },

  async searchBookings(phone?: string, email?: string) {
    const params = new URLSearchParams();
    if (phone) params.append('phone', phone);
    if (email) params.append('email', email);
    return request(`/bookings/search?${params.toString()}`);
  },

  async checkAvailability(data: {
    booking_date: string;
    start_time: string;
    duration: number;
    ground_size: 'full' | 'half';
  }) {
    return request('/bookings/check-availability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async createBooking(data: {
    username: string;
    phone: string;
    email: string;
    booking_date: string;
    start_time: string;
    duration: number;
    ground_size: 'full' | 'half';
    night_mode: boolean;
    amount: number;
    status?: string;
    payment_status?: string;
  }) {
    return request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBooking(id: string, data: Partial<any>) {
    return request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteBooking(id: string) {
    return request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  // Payments
  async createPayment(data: {
    booking_id: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    amount: number;
    status?: string;
  }) {
    return request('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

