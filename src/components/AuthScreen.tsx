'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const AuthScreen: React.FC = () => {
  const { signIn, loginEmail, signupEmail } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await (loginEmail as any)(email, password);
      } else {
        await (signupEmail as any)(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100dvh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at top right, #1a1a1a, #000000)',
      color: 'white',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: '380px', width: '100%', zIndex: 1 }}
      >
        <div style={{ marginBottom: '32px' }}>
          <img src="/logo.png" alt="FitCoach AI" style={{ height: '64px', marginBottom: '24px' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1px' }}>
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p style={{ color: 'var(--apple-gray)', fontSize: '15px' }}>
            {isLogin ? 'Para acessar seus protocolos de elite' : 'Comece sua transformação com IA hoje'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            <input 
              type="email" 
              placeholder="Seu melhor email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '16px 16px 16px 48px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', outline: 'none', fontSize: '15px', backdropFilter: 'blur(10px)'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            <input 
              type="password" 
              placeholder="Sua senha secreta"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '16px 16px 16px 48px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', outline: 'none', fontSize: '15px', backdropFilter: 'blur(10px)'
              }}
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ color: '#ff453a', fontSize: '13px', fontWeight: 500, textAlign: 'left' }}
            >
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', background: 'white', color: 'black', border: 'none', 
              borderRadius: '16px', padding: '16px', fontWeight: 800, fontSize: '16px',
              cursor: 'pointer', transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {loading ? 'Carregando...' : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>OU</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <button 
          type="button"
          onClick={signIn}
          style={{ 
            width: '100%', background: 'transparent', color: 'white', 
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', 
            padding: '14px', fontWeight: 600, fontSize: '15px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
          Continuar com Google
        </button>

        <button 
          type="button"
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
          style={{ background: 'none', border: 'none', color: 'var(--apple-blue)', marginTop: '32px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
        >
          {isLogin ? 'Não tem conta? Comece aqui' : 'Já tem conta? Faça login'}
        </button>
      </motion.div>

      {/* Decorative Blur Elements */}
      <div style={{ position: 'absolute', top: '15%', right: '-10%', width: '350px', height: '350px', background: 'rgba(10, 132, 255, 0.12)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-10%', width: '300px', height: '300px', background: 'rgba(255, 55, 95, 0.08)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0 }} />
    </div>
  );
};

export default AuthScreen;
