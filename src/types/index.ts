export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'therapist' | 'admin';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface Therapist {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | null;
  isActive: boolean;
  therapistProfile: {
    verified: boolean;
    specialties: string[];
    education?: string[];
    certifications?: string[];
    languages?: string[];
    rating?: number;
    totalReviews?: number;
    hourlyRate?: number;
    bio?: string;
    experience?: number;
    license?: string;
    availability?: Array<{
      day: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>;
  };
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
}

export interface ChatSession {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
  isActive: boolean;
}

export interface Booking {
  id: string;
  patientId: string;
  therapistId: string;
  sessionDate: Date;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  price: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: number;
  energy: number;
  anxiety: number;
  notes?: string;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  publishedAt: Date;
  isPublished: boolean;
}

export interface AIMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  confidence?: number;
}