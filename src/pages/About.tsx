import { Phone, MapPin, Instagram, Mail, Clock, Sun, Moon, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-5 shadow-xl">
              <Trophy className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            About Bhadaj Patidar Cricket Ground
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to BPCG - Your premier destination for cricket matches, practice sessions, and tournaments. 
            We offer world-class facilities with professional-grade turf and modern amenities.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Phone className="h-8 w-8 text-green-600 mr-3" />
            Contact Us
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phone Numbers</h3>
              <div className="space-y-3">
                <a 
                  href="tel:9157620242" 
                  className="flex items-center text-gray-700 hover:text-green-600 transition-colors"
                >
                  <Phone className="h-5 w-5 mr-3 text-green-600" />
                  <span className="text-lg font-medium">+91 9157620242</span>
                </a>
                <a 
                  href="tel:9825796802" 
                  className="flex items-center text-gray-700 hover:text-green-600 transition-colors"
                >
                  <Phone className="h-5 w-5 mr-3 text-green-600" />
                  <span className="text-lg font-medium">+91 9825796802</span>
                </a>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <a 
                href="https://www.instagram.com/bpcg_cricket_ground?igsh=MTZyN3pkeXhmY2YycQ%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-pink-600 transition-colors"
              >
                <Instagram className="h-5 w-5 mr-3 text-pink-600" />
                <span className="text-lg font-medium">@bpcg_cricket_ground</span>
              </a>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <MapPin className="h-8 w-8 text-red-600 mr-3" />
            Location
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              Find us at our convenient location. Click the link below to get directions:
            </p>
            <a 
              href="https://share.google/G9Wi5AUWegHrgX3Zb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Get Directions on Google Maps
            </a>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            Pricing
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Morning Pricing */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
              <div className="flex items-center mb-4">
                <Sun className="h-6 w-6 text-yellow-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Morning Prices</h3>
                <span className="ml-2 text-sm text-gray-600">(Every Day)</span>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Big Ground (65m boundary)</p>
                  <p className="text-2xl font-bold text-gray-900">₹4,000</p>
                  <p className="text-sm text-gray-600">for 3 hours</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Small Ground (52m boundary)</p>
                  <p className="text-2xl font-bold text-gray-900">₹3,000</p>
                  <p className="text-sm text-gray-600">for 3 hours</p>
                </div>
              </div>
            </div>

            {/* Night Pricing */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center mb-4">
                <Moon className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Night Prices</h3>
                <span className="ml-2 text-sm text-gray-600">(All Days)</span>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Big Ground (65m boundary)</p>
                  <p className="text-2xl font-bold text-gray-900">₹2,700</p>
                  <p className="text-sm text-gray-600">per hour</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Small Ground (52m boundary)</p>
                  <p className="text-2xl font-bold text-gray-900">₹2,000</p>
                  <p className="text-sm text-gray-600">per hour</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/pricing"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            >
              View Detailed Pricing
            </Link>
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Facilities</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Big Ground</h3>
              <p className="text-gray-600">65m boundary - Perfect for full team matches and tournaments</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Small Ground</h3>
              <p className="text-gray-600">52m boundary - Ideal for practice sessions and small games</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Night Facility</h3>
              <p className="text-gray-600">Floodlights available for night matches with professional lighting</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Slot?</h2>
          <p className="text-xl mb-6 opacity-90">
            Experience premium cricket facilities at Bhadaj Patidar Cricket Ground
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/book"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Book Now
            </Link>
            <a
              href="tel:9157620242"
              className="inline-block bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-all shadow-lg"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

