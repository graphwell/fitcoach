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
  return (
    <div className="card" style={{ padding: '20px', maxWidth: '400px', width: '90%' }}>
      <div className="flex-row justify-between" style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Produto Encontrado</h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--apple-gray)' }}>
          <X size={24} />
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ width: '120px', height: '120px', objectFit: 'contain', borderRadius: '8px', background: 'white', padding: '10px' }} 
          />
        ) : (
          <div style={{ width: '120px', height: '120px', background: 'var(--apple-light-gray)', borderRadius: '8px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             No Image
          </div>
        )}
      </div>

      <h4 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{product.name}</h4>
      <p style={{ color: 'var(--apple-secondary-text)', margin: '0 0 16px 0', fontSize: '14px' }}>{product.brand}</p>

      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', marginBottom: '20px' }}>
        <div style={{ color: 'var(--apple-secondary-text)', fontSize: '12px', marginBottom: '8px' }}>Valores por {product.amount}</div>
        <div className="flex-row justify-between" style={{ marginBottom: '4px' }}>
          <span>Calorias</span>
          <span style={{ fontWeight: '600' }}>{product.calories} kcal</span>
        </div>
        <div className="flex-row justify-between" style={{ marginBottom: '4px' }}>
          <span>Proteínas</span>
          <span>{product.protein}g</span>
        </div>
        <div className="flex-row justify-between" style={{ marginBottom: '4px' }}>
          <span>Carboidratos</span>
          <span>{product.carbs}g</span>
        </div>
        <div className="flex-row justify-between">
          <span>Gorduras</span>
          <span>{product.fat}g</span>
        </div>
      </div>

      <button className="btn-primary" onClick={() => onConfirm(product)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <Check size={20} />
        Adicionar à Refeição
      </button>
    </div>
  );
};

export default ProductPreview;
