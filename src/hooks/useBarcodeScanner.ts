import { useEffect, useState, useCallback, useRef, useMemo } from 'react';

interface UseBarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
  enabled?: boolean;
}

export const useBarcodeScanner = ({ onBarcodeScanned, enabled = true }: UseBarcodeScannerProps) => {
  const [isListening, setIsListening] = useState(false);
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  const lastKeyTimeRef = useRef(0);
  const lastBarcodeRef = useRef<string>('');
  const consecutiveScanCountRef = useRef(0);
  const lastScanTimeRef = useRef(0);
  const onBarcodeScannedRef = useRef(onBarcodeScanned);
  
  // تنظیمات بهینه‌سازی برای دستگاه‌های کند - استفاده از useMemo برای جلوگیری از re-creation
  const SCANNER_OPTIMIZATION = useMemo(() => ({
    MIN_BARCODE_LENGTH: 8, // حداقل طول بارکد
    MAX_BARCODE_LENGTH: 50, // حداکثر طول بارکد
    CONSECUTIVE_SCAN_THRESHOLD: 300, // آستانه برای تشخیص اسکن‌های پشت سر هم (میلی‌ثانیه)
    PROCESSING_DELAY: 20, // تاخیر پردازش (کاهش یافته)
    SLOW_DEVICE_THRESHOLD: 1000, // آستانه برای تشخیص دستگاه کند (میلی‌ثانیه)
    MAX_PENDING_BARCODES: 10, // حداکثر تعداد بارکدهای در انتظار
  }), []);

  // به‌روزرسانی ref برای جلوگیری از re-render
  useEffect(() => {
    onBarcodeScannedRef.current = onBarcodeScanned;
  }, [onBarcodeScanned]);

  const clearBuffer = useCallback(() => {
    setBarcodeBuffer('');
  }, []);



  const processBarcode = useCallback((barcode: string) => {
    if (!barcode || barcode.length < SCANNER_OPTIMIZATION.MIN_BARCODE_LENGTH) {
      return;
    }

    const currentTime = Date.now();
    const timeSinceLastScan = currentTime - lastScanTimeRef.current;
    
    // بررسی اسکن‌های پشت سر هم
    if (barcode === lastBarcodeRef.current && timeSinceLastScan < SCANNER_OPTIMIZATION.CONSECUTIVE_SCAN_THRESHOLD) {
      consecutiveScanCountRef.current++;
      
      // اگر بیش از 3 بار پشت سر هم اسکن شد، فقط یک بار پردازش کن
      if (consecutiveScanCountRef.current > 3) {
        console.log(`اسکن پشت سر هم ${consecutiveScanCountRef.current} بارکد ${barcode} - نادیده گرفته شد`);
        return;
      }
    } else {
      consecutiveScanCountRef.current = 1;
    }

    // برای دستگاه‌های کند، اگر فاصله بین اسکن‌ها زیاد است، تاخیر اضافه کن
    if (timeSinceLastScan > SCANNER_OPTIMIZATION.SLOW_DEVICE_THRESHOLD) {
      setTimeout(() => {
        onBarcodeScannedRef.current(barcode);
      }, 50);
    } else {
      onBarcodeScannedRef.current(barcode);
    }

    lastBarcodeRef.current = barcode;
    lastScanTimeRef.current = currentTime;
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const currentTime = Date.now();
    
    // اگر فاصله زمانی بین کلیدها خیلی زیاد باشد، بافر را پاک کن
    if (currentTime - lastKeyTimeRef.current > 2000) {
      setBarcodeBuffer('');
    }
    
    lastKeyTimeRef.current = currentTime;

    // تشخیص پایان بارکد با \n (newline) یا Enter
    if (event.key === 'Enter' || event.key === '\n') {
      setBarcodeBuffer(currentBuffer => {
        if (currentBuffer.length >= SCANNER_OPTIMIZATION.MIN_BARCODE_LENGTH) {
          // حذف \n از انتهای بارکد
          const cleanBarcode = currentBuffer.replace(/\n$/, '');
          processBarcode(cleanBarcode);
          
          // جلوگیری از submit فرم
          event.preventDefault();
          
          return '';
        } else {
          // اگر بارکد خیلی کوتاه است، فقط بافر را پاک کن
          return '';
        }
      });
      return;
    }

    // فقط کاراکترهای مجاز را اضافه کن - با throttle برای بهبود performance
    if (/^[a-zA-Z0-9\-_]$/.test(event.key)) {
      // استفاده از requestAnimationFrame برای بهبود performance
      requestAnimationFrame(() => {
        setBarcodeBuffer(prev => {
          const newBuffer = prev + event.key;
          
          // اگر بافر خیلی طولانی شد، آن را پاک کن
          if (newBuffer.length > SCANNER_OPTIMIZATION.MAX_BARCODE_LENGTH) {
            return event.key;
          }
          
          return newBuffer;
        });
      });
    }
  }, [enabled, processBarcode, SCANNER_OPTIMIZATION]);

  // اضافه کردن event listener برای keyup که برای برخی بارکد اسکنرها بهتر کار می‌کند
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // تشخیص پایان بارکد با \n (newline) یا Enter در keyup
    if (event.key === 'Enter' || event.key === '\n') {
      setBarcodeBuffer(currentBuffer => {
        if (currentBuffer.length >= SCANNER_OPTIMIZATION.MIN_BARCODE_LENGTH) {
          // حذف \n از انتهای بارکد
          const cleanBarcode = currentBuffer.replace(/\n$/, '');
          processBarcode(cleanBarcode);
          
          // جلوگیری از submit فرم
          event.preventDefault();
          
          return '';
        }
        return currentBuffer;
      });
    }
  }, [enabled, processBarcode, SCANNER_OPTIMIZATION]);

  // اضافه کردن event listener برای input که برای برخی بارکد اسکنرها بهتر کار می‌کند
  const handleInput = useCallback((event: InputEvent) => {
    if (!enabled) return;

    // بررسی اینکه آیا input شامل \n است یا نه
    if (event.data && event.data.includes('\n')) {
      const inputValue = event.data.replace(/\n/g, '');
      if (inputValue.length >= SCANNER_OPTIMIZATION.MIN_BARCODE_LENGTH) {
        processBarcode(inputValue);
        setBarcodeBuffer('');
      }
    }
  }, [enabled, processBarcode, SCANNER_OPTIMIZATION]);

  useEffect(() => {
    if (enabled && !isListening) {
      document.addEventListener('keydown', handleKeyPress);
      document.addEventListener('keyup', handleKeyUp);
      document.addEventListener('input', handleInput as EventListener);
      setIsListening(true);
    }

    return () => {
      if (isListening) {
        document.removeEventListener('keydown', handleKeyPress);
        document.removeEventListener('keyup', handleKeyUp);
        document.removeEventListener('input', handleInput as EventListener);
        setIsListening(false);
        setBarcodeBuffer('');
        

      }
    };
  }, [enabled, isListening, handleKeyPress, handleKeyUp, handleInput]);

  // پاک کردن بافر بعد از مدتی عدم فعالیت
  useEffect(() => {
    if (barcodeBuffer.length > 0) {
      const timeoutId = setTimeout(() => {
        setBarcodeBuffer('');
      }, 3000); // 3 ثانیه

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [barcodeBuffer]);

  return {
    isListening,
    barcodeBuffer,
    clearBuffer
  };
}; 