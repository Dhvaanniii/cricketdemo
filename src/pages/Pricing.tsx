import { Check, Sun, Moon, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4 shadow-lg">
              <Trophy className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple & Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All prices are per hour.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-green-500 transition-all">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Big Ground (65m boundary)</h2>
              <p className="text-green-100">Perfect for full team matches</p>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <Sun className="h-6 w-6 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Morning (Every Day)</p>
                    <p className="text-2xl font-bold text-gray-900">₹4,000</p>
                    <p className="text-sm text-gray-600">for 3 hours</p>
                    <p className="text-xs text-gray-500 mt-1">(₹1,333/hour)</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Moon className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Night (All Days)</p>
                    <p className="text-3xl font-bold text-gray-900">₹2,700<span className="text-lg text-gray-600">/hour</span></p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">65m boundary - Full size cricket ground</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">22-yard pitch</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Professional turf maintenance</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Floodlights for night matches</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Changing rooms & facilities</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Parking available</span>
                </div>
              </div>

              <Link
                to="/book"
                className="block w-full text-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Book Big Ground
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Small Ground (52m boundary)</h2>
              <p className="text-blue-100">Ideal for practice & small games</p>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <Sun className="h-6 w-6 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Morning (Every Day)</p>
                    <p className="text-2xl font-bold text-gray-900">₹3,000</p>
                    <p className="text-sm text-gray-600">for 3 hours</p>
                    <p className="text-xs text-gray-500 mt-1">(₹1,000/hour)</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Moon className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Night (All Days)</p>
                    <p className="text-3xl font-bold text-gray-900">₹2,000<span className="text-lg text-gray-600">/hour</span></p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">52m boundary - Small ground access</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Practice nets available</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Professional turf maintenance</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Partial floodlights for night</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Basic facilities</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Parking available</span>
                </div>
              </div>

              <Link
                to="/book"
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Small Ground
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Night charges automatically apply for bookings between 6 PM - 6 AM</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Minimum booking duration: 1 hour</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Maximum booking duration: 4 hours per slot</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Advance booking required - same day bookings subject to availability</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Secure online payment via Razorpay</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Instant confirmation upon successful payment</span>
            </li>
          </ul>
        </div>

        <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Book?</h2>
          <p className="mb-6 text-lg opacity-90">Reserve your slot now and enjoy premium cricket facilities</p>
          <Link
            to="/book"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
