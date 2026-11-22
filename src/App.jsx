import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UnifiedLogin from './components/UnifiedLogin';
import StudentDashboard from './components/student/StudentDashboard';
import CoordinatorDashboard from './components/coordinator/CoordinatorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import SupabaseSettingsModal from './components/admin/SupabaseSettingsModal';
import { initAutoSyncWithSupabase } from './services/supabaseSyncService';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Initialize automatic Supabase synchronization (Realtime + Polling + Focus sync)
  useEffect(() => {
    const cleanup = initAutoSyncWithSupabase();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  // If not logged in, show the authentic full-screen MIT-WPU ERP login screen
  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <UnifiedLogin onLoginSuccess={handleLoginSuccess} />
        <SupabaseSettingsModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      </div>
    );
  }

  // Once authenticated, show the institutional portal layout
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar 
        currentUser={currentUser}
        onOpenLogin={() => setCurrentUser(null)}
        onLogout={handleLogout}
        onOpenSupabaseSettings={() => setIsSupabaseModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {currentUser.role === 'student' && <StudentDashboard student={currentUser} />}
        {(currentUser.role === 'teacher' || currentUser.isCoordinator || currentUser.facultyRole === 'Course Coordinator') && (
          <CoordinatorDashboard coordinator={currentUser} />
        )}
        {currentUser.role === 'admin' && <AdminDashboard onOpenSupabaseSettings={() => setIsSupabaseModalOpen(true)} />}
      </main>

      <SupabaseSettingsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}
