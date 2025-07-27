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