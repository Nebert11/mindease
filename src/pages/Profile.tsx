import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

const DEFAULT_AVATAR = 'https://randomuser.me/api/portraits/men/32.jpg';

const Profile: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  // Therapist profile state
  const [therapistProfile, setTherapistProfile] = useState<User['therapistProfile']>(user?.therapistProfile || {
    specialties: [],
    education: [],
    certifications: [],
    languages: [],
    bio: ''
  });
  const [saving, setSaving] = useState(false);

  // Mock user data (replace with real user data from context or props)
  const profile = {
    firstName: user?.firstName || 'nebert',
    lastName: user?.lastName || 'kuria',
    email: user?.email || 'ngarinebert2020@gmail.com',
    country: 'Kenya',
    town: 'Nairobi',
    gender: 'Male',
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.avatar) {
        if (user) {
          updateUser({ avatar: data.avatar });
        }
      } else {
        alert(data.message || 'Failed to upload avatar');
      }
    } catch (err) {
      alert('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleRevertPhoto = async () => {
    if (!token) return;
    setUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/avatar`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        if (user) {
          updateUser({ avatar: DEFAULT_AVATAR });
        }
      } else {
        alert(data.message || 'Failed to revert avatar');
      }
    } catch (err) {
      alert('Failed to revert avatar');
    } finally {
      setUploading(false);
    }
  };

  // Save therapist profile
  const handleTherapistProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ therapistProfile })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        updateUser({ therapistProfile: data.user.therapistProfile });
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-cyan-100 py-8 dark:bg-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white bg-opacity-60 rounded-xl shadow p-8 mb-8 relative dark:bg-gray-800 dark:bg-opacity-100 dark:text-white">
          <div className="flex items-center space-x-6">
            <img
              src={user?.avatar || DEFAULT_AVATAR}
              alt={profile.firstName}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 dark:text-white">{profile.firstName} {profile.lastName}</h2>
              <p className="text-gray-600 dark:text-white">{profile.email}</p>
            </div>
          </div>
          <button
            className="absolute top-6 right-6 sm:static sm:ml-auto bg-white border border-gray-300 px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition font-medium dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            onClick={handlePhotoClick}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Update Profile Photo'}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        {/* Basic Information Form */}
        <div className="bg-white rounded-xl shadow p-8 dark:bg-gray-800 dark:text-white">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Basic Information</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-1 font-medium dark:text-white">First Name *</label>
              <input
                type="text"
                value={profile.firstName}
                disabled
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium dark:text-white">Last Name *</label>
              <input
                type="text"
                value={profile.lastName}
                disabled
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium dark:text-white">Email *</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium dark:text-white">Country *</label>
              <input
                type="text"
                value={profile.country}
                disabled
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium dark:text-white">Town *</label>
              <input
                type="text"
                value={profile.town}
                disabled
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium dark:text-white">Gender *</label>
              <input
                type="text"
                value={profile.gender}
                disabled
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              />
            </div>
          </form>
        </div>

        {/* Therapist Profile Section */}
        {user?.role === 'therapist' && (
          <div className="bg-white rounded-xl shadow p-8 mt-8 dark:bg-gray-800 dark:text-white">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Therapist Profile</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleTherapistProfileSave}>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1 font-medium dark:text-white">Bio</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                  rows={3}
                  value={therapistProfile?.bio || ''}
                  onChange={e => setTherapistProfile(tp => ({ ...tp, bio: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium dark:text-white">Specialties (comma separated)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                  value={therapistProfile?.specialties?.join(', ') || ''}
                  onChange={e => setTherapistProfile(tp => ({ ...tp, specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium dark:text-white">Education (comma separated)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                  value={therapistProfile?.education?.join(', ') || ''}
                  onChange={e => setTherapistProfile(tp => ({ ...tp, education: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium dark:text-white">Certifications (comma separated)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                  value={therapistProfile?.certifications?.join(', ') || ''}
                  onChange={e => setTherapistProfile(tp => ({ ...tp, certifications: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium dark:text-white">Languages (comma separated)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                  value={therapistProfile?.languages?.join(', ') || ''}
                  onChange={e => setTherapistProfile(tp => ({ ...tp, languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 