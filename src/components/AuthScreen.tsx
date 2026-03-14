'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

const AuthScreen: React.FC = () => {
  const { signIn } = useStore();

  return (
    <div style={{ 
      height: '100dvh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at top right, #1a1a1a, #000000)',
      color: 'white',
      textAlign: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <div style={{ 
          padding: '20px', 
          borderRadius: '30px', 
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          marginBottom: '40px',
          display: 'inline-block'
        }}>
          <img src="/logo.png" alt="FitCoach AI" style={{ height: '80px', width: 'auto' }} />
        </div>

        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: 800, 
          letterSpacing: '-1px', 
          marginBottom: '16px',
          lineHeight: 1.1,
          background: 'linear-gradient(to bottom, #fff, #888)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Seu Treinador de Elite com IA
        </h1>

        <p style={{ 
          fontSize: '18px', 
          color: 'var(--apple-gray)', 
          marginBottom: '48px',
          lineHeight: 1.5 
        }}>
          Protocolos científicos de treino e dieta personalizados para o seu DNA.
        </p>

        <button 
          onClick={signIn}
          style={{ 
            width: '100%',
            background: 'white', 
            color: 'black', 
            border: 'none', 
            borderRadius: '16px', 
            padding: '18px', 
            fontWeight: 800, 
            fontSize: '16px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(255,255,255,0.1)',
            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '22px' }} />
          Entrar com Google
        </button>

        <p style={{ 
          marginTop: '32px', 
          fontSize: '13px', 
          color: 'rgba(255,255,255,0.3)',
          fontWeight: 500 
        }}>
          Ao entrar, você concorda com nossos Termos e IA Coach Protocols.
        </p>
      </motion.div>

      {/* Decorative Blur Orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: 'rgba(10, 132, 255, 0.1)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: -1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-10%',
        width: '250px',
        height: '250px',
        background: 'rgba(255, 55, 95, 0.05)',
        filter: 'blur(80px)',
        borderRadius: '50%',
        zIndex: -1
      }} />
    </div>
  );
};

export default AuthScreen;
