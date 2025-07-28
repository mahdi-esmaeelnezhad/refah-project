import { useEffect, useState, useCallback, useRef } from 'react';

interface UseBarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
  enabled?: boolean;
}

export const useBarcodeScanner = ({ onBarcodeScanned, enabled = true }: UseBarcodeScannerProps) => {
  const [isListening, setIsListening] = useState(false);
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  const lastKeyTimeRef = useRef(0);
  const bufferTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingRef = useRef(false);

  const clearBuffer = useCallback(() => {
    setBarcodeBuffer('');
    if (bufferTimeoutRef.current) {
      clearTimeout(bufferTimeoutRef.current);
      bufferTimeoutRef.current = null;
    }
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled || isProcessingRef.current) return;

    const currentTime = Date.now();
    
    // کاهش فاصله زمانی به 50ms برای سرعت بیشتر
    if (currentTime - lastKeyTimeRef.current > 50) {
      clearBuffer();
    }
    
    lastKeyTimeRef.current = currentTime;

    // اگر کلید Enter فشرده شد، بارکد کامل شده
    if (event.key === 'Enter') {
      if (barcodeBuffer.length > 0) {
        isProcessingRef.current = true;
        onBarcodeScanned(barcodeBuffer);
        clearBuffer();
        // جلوگیری از submit فرم
        event.preventDefault();
        
        // کاهش تاخیر به 50ms برای سرعت بیشتر
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 50);
      }
      return;
    }

    // فقط کاراکترهای مجاز را اضافه کن
    if (/^[a-zA-Z0-9\-_]$/.test(event.key)) {
      setBarcodeBuffer(prev => {
        const newBuffer = prev + event.key;
        
        // اگر بافر خیلی طولانی شد، آن را پاک کن
        if (newBuffer.length > 50) {
          return event.key;
        }
        
        return newBuffer;
      });
    }
  }, [enabled, onBarcodeScanned, barcodeBuffer, clearBuffer]);

  useEffect(() => {
    if (enabled && !isListening) {
      document.addEventListener('keydown', handleKeyPress);
      setIsListening(true);
    }

    return () => {
      if (isListening) {
        document.removeEventListener('keydown', handleKeyPress);
        setIsListening(false);
        clearBuffer();
      }
    };
  }, [enabled, isListening, handleKeyPress, clearBuffer]);

  // پاک کردن بافر بعد از مدتی عدم فعالیت - کاهش به 500ms
  useEffect(() => {
    if (barcodeBuffer.length > 0) {
      bufferTimeoutRef.current = setTimeout(() => {
        clearBuffer();
      }, 500);
    }

    return () => {
      if (bufferTimeoutRef.current) {
        clearTimeout(bufferTimeoutRef.current);
      }
    };
  }, [barcodeBuffer, clearBuffer]);

  return {
    isListening,
    barcodeBuffer,
    clearBuffer
  };
}; 