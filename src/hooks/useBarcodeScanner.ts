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
  const barcodeStartTimeRef = useRef(0);
  const autoProcessTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearBuffer = useCallback(() => {
    setBarcodeBuffer('');
    if (bufferTimeoutRef.current) {
      clearTimeout(bufferTimeoutRef.current);
      bufferTimeoutRef.current = null;
    }
    if (autoProcessTimeoutRef.current) {
      clearTimeout(autoProcessTimeoutRef.current);
      autoProcessTimeoutRef.current = null;
    }
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled || isProcessingRef.current) return;

    const currentTime = Date.now();
    
    // اگر فاصله زمانی بین کلیدها بیشتر از 150ms باشد، بافر را پاک کن
    // این کار از اتصال بارکدهای مختلف جلوگیری می‌کند
    if (currentTime - lastKeyTimeRef.current > 150) {
      clearBuffer();
      barcodeStartTimeRef.current = currentTime;
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
        
        // افزایش تاخیر به 300ms برای اطمینان از عدم تداخل
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 300);
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
        
        // اگر بارکد به طول مناسب رسید، تایمر خودکار را تنظیم کن
        if (newBuffer.length >= 8 && newBuffer.length <= 13) {
          // پاک کردن تایمر قبلی
          if (autoProcessTimeoutRef.current) {
            clearTimeout(autoProcessTimeoutRef.current);
          }
          
          // تنظیم تایمر جدید برای پردازش خودکار
          autoProcessTimeoutRef.current = setTimeout(() => {
            if (barcodeBuffer === newBuffer && !isProcessingRef.current) {
              isProcessingRef.current = true;
              onBarcodeScanned(newBuffer);
              clearBuffer();
              setTimeout(() => {
                isProcessingRef.current = false;
              }, 300);
            }
          }, 300);
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

  // پاک کردن بافر بعد از مدتی عدم فعالیت - افزایش به 1500ms
  useEffect(() => {
    if (barcodeBuffer.length > 0) {
      bufferTimeoutRef.current = setTimeout(() => {
        clearBuffer();
      }, 1500);
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