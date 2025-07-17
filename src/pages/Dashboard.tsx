import React, { useState, useEffect } from 'react';
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
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [averageMood, setAverageMood] = useState<number | null>(null);
  const [streak, setStreak] = useState<number | null>(null);
  const [sessionsCount, setSessionsCount] = useState<number | null>(null);
  const { token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    if (!token) return;
    // Fetch upcoming appointments
    fetch(`${API_BASE_URL}/api/bookings?upcoming=true`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUpcomingAppointments(data);
      });

    // Fetch recent journal entries
    fetch(`${API_BASE_URL}/api/journal?limit=3`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.entries)) {
          setRecentActivity(prev => [
            ...data.entries.map((e: any) => ({
              type: 'journal',
              title: e.title,
              time: new Date(e.createdAt).toLocaleString()
            })),
            ...prev
          ]);
        }
      });

    // Fetch recent mood entries
    fetch(`${API_BASE_URL}/api/mood?limit=3`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.entries)) {
          setRecentActivity(prev => [
            ...data.entries.map((e: any) => ({
              type: 'mood',
              title: 'Mood Check-in',
              time: new Date(e.date || e.createdAt).toLocaleString()
            })),
            ...prev
          ]);
        }
      });

    // Fetch mood insights (average mood, streak)
    fetch(`${API_BASE_URL}/api/mood/insights/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.averageMood === 'number') setAverageMood(data.averageMood);
        // For streak, you may need to calculate based on moodTrend or add a backend field
        if (data && Array.isArray(data.moodTrend)) {
          // Simple streak: count consecutive days with entries from the end
          let streakCount = 0;
          let lastDate = null;
          for (let i = data.moodTrend.length - 1; i >= 0; i--) {
            const entryDate = new Date(data.moodTrend[i].date);
            if (!lastDate) {
              streakCount = 1;
              lastDate = entryDate;
            } else {
              const diff = (lastDate - entryDate) / (1000 * 60 * 60 * 24);
              if (diff === 1) {
                streakCount++;
                lastDate = entryDate;
              } else {
                break;
              }
            }
          }
          setStreak(streakCount);
        }
      });

    // Fetch user stats for sessions count
    fetch(`${API_BASE_URL}/api/users/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.totalSessions === 'number') setSessionsCount(data.totalSessions);
      });
  }, [token]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Access Denied</h1>
          <p className="text-gray-600 mb-4 dark:text-gray-300">Please log in to access your dashboard.</p>
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

  const PatientDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href} className="group">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Average Mood</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{averageMood !== null ? `${averageMood.toFixed(1)}/10` : '--'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Streak</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{streak !== null ? `${streak} days` : '--'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Sessions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{sessionsCount !== null ? `${sessionsCount} total` : '--'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No recent activity.</p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-600 dark:text-white">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Upcoming Appointments</h3>
          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No upcoming appointments.</p>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div key={appointment._id || appointment.id} className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{appointment.therapist?.firstName || appointment.therapistName || appointment.therapist}</p>
                      <p className="text-sm text-gray-600 dark:text-white">{appointment.type || appointment.sessionType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(appointment.sessionDate || appointment.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600 dark:text-white">{appointment.time || (appointment.sessionDate ? new Date(appointment.sessionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const TherapistDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-gray-100">Therapist Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
            <div className="text-gray-600 dark:text-gray-300">Today's Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">45</div>
            <div className="text-gray-600 dark:text-gray-300">Active Patients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.8</div>
            <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Today's Schedule</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-900">
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Initial Consultation</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">9:00 AM</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">50 min</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-900">
              <div>
                <p className="font-medium">Jane Smith</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Follow-up Session</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">11:00 AM</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">50 min</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Recent Messages</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-900">
              <p className="font-medium text-gray-900 dark:text-gray-100">New message from John D.</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">2 hours ago</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-900">
              <p className="font-medium text-gray-900 dark:text-gray-100">Session request from Sarah M.</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-gray-100">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,234</div>
            <div className="text-gray-600 dark:text-gray-300">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">89</div>
            <div className="text-gray-600 dark:text-gray-300">Active Therapists</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">456</div>
            <div className="text-gray-600 dark:text-gray-300">Sessions Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">12</div>
            <div className="text-gray-600 dark:text-gray-300">Flagged Chats</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Recent Registrations</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-900">
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Patient</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">2 hours ago</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-900">
              <div>
                <p className="font-medium">Dr. Smith</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Therapist (Pending)</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">5 hours ago</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">System Alerts</h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 dark:bg-yellow-900 dark:border-yellow-700">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Server Load High</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-300">Monitor system performance</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900 dark:border-red-700">
              <p className="font-medium text-red-800 dark:text-red-200">Flagged Chat Reported</p>
              <p className="text-sm text-red-600 dark:text-red-300">Review required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2 dark:text-white">
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