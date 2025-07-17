import React, { useState, useEffect } from 'react';
import { Star, Filter, MapPin, Clock, DollarSign, Video, MessageCircle } from 'lucide-react';
import { Therapist } from '../types';
import Button from '../components/ui/Button';

const Therapists: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingDuration, setBookingDuration] = useState(60); // default 60 minutes
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_BASE_URL}/api/therapists?limit=1000`)
      .then(res => res.json())
      .then(data => setTherapists(data.therapists || []))
      .catch(() => setTherapists([]));
  }, []);

  const specialties = ['all', 'Anxiety', 'Depression', 'Trauma', 'Couples Therapy', 'Family Therapy', 'Addiction Recovery', 'ADHD'];
  const locations = ['all', 'New York', 'California', 'Texas', 'Florida'];
  const priceRanges = ['all', '$50-$100', '$100-$150', '$150-$200', '$200+'];

  const filteredTherapists = therapists.filter(therapist => {
    const specialtyMatch = selectedSpecialty === 'all' || (therapist.therapistProfile?.specialties || []).includes(selectedSpecialty);
    const priceMatch = priceRange === 'all' || 
      (priceRange === '$50-$100' && (therapist.therapistProfile?.hourlyRate || 0) >= 50 && (therapist.therapistProfile?.hourlyRate || 0) < 100) ||
      (priceRange === '$100-$150' && (therapist.therapistProfile?.hourlyRate || 0) >= 100 && (therapist.therapistProfile?.hourlyRate || 0) < 150) ||
      (priceRange === '$150-$200' && (therapist.therapistProfile?.hourlyRate || 0) >= 150 && (therapist.therapistProfile?.hourlyRate || 0) < 200) ||
      (priceRange === '$200+' && (therapist.therapistProfile?.hourlyRate || 0) >= 200);
    
    return specialtyMatch && priceMatch;
  });

  function handleBookSession(therapist: Therapist) {
    setSelectedTherapist(therapist);
    setShowBookingModal(true);
    setBookingDate('');
    setBookingSuccess('');
    setBookingError('');
  }

  async function submitBooking() {
    if (!selectedTherapist || !bookingDate || !bookingDuration) return;
    setBookingLoading(true);
    setBookingSuccess('');
    setBookingError('');
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('mindease_token');
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          therapistId: selectedTherapist._id,
          sessionDate: bookingDate,
          duration: bookingDuration,
        }),
      });
      if (res.ok) {
        setBookingSuccess('Session booked successfully!');
        setShowBookingModal(false);
      } else {
        const data = await res.json();
        setBookingError(data.message || 'Booking failed.');
      }
    } catch (err) {
      setBookingError('Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Booking Modal */}
      {showBookingModal && selectedTherapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowBookingModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Book Session with {selectedTherapist.firstName} {selectedTherapist.lastName}</h2>
            <label className="block mb-2 text-sm font-medium">Select Date & Time</label>
            <input
              type="datetime-local"
              value={bookingDate}
              onChange={e => setBookingDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
            />
            <label className="block mb-2 text-sm font-medium">Session Duration (minutes)</label>
            <select
              value={bookingDuration}
              onChange={e => setBookingDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
            >
              <option value={30}>30</option>
              <option value={60}>60</option>
              <option value={90}>90</option>
              <option value={120}>120</option>
            </select>
            {bookingError && <div className="text-red-500 mb-2">{bookingError}</div>}
            {bookingSuccess && <div className="text-green-500 mb-2">{bookingSuccess}</div>}
            <button
              onClick={submitBooking}
              disabled={bookingLoading || !bookingDate}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {bookingLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">Find a Therapist</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-white">
            Browse our network of licensed therapists and find the right fit for you.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 dark:bg-gray-800 dark:text-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
              >
                {priceRanges.map(range => (
                  <option key={range} value={range}>
                    {range === 'all' ? 'All Prices' : range}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search and Filter UI */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 dark:text-white">
          <input
            type="text"
            placeholder="Search therapists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTherapists.map((therapist) => (
            <div key={therapist._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:text-white">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={therapist.avatar || "/src/assets/default-avatar.png"}
                    alt={`${therapist.firstName} ${therapist.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {therapist.firstName} {therapist.lastName}
                      </h3>
                      {therapist.therapistProfile?.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{therapist.therapistProfile?.rating ?? 0}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{therapist.therapistProfile?.experience ?? 0} years exp</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>${therapist.therapistProfile?.hourlyRate ?? 0}/hour</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600 text-sm mb-3">{therapist.therapistProfile?.bio || ''}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {(therapist.therapistProfile?.specialties || []).map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>License: {therapist.therapistProfile?.license || 'N/A'}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>Message</span>
                      </Button>
                      <Button size="sm" className="flex items-center space-x-1" onClick={() => handleBookSession(therapist)}>
                        <Video className="h-4 w-4" />
                        <span>Book Session</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTherapists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No therapists found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Therapists;