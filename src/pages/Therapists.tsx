import React, { useState } from 'react';
import { Star, Filter, MapPin, Clock, DollarSign, Video, MessageCircle } from 'lucide-react';
import { Therapist } from '../types';
import Button from '../components/ui/Button';

const Therapists: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Mock therapist data
  const therapists: Therapist[] = [
    {
      id: '1',
      email: 'sarah.johnson@mindease.com',
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      role: 'therapist',
      avatar: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      specialties: ['Anxiety', 'Depression', 'Trauma'],
      license: 'LCSW-12345',
      experience: 8,
      rating: 4.9,
      hourlyRate: 120,
      bio: 'Specializing in cognitive-behavioral therapy and trauma-informed care. I help clients develop coping strategies and build resilience.',
      availability: [],
      verified: true,
      createdAt: new Date(),
      isActive: true
    },
    {
      id: '2',
      email: 'michael.chen@mindease.com',
      firstName: 'Dr. Michael',
      lastName: 'Chen',
      role: 'therapist',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      specialties: ['Couples Therapy', 'Family Therapy', 'Communication'],
      license: 'LMFT-67890',
      experience: 12,
      rating: 4.8,
      hourlyRate: 140,
      bio: 'Helping couples and families improve communication and strengthen relationships through evidence-based approaches.',
      availability: [],
      verified: true,
      createdAt: new Date(),
      isActive: true
    },
    {
      id: '3',
      email: 'emma.williams@mindease.com',
      firstName: 'Dr. Emma',
      lastName: 'Williams',
      role: 'therapist',
      avatar: 'https://images.pexels.com/photos/3912979/pexels-photo-3912979.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      specialties: ['Adolescent Therapy', 'ADHD', 'Behavioral Issues'],
      license: 'LPC-54321',
      experience: 6,
      rating: 4.7,
      hourlyRate: 100,
      bio: 'Passionate about working with teens and young adults. Specializes in ADHD management and behavioral interventions.',
      availability: [],
      verified: true,
      createdAt: new Date(),
      isActive: true
    },
    {
      id: '4',
      email: 'david.brown@mindease.com',
      firstName: 'Dr. David',
      lastName: 'Brown',
      role: 'therapist',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      specialties: ['Addiction Recovery', 'Trauma', 'Men\'s Issues'],
      license: 'LCDC-98765',
      experience: 15,
      rating: 4.9,
      hourlyRate: 160,
      bio: 'Experienced in addiction recovery and trauma therapy. Provides a safe space for healing and personal growth.',
      availability: [],
      verified: true,
      createdAt: new Date(),
      isActive: true
    }
  ];

  const specialties = ['all', 'Anxiety', 'Depression', 'Trauma', 'Couples Therapy', 'Family Therapy', 'Addiction Recovery', 'ADHD'];
  const locations = ['all', 'New York', 'California', 'Texas', 'Florida'];
  const priceRanges = ['all', '$50-$100', '$100-$150', '$150-$200', '$200+'];

  const filteredTherapists = therapists.filter(therapist => {
    const specialtyMatch = selectedSpecialty === 'all' || therapist.specialties.includes(selectedSpecialty);
    const priceMatch = priceRange === 'all' || 
      (priceRange === '$50-$100' && therapist.hourlyRate >= 50 && therapist.hourlyRate < 100) ||
      (priceRange === '$100-$150' && therapist.hourlyRate >= 100 && therapist.hourlyRate < 150) ||
      (priceRange === '$150-$200' && therapist.hourlyRate >= 150 && therapist.hourlyRate < 200) ||
      (priceRange === '$200+' && therapist.hourlyRate >= 200);
    
    return specialtyMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Therapist</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with licensed, verified mental health professionals who specialize in your specific needs.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTherapists.map((therapist) => (
            <div key={therapist.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={therapist.avatar}
                    alt={`${therapist.firstName} ${therapist.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {therapist.firstName} {therapist.lastName}
                      </h3>
                      {therapist.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{therapist.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{therapist.experience} years exp</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>${therapist.hourlyRate}/hour</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600 text-sm mb-3">{therapist.bio}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {therapist.specialties.map((specialty, index) => (
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
                      <span>License: {therapist.license}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>Message</span>
                      </Button>
                      <Button size="sm" className="flex items-center space-x-1">
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