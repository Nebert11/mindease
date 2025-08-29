import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Bot, User, RotateCcw, Download } from 'lucide-react';
import Button from '../components/ui/Button';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL: string = (import.meta.env.VITE_API_URL as string) ?? '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load AI chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/ai/history?limit=50`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const hist: Message[] = data.map((m: any) => ({
            id: m.id,
            content: m.content,
            sender: m.sender,
            timestamp: new Date(m.timestamp)
          }));
          setMessages(hist);
        }
      } catch {
        // ignore
      }
    };
    loadHistory();
  }, [token, API_BASE_URL]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: userMessage.content })
      });
      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          id: data.aiMessage.id,
          content: data.aiMessage.content,
          sender: 'ai',
          timestamp: new Date(data.aiMessage.timestamp)
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        // Fallback error message
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          content: 'Sorry, I had trouble responding. Please try again.',
          sender: 'ai',
          timestamp: new Date()
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 3).toString(),
        content: 'Network error. Please check your connection and try again.',
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const exportChat = () => {
    const chatHistory = messages.map(msg => 
      `${msg.sender === 'user' ? 'You' : 'MindEase AI'} (${msg.timestamp.toLocaleTimeString()}): ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatHistory], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindease-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300">Please log in to access the AI chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6 dark:bg-gray-800 dark:text-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full dark:bg-blue-900">
                <Bot className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MindEase AI Assistant</h1>
                <p className="text-gray-600 dark:text-white">Your 24/7 mental health support companion</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportChat} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button variant="outline" onClick={clearChat} className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col h-96 md:h-[600px] dark:bg-gray-800 dark:text-gray-100">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-3 max-w-xs md:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 dark:bg-blue-500' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-gray-600 dark:text-gray-200" />
                    )}
                  </div>
                  <div className={`rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                      : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100 dark:text-white' : 'text-gray-500 dark:text-white'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-xs md:max-w-md">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <Button type="submit" disabled={isTyping || !inputMessage.trim()} className="px-4 py-2">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              This AI assistant provides supportive guidance but is not a replacement for professional mental health care.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
              <p className="mt-1 text-sm text-yellow-700">
                If you're experiencing a mental health crisis or having thoughts of self-harm, please contact emergency services immediately or call the National Suicide Prevention Lifeline at 988.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;