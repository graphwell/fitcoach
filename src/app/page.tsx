'use client';

import React, { useState } from 'react';
import {
  MessageCircle,
  Utensils,
  Dumbbell,
  TrendingUp,
  LucideProps,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Onboarding from '@/components/Onboarding';
import AuthScreen from '@/components/AuthScreen';
import AdminDashboard from '@/components/AdminDashboard';
import AICoach from '@/components/tabs/AICoach';
import DietPlan from '@/components/tabs/DietPlan';
import WorkoutPlan from '@/components/tabs/WorkoutPlan';
import Analytics from '@/components/tabs/Analytics';

export default function Home() {
  const { 
    user, signOut, isHydrated, profile
  } = useStore();

  const [activeTab, setActiveTab] = useState('coach');

  if (!isHydrated) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--apple-bg)', color: 'white' }}>
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!profile) {
    return <Onboarding onComplete={() => {}} />; // useStore handles sync
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--apple-bg)' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ height: '100%' }}
          >
            {activeTab === 'coach' && <AICoach onPlanUpdate={() => {}} context={{ profile, dietPlan: [], workoutPlan: [] }} />}
            {activeTab === 'diet' && <DietPlan />}
            {activeTab === 'workout' && <WorkoutPlan workouts={[]} />}
            {activeTab === 'analytics' && <Analytics cardioData={[]} adherenceData={[]} />}
            {activeTab === 'admin' && profile?.role === 'admin' && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="tab-bar glass">
        {[
          { id: 'coach', label: 'Coach', icon: <MessageCircle size={24} /> },
          { id: 'diet', label: 'Dieta', icon: <Utensils size={24} /> },
          { id: 'workout', label: 'Treino', icon: <Dumbbell size={24} /> },
          { id: 'analytics', label: 'Progresso', icon: <TrendingUp size={24} /> },
          ...(profile?.role === 'admin' ? [{ id: 'admin', label: 'Admin', icon: <ShieldAlert size={24} /> }] : []),
        ].map((tab) => (
          <div
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ position: 'relative' }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                style={{
                  position: 'absolute',
                  top: '-12px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '2px',
                  background: 'var(--apple-blue)',
                  boxShadow: '0 0 10px var(--apple-blue)'
                }}
              />
            )}
            <div style={{
              marginBottom: '4px',
              opacity: activeTab === tab.id ? 1 : 0.5,
              transform: activeTab === tab.id ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
              {React.cloneElement(tab.icon as React.ReactElement<LucideProps>, {
                strokeWidth: activeTab === tab.id ? 2.5 : 2
              })}
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: activeTab === tab.id ? 700 : 500,
              opacity: activeTab === tab.id ? 1 : 0.7
            }}>
              {tab.label}
            </span>
          </div>
        ))}
        {user && (
          <div
            className="tab-item"
            onClick={signOut}
            style={{ color: 'var(--apple-red)', opacity: 0.8 }}
          >
            <div style={{ marginBottom: '4px' }}>
              <TrendingUp size={24} style={{ transform: 'rotate(180deg)' }} />
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>Sair</span>
          </div>
        )}
      </div>
    </div>
  );
}
