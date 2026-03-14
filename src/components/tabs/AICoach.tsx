'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { startChat, sendMessage } from '@/services/geminiService';

export interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  action?: {
    type: 'update_diet' | 'update_workout';
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
      text: "Olá! Sou seu Coach de IA. Analisei seu perfil e gerei seu plano inicial. Como posso ajudar você hoje?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const cleanText = (text: string) => {
    return text.replace(/\[\[ACTION:.*?\]\]/g, '').trim();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessage(chatInstance.current, input);
      const action = parseAction(responseText);
      const displayedText = cleanText(responseText);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: displayedText,
        sender: 'ai',
        timestamp: new Date(),
        action: action || undefined
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
    
    onPlanUpdate(action.type === 'update_diet' ? 'diet' : 'workout', action.payload);
    
    const confirmationMsg: Message = {
      id: Date.now().toString(),
      text: `Entendido! Acabei de aplicar essa alteração no seu plano de ${action.type === 'update_diet' ? 'dieta' : 'treino'}.`,
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
        justifyContent: 'center',
        borderTop: 'none',
        position: 'sticky',
        top: 0,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <img src="/logo.png" alt="FitCoach AI" style={{ height: '36px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }} />
      </div>

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
            onClick={handleSend}
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
