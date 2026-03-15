'use client';

import React from 'react';
import { Food } from '@/store/useStore';
import { X, Check } from 'lucide-react';

interface ProductPreviewProps {
  product: Food;
  onConfirm: (product: Food) => void;
  onCancel: () => void;
}

const ProductPreview: React.FC<ProductPreviewProps> = ({ product, onConfirm, onCancel }) => {
  const [quantity, setQuantity] = React.useState(100);

  // Calcula valores proporcionais à quantidade selecionada
  const factor = quantity / 100;
  const p = {
    ...product,
    amount: `${quantity}g`,
    protein: Math.round(product.protein * factor * 10) / 10,
    carbs: Math.round(product.carbs * factor * 10) / 10,
    fat: Math.round(product.fat * factor * 10) / 10,
    calories: Math.round(product.calories * factor)
  };

  return (
    <div className="card" style={{ padding: '24px', maxWidth: '400px', width: '95%', boxShadow: '0 24px 48px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex-row justify-between" style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Escolher Quantidade</h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--apple-gray)' }}>
          <X size={24} />
        </button>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '12px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={product.imageUrl || ''} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{product.name}</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--apple-secondary-text)' }}>{product.brand || 'Marca Própria'}</p>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 700 }}>
            <span>Quantidade (g)</span>
            <span style={{ color: 'var(--apple-blue)', fontSize: '18px' }}>{quantity}g</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            step="5"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--apple-blue)', height: '6px', cursor: 'grab' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--apple-secondary-text)', fontWeight: 700 }}>CALORIAS</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--apple-blue)' }}>{p.calories}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--apple-secondary-text)', fontWeight: 700 }}>PROT (g)</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--apple-red)' }}>{p.protein}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--apple-secondary-text)', fontWeight: 700 }}>CARB (g)</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--apple-green)' }}>{p.carbs}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--apple-secondary-text)', fontWeight: 700 }}>GORD (g)</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--apple-orange)' }}>{p.fat}</div>
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={() => onConfirm(p)} style={{ width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <Check size={20} />
        Confirmar {quantity}g
      </button>
    </div>
  );
};

export default ProductPreview;
