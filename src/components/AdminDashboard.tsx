'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, UserX, UserCheck, Search, ChevronRight } from 'lucide-react';
import { getAllUsers, updateUserRole } from '@/services/userService';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleToggleAdmin = async (uid: string, currentRole?: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await updateUserRole(uid, newRole);
    fetchUsers(); // Refresh list
  };

  const filteredUsers = users.filter(u => 
    u.profile?.age?.toString().includes(searchTerm) || 
    u.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', paddingTop: 'env(safe-area-inset-top, 40px)', color: 'white' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Painel Administrativo</h1>
        <p style={{ color: 'var(--apple-gray)', fontSize: '15px' }}>Gerenciamento de usuários e permissões de elite.</p>
      </header>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', margin: 0 }}>
          <Users size={20} color="var(--apple-blue)" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '24px', fontWeight: 800 }}>{users.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--apple-gray)', fontWeight: 600 }}>USUÁRIOS TOTAIS</div>
        </div>
        <div className="card" style={{ padding: '20px', margin: 0 }}>
          <Shield size={20} color="#34C759" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '24px', fontWeight: 800 }}>{users.filter(u => u.profile?.role === 'admin').length}</div>
          <div style={{ fontSize: '12px', color: 'var(--apple-gray)', fontWeight: 600 }}>ADMINS</div>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--apple-gray)' }} />
        <input 
          type="text" 
          placeholder="Buscar por UID ou idade..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px 14px 48px',
            borderRadius: '14px',
            background: 'var(--apple-card-bg)',
            border: '1px solid var(--apple-light-gray)',
            color: 'white',
            outline: 'none'
          }}
        />
      </div>

      {/* User list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--apple-gray)' }}>Carregando usuários...</div>
        ) : filteredUsers.map(user => (
          <div key={user.uid} className="card" style={{ padding: '16px', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '20px', 
                background: user.profile?.role === 'admin' ? 'var(--apple-blue)' : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {user.profile?.role === 'admin' ? <Shield size={20} /> : <Users size={20} />}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>
                  {user.uid.substring(0, 8)}...
                </div>
                <div style={{ fontSize: '12px', color: 'var(--apple-gray)' }}>
                  {user.profile?.age} anos • {user.profile?.goal === 'lose_fat' ? 'Perda de Gordura' : user.profile?.goal === 'gain_muscle' ? 'Hipertrofia' : 'Recomposição'}
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleToggleAdmin(user.uid, user.profile?.role)}
              style={{
                background: 'none', border: 'none', padding: '8px', 
                color: user.profile?.role === 'admin' ? 'var(--apple-red)' : 'var(--apple-blue)',
                cursor: 'pointer'
              }}
            >
              {user.profile?.role === 'admin' ? <UserX size={20} /> : <UserCheck size={20} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
