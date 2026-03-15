'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { startChat, sendMessage } from '@/services/geminiService';
import UserProfileModal from '../modals/UserProfileModal';
import { useStore } from '@/store/useStore';

export interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  options?: string[];
  action?: {
    type: 'update_diet' | 'update_workout' | 'apply_full_diet' | 'apply_full_workout';
    payload: any;
    label: string;
  };
}

interface AICoachProps {
  onPlanUpdate: (type: 'diet' | 'workout', payload: any) => void;
  context: {
    profile: any;
    dietPlan: any;
    workoutPlan: any;
  };
}

const AICoach: React.FC<AICoachProps> = ({ onPlanUpdate, context }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Vamos definir sua dieta e treino!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { profile, user, applyNewDietPlan, applyNewWorkoutPlan } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatInstance = useRef<any>(null);

  useEffect(() => {
    if (!chatInstance.current) {
      chatInstance.current = startChat([], context);
    }
  }, [context]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const parseAction = (text: string) => {
    const actionMatch = text.match(/\[\[ACTION:(.*?)\]\]/);
    if (actionMatch && actionMatch[1]) {
      try {
        return JSON.parse(actionMatch[1]);
      } catch (e) {
        console.error("Erro ao parsear ação da IA", e);
      }
    }
    return null;
  };

  const parseOptions = (text: string) => {
    const optionsMatch = text.match(/\[\[OPTIONS:(.*?)\]\]/);
    if (optionsMatch && optionsMatch[1]) {
      try {
        return JSON.parse(optionsMatch[1]);
      } catch (e) {
        console.error("Erro ao parsear opções", e);
      }
    }
    return null;
  };

  const cleanText = (text: string) => {
    return text.replace(/\[\[ACTION:.*?\]\]/g, '').replace(/\[\[OPTIONS:.*?\]\]/g, '').trim();
  };

  const handleSend = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessage(chatInstance.current, messageText);
      const action = parseAction(responseText);
      const options = parseOptions(responseText);
      const displayedText = cleanText(responseText);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: displayedText,
        sender: 'ai',
        timestamp: new Date(),
        action: action || undefined,
        options: options || undefined
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Erro no Gemini:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Desculpe, tive um problema de conexão. Poderia repetir?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAction = (action: Message['action']) => {
    if (!action) return;
    
    if (action.type === 'apply_full_diet') {
      applyNewDietPlan(action.payload);
    } else if (action.type === 'apply_full_workout') {
      applyNewWorkoutPlan(action.payload);
    } else {
      onPlanUpdate(action.type === 'update_diet' ? 'diet' : 'workout', action.payload);
    }
    
    const confirmationMsg: Message = {
      id: Date.now().toString(),
      text: `Entendido! Acabei de aplicar essa alteração no seu plano de ${action.type.includes('diet') ? 'dieta' : 'treino'}.`,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmationMsg]);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100dvh - 84px)', 
      background: 'var(--apple-bg)',
      paddingTop: 'env(safe-area-inset-top, 0px)'
    }}>
      <div className="glass" style={{ 
        padding: '16px 20px', 
        zIndex: 10, 
        display: 'flex', 
        flexDirection: 'column',
        gap: '12px',
        borderTop: 'none',
        position: 'sticky',
        top: 0,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => setShowProfile(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: 0,
              cursor: 'pointer'
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--apple-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {profile?.photoURL ? <img src={profile.photoURL} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontWeight: 800, color: 'white', fontSize: '14px' }}>{profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</div>}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--apple-blue)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PERFIL</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{profile?.name || 'Vigoroso'}</div>
            </div>
          </button>
          <img src="/logo-new.png" alt="FitCoach AI" style={{ height: '32px', objectFit: 'contain', mixBlendMode: 'screen' }} />
        </div>
      </div>

      {showProfile && (
        <UserProfileModal onClose={() => setShowProfile(false)} />
      )}

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '20px', 
              fontSize: '14px',
              lineHeight: '1.45',
              backgroundColor: msg.sender === 'user' ? 'var(--apple-blue)' : 'var(--apple-card-bg)',
              color: 'white',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '20px',
              borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '20px',
              border: msg.sender === 'ai' ? '1px solid rgba(255,255,255,0.06)' : 'none',
              boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(10, 132, 255, 0.25)' : 'var(--shadow-sm)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {msg.text}
            </div>
            
            {msg.options && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {msg.options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(opt)}
                    style={{ 
                      background: 'rgba(255,255,255,0.06)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '16px', 
                      fontSize: '13px', 
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {msg.text === "Vamos definir sua dieta e treino!" && messages.length === 1 && (
              <button 
                onClick={() => handleSend("Quero iniciar minha avaliação")}
                style={{ marginTop: '16px', display: 'block', width: '100%', padding: '14px', background: 'var(--apple-blue)', color: 'white', borderRadius: '16px', border: 'none', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}
              >
                🚀 INICIAR MEU PROTOCOLO
              </button>
            )}

            {msg.action && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card" 
                style={{ marginTop: '12px', padding: '16px', background: 'var(--apple-card-bg)', borderColor: 'var(--apple-blue)', borderLeft: '4px solid var(--apple-blue)' }}
              >
                <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '10px', color: 'var(--apple-blue)', letterSpacing: '0.5px' }}>AJUSTE SUGERIDO</div>
                <button 
                  onClick={() => confirmAction(msg.action)}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <CheckCircle2 size={16} /> {msg.action.label}
                </button>
              </motion.div>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ 
            alignSelf: 'flex-start', 
            padding: '12px 18px', 
            borderRadius: '22px', 
            backgroundColor: 'var(--apple-card-bg)', 
            color: 'var(--apple-secondary-text)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: '14px'
          }}>
            <Loader2 size={16} className="animate-spin" /> Coach está pensando...
          </div>
        )}
      </div>

      <div style={{ 
        padding: '12px 16px', 
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))', 
        background: 'var(--apple-bg)',
        borderTop: '0.5px solid rgba(255,255,255,0.05)'
      }}>
        <div className="glass" style={{ 
          display: 'flex', 
          gap: '10px', 
          alignItems: 'center', 
          borderRadius: '30px', 
          padding: '8px 16px', 
          border: '1px solid var(--glass-border)',
          background: 'rgba(255, 255, 255, 0.04)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
        }}>
          <input 
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              padding: '12px 2px', 
              fontSize: '16px', 
              outline: 'none', 
              color: 'white',
              fontWeight: 500
            }}
            placeholder="Mude meu treino, substitua ref..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            style={{ 
              background: isLoading || !input.trim() ? 'var(--apple-light-gray)' : 'var(--apple-blue)', 
              color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '20px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: isLoading || !input.trim() ? 0.4 : 1,
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: !input.trim() ? 'none' : '0 4px 12px rgba(10, 132, 255, 0.3)'
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AICoach;
