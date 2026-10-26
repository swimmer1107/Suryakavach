import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Notification, StormData } from '../types';
import { currentStorm } from '../data/stormData';
import { notifications as initialNotifications } from '../data/alerts';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  setDemoMode: (v: boolean) => void;
  isReplayMode: boolean;
  setReplayMode: (v: boolean) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  storm: StormData;
  liveTime: Date;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDemoMode, setDemoMode] = useState(false);
  const [isReplayMode, setReplayMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [storm] = useState<StormData>(currentStorm);
  const [liveTime, setLiveTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      isAuthenticated: !!user,
      isDemoMode,
      setDemoMode,
      isReplayMode,
      setReplayMode,
      notifications,
      markNotificationRead,
      unreadCount,
      storm,
      liveTime,
      sidebarCollapsed,
      setSidebarCollapsed,
      searchQuery,
      setSearchQuery,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
