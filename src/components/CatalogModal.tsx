'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Scan, Loader2, RefreshCw } from 'lucide-react';
import { Food, useStore } from '@/store/useStore';
import { searchProducts } from '@/services/nutritionService';
import ProductPreview from './ProductPreview';
import ScannerModal from './ScannerModal';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Food) => void;
}

const CatalogModal: React.FC<CatalogModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Food | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadProducts = async (searchQuery: string, pageNum: number, append: boolean) => {
    setLoading(true);
    const { foods, totalPages } = await searchProducts(searchQuery, pageNum);
    
    if (append) {
      setProducts(prev => [...prev, ...foods]);
    } else {
      setProducts(foods);
    }
    
    setHasMore(pageNum < totalPages);
    setLoading(false);
  };

  // Initial load or search load
  useEffect(() => {
    if (!isOpen) return;
    
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      loadProducts(query, 1, false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, isOpen]);

  // Infinite scroll load
  useEffect(() => {
    if (page > 1) {
      loadProducts(query, page, true);
    }
  }, [page]);

  const getNutriscoreColor = (grade?: string) => {
    switch (grade) {
      case 'A': return '#038141';
      case 'B': return '#85BB2F';
      case 'C': return '#FECB02';
      case 'D': return '#EE8100';
      case 'E': return '#E63E11';
      default: return 'var(--apple-light-gray)';
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      zIndex: 1500,
      display: 'flex',
      flexDirection: 'column',
      color: 'white'
    }}>
      {/* Header with Search */}
      <div style={{ padding: '20px', background: 'var(--apple-bg)', borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Catálogo</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white' }}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--apple-gray)' }} />
          <input 
            type="text" 
            placeholder="Busque por nome ou marca..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--apple-light-gray)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 12px 12px 40px',
              color: 'white',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Product List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {products.length === 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--apple-gray)' }}>
            <p>Nenhum produto encontrado.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          {products.map((product, index) => {
            const isLast = products.length === index + 1;
            return (
              <div 
                key={`${product.name}-${index}`} 
                ref={isLast ? lastProductElementRef : null}
                className="card" 
                onClick={() => setSelectedProduct(product)}
                style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  padding: '12px', 
                  marginBottom: 0, 
                  cursor: 'pointer',
                  border: '0.5px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '10px', color: '#333' }}>No img</span>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: 600 }}>{product.name}</h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--apple-gray)' }}>{product.brand}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {product.nutriscore && (
                      <span style={{ 
                        background: getNutriscoreColor(product.nutriscore), 
                        color: 'white', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontSize: '10px', 
                        fontWeight: 900 
                      }}>
                        {product.nutriscore}
                      </span>
                    )}
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--apple-blue)' }}>
                      {product.calories} kcal <span style={{ fontSize: '10px', fontWeight: 400, color: 'var(--apple-gray)' }}>/ 100g</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Loader2 className="animate-spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        )}
      </div>

      {/* Footer with Scan Button */}
      <div style={{ padding: '20px', background: 'var(--apple-bg)', borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={() => setIsScannerOpen(true)}
          className="btn-primary" 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Scan size={20} />
          Escanear Alimento
        </button>
      </div>

      {/* Overlays */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <ProductPreview 
            product={selectedProduct}
            onConfirm={(p) => {
              onSelectProduct(p);
              onClose();
            }}
            onCancel={() => setSelectedProduct(null)}
          />
        </div>
      )}

      <ScannerModal 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onProductDetected={(p) => {
          setSelectedProduct(p);
          setIsScannerOpen(false);
        }}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CatalogModal;
