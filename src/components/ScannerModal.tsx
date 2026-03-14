'use client';

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Loader2 } from 'lucide-react';
import { fetchProductByBarcode } from '@/services/nutritionService';
import { Food } from '@/store/useStore';
import ProductPreview from './ProductPreview';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductDetected: (product: Food) => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose, onProductDetected }) => {
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Food | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !scanning) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 150 } },
      /* verbose= */ false
    );

    const onScanSuccess = async (decodedText: string) => {
      console.log(`Scan result: ${decodedText}`);
      scanner.clear();
      setScanning(false);
      setLoading(true);
      setError(null);

      const result = await fetchProductByBarcode(decodedText);
      setLoading(false);
      if (result) {
        setProduct(result);
      } else {
        setError("Produto não encontrado na base de dados.");
      }
    };

    const onScanFailure = (error: any) => {
      // Quietly continue
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, [isOpen, scanning]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white' }}>
          <X size={28} />
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {scanning && (
          <div style={{ width: '100%', background: '#000', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
             <div id="reader" style={{ width: '100%' }}></div>
             <p style={{ textAlign: 'center', color: 'white', padding: '16px', margin: 0, fontSize: '14px' }}>
               Aponte a câmera para o código de barras
             </p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <Loader2 size={48} className="animate-spin" style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
            <p>Buscando informações do produto...</p>
          </div>
        )}

        {product && (
          <ProductPreview 
            product={product} 
            onConfirm={(p) => {
              onProductDetected(p);
              onClose();
            }}
            onCancel={() => {
              setProduct(null);
              setScanning(true);
            }}
          />
        )}

        {error && (
          <div className="card" style={{ padding: '24px', textAlign: 'center', width: '90%' }}>
            <p style={{ color: 'var(--apple-red)', marginBottom: '20px' }}>{error}</p>
            <button className="btn-primary" onClick={() => {
              setError(null);
              setScanning(true);
            }} style={{ width: '100%' }}>
              Tentar Novamente
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        #reader__dashboard_section_csr button {
          background: var(--apple-blue);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          margin: 10px;
          font-weight: 600;
        }
        #reader__camera_selection {
          background: #333;
          color: white;
          border-radius: 8px;
          padding: 8px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default ScannerModal;
