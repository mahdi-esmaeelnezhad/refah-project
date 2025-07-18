import { useEffect, useState, useCallback } from 'react';

interface UseBarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
  enabled?: boolean;
}

export const useBarcodeScanner = ({ onBarcodeScanned, enabled = true }: UseBarcodeScannerProps) => {
  const [isListening, setIsListening] = useState(false);
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  const [lastKeyTime, setLastKeyTime] = useState(0);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const currentTime = Date.now();
    
    // اگر فاصله زمانی بین کلیدها بیشتر از 50ms باشد، بافر را پاک کن
    if (currentTime - lastKeyTime > 50) {
      setBarcodeBuffer('');
    }
    
    setLastKeyTime(currentTime);

    // اگر کلید Enter فشرده شد، بارکد کامل شده
    if (event.key === 'Enter') {
      if (barcodeBuffer.length > 0) {
        onBarcodeScanned(barcodeBuffer);
        setBarcodeBuffer('');
        // جلوگیری از submit فرم
        event.preventDefault();
      }
      return;
    }
    if (/^[a-zA-Z0-9]$/.test(event.key)) {
      setBarcodeBuffer(prev => prev + event.key);
    }
  }, [enabled, onBarcodeScanned, barcodeBuffer, lastKeyTime]);

  useEffect(() => {
    if (enabled && !isListening) {
      document.addEventListener('keydown', handleKeyPress);
      setIsListening(true);
    }

    return () => {
      if (isListening) {
        document.removeEventListener('keydown', handleKeyPress);
        setIsListening(false);
      }
    };
  }, [enabled, isListening, handleKeyPress]);

  return {
    isListening,
    barcodeBuffer,
    clearBuffer: () => setBarcodeBuffer('')
  };
}; 