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
  
  // تنظیمات بهینه‌سازی شده برای دستگاه‌های اندروید قدیمی
  const ANDROID_OPTIMIZATION = {
    // افزایش فاصله زمانی بین کلیدها برای دستگاه‌های کند
    KEY_INTERVAL_THRESHOLD: 500, // از 150ms به 500ms افزایش یافت
    // کاهش تاخیر پردازش خودکار
    AUTO_PROCESS_DELAY: 100, // از 300ms به 100ms کاهش یافت
    // افزایش زمان پاک کردن بافر
    BUFFER_CLEAR_DELAY: 2000, // از 1500ms به 2000ms افزایش یافت
    // کاهش تاخیر پردازش
    PROCESSING_DELAY: 100, // از 300ms به 100ms کاهش یافت
  };

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
    
    // اگر فاصله زمانی بین کلیدها بیشتر از آستانه باشد، بافر را پاک کن
    // برای دستگاه‌های اندروید قدیمی، آستانه افزایش یافته است
    if (currentTime - lastKeyTimeRef.current > ANDROID_OPTIMIZATION.KEY_INTERVAL_THRESHOLD) {
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
        
        // کاهش تاخیر برای سرعت بیشتر
        setTimeout(() => {
          isProcessingRef.current = false;
        }, ANDROID_OPTIMIZATION.PROCESSING_DELAY);
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
          
          // تنظیم تایمر جدید برای پردازش خودکار - کاهش تاخیر
          autoProcessTimeoutRef.current = setTimeout(() => {
            if (barcodeBuffer === newBuffer && !isProcessingRef.current) {
              isProcessingRef.current = true;
              onBarcodeScanned(newBuffer);
              clearBuffer();
              setTimeout(() => {
                isProcessingRef.current = false;
              }, ANDROID_OPTIMIZATION.PROCESSING_DELAY);
            }
          }, ANDROID_OPTIMIZATION.AUTO_PROCESS_DELAY);
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

  // پاک کردن بافر بعد از مدتی عدم فعالیت - افزایش برای دستگاه‌های اندروید قدیمی
  useEffect(() => {
    if (barcodeBuffer.length > 0) {
      bufferTimeoutRef.current = setTimeout(() => {
        clearBuffer();
      }, ANDROID_OPTIMIZATION.BUFFER_CLEAR_DELAY);
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