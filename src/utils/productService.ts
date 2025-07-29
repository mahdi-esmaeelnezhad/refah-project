interface ProductItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  brandId: string;
  categoryName: string;
  brandName: string;
  sku: string;
  unitType: string;
  onlineStockThreshold: number;
  discount?: number;
  govId: string;
  vatRate: string;
  isAvailable: boolean;
}

export const findProductBySku = (sku: string): ProductItem | null => {
  try {
    
    // از localStorage محصولات را دریافت کن
    const cachedProducts = localStorage.getItem('finalDataStorage');
    if (!cachedProducts) {
      console.warn('No cached products found');
      return null;
    }

    const products: ProductItem[] = JSON.parse(cachedProducts);
    
    // محصول را بر اساس SKU پیدا کن
    const product = products.find(p => p.sku === sku);
    
    if (product) {
      console.log('Product found:', product);
      return product;
    } else {
      console.warn(`Product with SKU ${sku} not found`);
      return null;
    }
  } catch (error) {
    console.error('Error finding product by SKU:', error);
    return null;
  }
};

export const findProductByBarcode = (barcode: string): ProductItem | null => {
  console.log("barcode", barcode);
  
  try {
    const cachedProducts = localStorage.getItem('finalDataStorage');
    if (!cachedProducts) {
      console.warn('No cached products found');
      return null;
    }

    const products: ProductItem[] = JSON.parse(cachedProducts);
    
    let product = products.find(p => p.sku === barcode);
    
    // if (!product) {
    //   product = products.find(p => p.govId === barcode);
    // }
    
    // if (!product) {
    //   product = products.find(p => p.name.includes(barcode));
    // }
    
    if (product) {
      console.log("cachedProducts", cachedProducts);

      console.log('Product found by barcode:', product);
      return product;
    } else {
      console.warn(`Product with barcode ${barcode} not found`);
      return null;
    }
  } catch (error) {
    console.error('Error finding product by barcode:', error);
    return null;
  }
}; 

// سرویس مدیریت محصولات با کش و به‌روزرسانی ساعتی
export const ProductDataService = {
  // کلیدهای localStorage
  STORAGE_KEYS: {
    FINAL_DATA: "finalDataStorage",
    LAST_UPDATE: "lastProductUpdate",
    CACHE_DURATION: 60 * 60 * 1000, // 1 ساعت به میلی‌ثانیه
  },

  // بررسی نیاز به به‌روزرسانی
  shouldUpdateData(): boolean {
    const lastUpdate = localStorage.getItem(this.STORAGE_KEYS.LAST_UPDATE);
    if (!lastUpdate) return true;

    const lastUpdateTime = parseInt(lastUpdate);
    const currentTime = Date.now();
    const timeDiff = currentTime - lastUpdateTime;

    return timeDiff >= this.STORAGE_KEYS.CACHE_DURATION;
  },

  // دریافت داده‌های محصولات
  getProductData(): any[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.FINAL_DATA);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("خطا در خواندن داده‌های محصولات:", error);
      return [];
    }
  },

  // ذخیره داده‌های محصولات
  setProductData(data: any[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.FINAL_DATA, JSON.stringify(data));
      localStorage.setItem(this.STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
    } catch (error) {
      console.error("خطا در ذخیره داده‌های محصولات:", error);
    }
  },

  // بررسی وجود داده
  hasData(): boolean {
    const data = this.getProductData();
    return data.length > 0;
  },

  // پاک کردن کش
  clearCache(): void {
    localStorage.removeItem(this.STORAGE_KEYS.FINAL_DATA);
    localStorage.removeItem(this.STORAGE_KEYS.LAST_UPDATE);
  },

  // به‌روزرسانی اجباری (برای کالای جدید)
  forceUpdate(): void {
    this.clearCache();
  }
}; 