import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Edit2, Trash2, Calendar, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';
import type { Booking } from '../lib/types';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Booking>>({});

  useEffect(() => {
    checkAuth();
    fetchBookings();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await api.getSession();
      if (!session.isAdmin) {
        navigate('/admin-login');
      }
    } catch (error) {
      navigate('/admin-login');
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getBookings();
      setBookings(data || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      alert('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      await api.deleteBooking(id);
      setBookings(bookings.filter((b) => b.id !== id));
      alert('Booking deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Failed to delete booking');
    }
  };

  const startEdit = (booking: Booking) => {
    setEditingId(booking.id);
    setEditForm(booking);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      const updated = await api.updateBooking(editingId, editForm);
      setBookings(bookings.map((b) => (b.id === editingId ? updated : b)));
      setEditingId(null);
      setEditForm({});
      alert('Booking updated successfully');
    } catch (error: any) {
      console.error('Update error:', error);
      alert('Failed to update booking');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Booking ID',
      'Name',
      'Phone',
      'Email',
      'Date',
      'Time',
      'Duration',
      'Ground Size',
      'Night Mode',
      'Amount',
      'Status',
      'Payment Status',
      'Created At',
    ];

    const rows = bookings.map((b) => [
      b.id,
      b.username,
      b.phone,
      b.email,
      b.booking_date,
      b.start_time,
      b.duration,
      b.ground_size,
      b.night_mode ? 'Yes' : 'No',
      b.amount,
      b.status,
      b.payment_status,
      new Date(b.created_at).toLocaleString('en-IN'),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    revenue: bookings
      .filter((b) => b.payment_status === 'completed')
      .reduce((sum, b) => sum + b.amount, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage all cricket ground bookings</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Confirmed</p>
            <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">All Bookings</h2>
            <div className="flex space-x-3">
              <button
                onClick={fetchBookings}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {editingId === booking.id ? (
                <div className="p-6 bg-blue-50">
                  <h3 className="font-semibold text-lg mb-4">Edit Booking</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                      <select
                        value={editForm.payment_status}
                        onChange={(e) => setEditForm({ ...editForm, payment_status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdate}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{booking.username}</h3>
                      <p className="text-sm text-gray-600">{booking.phone} • {booking.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <button
                        onClick={() => startEdit(booking)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-green-600" />
                        {new Date(booking.booking_date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time & Duration</p>
                      <p className="font-semibold">{booking.start_time} ({booking.duration}h)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ground</p>
                      <p className="font-semibold">{booking.ground_size === 'full' ? 'Big Ground (65m)' : 'Small Ground (52m)'} • {booking.night_mode ? 'Night' : 'Day'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold text-green-600">₹{booking.amount}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm text-gray-600">
                    <span>Payment: <span className="font-semibold capitalize">{booking.payment_status}</span></span>
                    <span>Booked: {new Date(booking.created_at).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600">Bookings will appear here once customers start booking.</p>
          </div>
        )}
      </div>
    </div>
  );
}
