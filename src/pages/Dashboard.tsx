import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Calendar,
  BookOpen,
  BarChart3,
  Users,
  Settings,
  Bell,
  TrendingUp,
  Clock,
  Heart
} from 'lucide-react';
import Button from '../components/ui/Button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'Chat with AI',
      description: 'Get instant support from our AI assistant',
      href: '/chat',
      color: 'bg-blue-500'
    },
    {
      icon: Calendar,
      title: 'Book Session',
      description: 'Schedule with a licensed therapist',
      href: '/book',
      color: 'bg-green-500'
    },
    {
      icon: BookOpen,
      title: 'Journal',
      description: 'Write in your private journal',
      href: '/journal',
      color: 'bg-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Mood Tracker',
      description: 'Log your daily mood and emotions',
      href: '/mood',
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    { type: 'journal', title: 'Morning Reflection', time: '2 hours ago' },
    { type: 'mood', title: 'Mood Check-in', time: '5 hours ago' },
    { type: 'chat', title: 'AI Chat Session', time: '1 day ago' },
    { type: 'session', title: 'Therapy Session with Dr. Johnson', time: '2 days ago' }
  ];

  const upcomingAppointments = [
    {
      id: '1',
      therapist: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      time: '2:00 PM',
      type: 'Individual Therapy'
    },
    {
      id: '2',
      therapist: 'Dr. Michael Chen',
      date: '2024-01-18',
      time: '10:00 AM',
      type: 'Consultation'
    }
  ];

  const PatientDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href} className="group">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Average Mood</p>
              <p className="text-2xl font-semibold text-gray-900">7.2/10</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Streak</p>
              <p className="text-2xl font-semibold text-gray-900">12 days</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">8 total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.therapist}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const TherapistDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Therapist Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-gray-600">Today's Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">45</div>
            <div className="text-gray-600">Active Patients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-600">Initial Consultation</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">9:00 AM</p>
                <p className="text-sm text-gray-600">50 min</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Jane Smith</p>
                <p className="text-sm text-gray-600">Follow-up Session</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">11:00 AM</p>
                <p className="text-sm text-gray-600">50 min</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">New message from John D.</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Session request from Sarah M.</p>
              <p className="text-sm text-gray-600">4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1,234</div>
            <div className="text-gray-600">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">89</div>
            <div className="text-gray-600">Active Therapists</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">456</div>
            <div className="text-gray-600">Sessions Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-gray-600">Flagged Chats</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-600">Patient</p>
              </div>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Dr. Smith</p>
                <p className="text-sm text-gray-600">Therapist (Pending)</p>
              </div>
              <p className="text-sm text-gray-600">5 hours ago</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="font-medium text-yellow-800">Server Load High</p>
              <p className="text-sm text-yellow-600">Monitor system performance</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="font-medium text-red-800">Flagged Chat Reported</p>
              <p className="text-sm text-red-600">Review required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'patient' && "Here's your mental wellness dashboard"}
            {user.role === 'therapist' && "Manage your practice and patients"}
            {user.role === 'admin' && "System overview and management"}
          </p>
        </div>

        {/* Dashboard Content */}
        {user.role === 'patient' && <PatientDashboard />}
        {user.role === 'therapist' && <TherapistDashboard />}
        {user.role === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;