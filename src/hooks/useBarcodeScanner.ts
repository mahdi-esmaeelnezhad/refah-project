import { useEffect, useRef, useState, useCallback } from "react";

interface UseBarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
  enabled?: boolean;
}

export const useBarcodeScanner = ({
  onBarcodeScanned,
  enabled = true,
}: UseBarcodeScannerProps) => {
  const [isListening, setIsListening] = useState(false);
  const bufferRef = useRef("");
  const lastKeyTimeRef = useRef(0);
  const scanStartTimeRef = useRef(0);
  const onBarcodeScannedRef = useRef(onBarcodeScanned);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // تنظیمات
  const MIN_BARCODE_LENGTH = 4;
  const MAX_BARCODE_LENGTH = 50;
  const MAX_SCAN_DURATION = 200; // حداکثر زمان یک اسکن (ms)
  const GAP_BETWEEN_SCANS = 100; // فاصله بین دو اسکن (ms)

  useEffect(() => {
    onBarcodeScannedRef.current = onBarcodeScanned;
  }, [onBarcodeScanned]);

  const flushBuffer = useCallback(() => {
    if (
      bufferRef.current.length >= MIN_BARCODE_LENGTH &&
      bufferRef.current.length <= MAX_BARCODE_LENGTH
    ) {
      onBarcodeScannedRef.current(bufferRef.current);
    }
    bufferRef.current = "";
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      const now = Date.now();

      // اگر فاصله زمانی بین دو کلید بیشتر از GAP_BETWEEN_SCANS بود → اسکن جدید
      if (now - lastKeyTimeRef.current > GAP_BETWEEN_SCANS) {
        flushBuffer();
        scanStartTimeRef.current = now;
      }

      lastKeyTimeRef.current = now;

      if (event.key.length === 1) {
        bufferRef.current += event.key;
      }

      if (event.key === "Enter") {
        flushBuffer();
        event.preventDefault();
        return;
      }

      // اگر طول یا زمان اسکن بیش از حد شد → پردازش
      if (
        bufferRef.current.length >= MAX_BARCODE_LENGTH ||
        (scanStartTimeRef.current &&
          now - scanStartTimeRef.current > MAX_SCAN_DURATION)
      ) {
        flushBuffer();
      }

      // پاک‌سازی با تاخیر کوتاه
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        flushBuffer();
      }, GAP_BETWEEN_SCANS);
    },
    [enabled, flushBuffer]
  );

  useEffect(() => {
    if (enabled && !isListening) {
      document.addEventListener("keydown", handleKeyDown);
      setIsListening(true);
    }
    return () => {
      if (isListening) {
        document.removeEventListener("keydown", handleKeyDown);
        setIsListening(false);
        bufferRef.current = "";
      }
    };
  }, [enabled, isListening, handleKeyDown]);

  return { isListening };
};
