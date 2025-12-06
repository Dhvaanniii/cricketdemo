import { useState } from 'react';
import { Search, Calendar, Clock, MapPin, Moon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import type { Booking } from '../lib/types';

export function MyBookings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      // Check if search term is email or phone
      const isEmail = searchTerm.includes('@');
      const data = await api.searchBookings(
        isEmail ? undefined : searchTerm,
        isEmail ? searchTerm : undefined
      );
      setBookings(data || []);
    } catch (error: any) {
      console.error('Search error:', error);
      alert('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View all your cricket ground bookings</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter your phone number or email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </form>
        </div>

        {searched && bookings.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600">No bookings were found with this phone number or email.</p>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {booking.username}
                      </h3>
                      <p className="text-gray-600">{booking.email}</p>
                      <p className="text-gray-600">{booking.phone}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full ${getStatusColor(booking.status)} flex items-center space-x-2 font-semibold`}>
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold">{formatDate(booking.booking_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-semibold">
                          {formatTime(booking.start_time)} ({booking.duration}h)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Ground</p>
                        <p className="font-semibold">{booking.ground_size === 'full' ? 'Big Ground (65m)' : 'Small Ground (52m)'}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <Moon className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Night Mode</p>
                        <p className="font-semibold">{booking.night_mode ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-green-600">₹{booking.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <p className={`font-semibold capitalize ${
                        booking.payment_status === 'completed' ? 'text-green-600' :
                        booking.payment_status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {booking.payment_status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    Booked on: {new Date(booking.created_at).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
