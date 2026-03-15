'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Camera, Save, Scale, Ruler, Calendar, Award } from 'lucide-react';
import { useStore, UserProfile } from '@/store/useStore';

interface UserProfileModalProps {
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { profile, updateProfile, user } = useStore();
  const [formData, setFormData] = useState<UserProfile>(profile || {
    name: user?.displayName || '',
    age: 25,
    weight: 75,
    height: 175,
    gender: 'male',
    experience: 'beginner',
    goal: 'lose_fat'
  });

  const handleSave = () => {
    updateProfile(formData);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '420px', background: 'var(--apple-bg)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
      >
        <div style={{ padding: '24px', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--apple-gray)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '35px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--apple-blue)' }}>
                {profile?.photoURL ? <img src={profile.photoURL} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '35px', objectFit: 'cover' }} /> : <User size={48} color="var(--apple-blue)" />}
              </div>
              <button style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--apple-blue)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={16} />
              </button>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Meus Dados</h2>
            <p style={{ color: 'var(--apple-gray)', fontSize: '14px', marginTop: '4px' }}>Evolua seu protocolo de elite</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: 'var(--apple-gray)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Nome</label>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                   <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={{ background: 'none', border: 'none', color: 'white', padding: '14px 0', width: '100%', outline: 'none', fontSize: '15px' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--apple-gray)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Peso (kg)</label>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
                   <Scale size={16} color="var(--apple-gray)" />
                   <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} style={{ background: 'none', border: 'none', color: 'white', padding: '14px 0', width: '100%', outline: 'none', fontSize: '15px' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--apple-gray)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Altura (cm)</label>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
                   <Ruler size={16} color="var(--apple-gray)" />
                   <input type="number" value={formData.height} onChange={e => setFormData({...formData, height: Number(e.target.value)})} style={{ background: 'none', border: 'none', color: 'white', padding: '14px 0', width: '100%', outline: 'none', fontSize: '15px' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--apple-gray)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Idade</label>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
                   <Calendar size={16} color="var(--apple-gray)" />
                   <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})} style={{ background: 'none', border: 'none', color: 'white', padding: '14px 0', width: '100%', outline: 'none', fontSize: '15px' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--apple-gray)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Objetivo</label>
                <select 
                  value={formData.goal} 
                  onChange={e => setFormData({...formData, goal: e.target.value as any})}
                  style={{ width: '100%', height: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', color: 'white', padding: '0 12px', outline: 'none' }}
                >
                  <option value="lose_fat">Queimar Gordura</option>
                  <option value="gain_muscle">Hipertrofia</option>
                  <option value="recomposition">Recomposição</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            style={{ width: '100%', height: '56px', background: 'white', color: 'black', borderRadius: '18px', border: 'none', marginTop: '32px', fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <Save size={20} />
            Salvar Alterações
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfileModal;
