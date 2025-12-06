import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, MapPin, Moon, Trophy } from 'lucide-react';
import { api } from '../lib/api';

// Updated pricing based on BPCG rates
// Morning: Big Ground ₹4,000/3hrs (₹1,333/hr), Small Ground ₹3,000/3hrs (₹1,000/hr)
// Night: Big Ground ₹2,700/hr, Small Ground ₹2,000/hr
const PRICING = {
  full: {
    day: 1333, // ₹4,000 for 3 hours = ₹1,333 per hour
    night: 2700, // ₹2,700 per hour
  },
  half: {
    day: 1000, // ₹3,000 for 3 hours = ₹1,000 per hour
    night: 2000, // ₹2,000 per hour
  },
};

export function BookSlot() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    booking_date: '',
    start_time: '',
    duration: 1,
    ground_size: 'full' as 'full' | 'half',
    night_mode: false,
  });

  const calculateAmount = () => {
    const basePrice = formData.night_mode
      ? PRICING[formData.ground_size].night
      : PRICING[formData.ground_size].day;
    return basePrice * formData.duration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isNightTime =
        formData.start_time >= '18:00' || formData.start_time < '06:00';
      const nightMode = formData.night_mode || isNightTime;

      const amount = nightMode
        ? PRICING[formData.ground_size].night * formData.duration
        : PRICING[formData.ground_size].day * formData.duration;

      // Check availability
      const availability = await api.checkAvailability({
        booking_date: formData.booking_date,
        start_time: formData.start_time,
        duration: formData.duration,
        ground_size: formData.ground_size,
      });

      if (!availability.available) {
        alert('This slot is already booked. Please choose a different time or ground size.');
        setLoading(false);
        return;
      }

      // Create booking
      const booking = await api.createBooking({
        ...formData,
        night_mode: nightMode,
        amount,
        status: 'pending',
        payment_status: 'pending',
      });

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: amount * 100,
        currency: 'INR',
        name: 'Cricket Ground Booking',
        description: `${formData.ground_size} ground - ${formData.duration} hour(s)`,
        order_id: '',
        handler: async function (response: any) {
          try {
            await api.createPayment({
              booking_id: booking.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount * 100,
              status: 'success',
            });

            await api.updateBooking(booking.id, {
              status: 'confirmed',
              payment_status: 'completed',
            });

            alert('Booking confirmed successfully!');
            navigate('/my-bookings');
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment completed but verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.username,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#16a34a',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', async function () {
        await api.updateBooking(booking.id, {
          payment_status: 'failed',
          status: 'cancelled',
        });

        alert('Payment failed. Please try again.');
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4 shadow-lg">
                <Trophy className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Slot</h1>
            <p className="text-gray-600">Fill in the details to reserve your cricket ground</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="10 digit number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Booking Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.booking_date}
                  onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value={1}>1 Hour</option>
                  <option value={2}>2 Hours</option>
                  <option value={3}>3 Hours</option>
                  <option value={4}>4 Hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Ground Size
                </label>
                <select
                  value={formData.ground_size}
                  onChange={(e) => setFormData({ ...formData, ground_size: e.target.value as 'full' | 'half' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="full">Big Ground (65m)</option>
                  <option value="half">Small Ground (52m)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
              <input
                type="checkbox"
                id="night_mode"
                checked={formData.night_mode}
                onChange={(e) => setFormData({ ...formData, night_mode: e.target.checked })}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="night_mode" className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                <Moon className="h-4 w-4 mr-2 text-blue-600" />
                Enable Night Lights (6 PM - 6 AM)
              </label>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Ground Type:</span>
                <span className="text-gray-900 font-semibold">{formData.ground_size === 'full' ? 'Big Ground (65m)' : 'Small Ground (52m)'}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Duration:</span>
                <span className="text-gray-900 font-semibold">{formData.duration} Hour(s)</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Night Lights:</span>
                <span className="text-gray-900 font-semibold">{formData.night_mode ? 'Yes' : 'No'}</span>
              </div>
              <div className="border-t border-green-300 mt-3 pt-3 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">₹{calculateAmount()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
