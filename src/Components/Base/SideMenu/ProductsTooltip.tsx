import React, { useState, useEffect } from "react";
import Input from "../../Ui/Input/input";
import { SearchIcon } from "../../icons";
import AddProductModal from "../../Modal/AddProductModal";
import { ProductDataService } from "../../../utils/productService";
// import { useModal } from "../../../hooks/useModal";

interface Product {
  id: string;
  name: string;
  price: number;
  barcode?: string;
  sku?: string;
  unitType?: string;
  discount?: number;
  vatRate?: string;
  govId?: string;
}

interface ProductsTooltipProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelectProduct: (product: Product) => void;
  onOpenAddProduct: () => void;
}

const ProductsTooltip: React.FC<ProductsTooltipProps> = ({
  isOpen,
  setIsOpen,
  onSelectProduct,
  //   onOpenAddProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from localStorage (finalDataStorage)
  useEffect(() => {
    const loadProducts = () => {
      setIsLoading(true);
      try {
        // ابتدا از سرویس استفاده کنیم
        if (ProductDataService.hasData()) {
          const productsData = ProductDataService.getProductData();
          setProducts(productsData);
          setFilteredProducts(productsData);
        } else {
          // اگر سرویس داده ندارد، از localStorage استفاده کنیم
          const finalDataStorage = localStorage.getItem("finalDataStorage");
          if (finalDataStorage) {
            const productsData = JSON.parse(finalDataStorage);
            setProducts(productsData);
            setFilteredProducts(productsData);
          }
        }
      } catch (error) {
        console.error("خطا در بارگذاری محصولات:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    // همیشه محصولات را بارگذاری کن، نه فقط وقتی isOpen تغییر می‌کند
    loadProducts();
  }, [isOpen]); // همچنان isOpen را در dependency قرار می‌دهیم تا در صورت باز شدن مجدد، داده‌ها به‌روزرسانی شوند

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.barcode && product.barcode.includes(searchTerm)) ||
          (product.sku && product.sku.includes(searchTerm))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleProductSelect = (product: Product) => {
    onSelectProduct(product);
    setIsOpen(false);
    setSearchTerm("");
  };

  //   const handleAddProduct = () => {
  //     setIsAddProductModalOpen(true);
  //   };

  const handleAddProductClose = () => {
    setIsAddProductModalOpen(false);
  };

  const handleAddProductSuccess = async () => {
    setIsAddProductModalOpen(false);

    // فراخوانی API گرفتن لیست محصولات و به‌روزرسانی localStorage
    setIsLoading(true);
    try {
      const productList = localStorage.getItem("finalDataStorage");
      setProducts(JSON.parse(productList || "[]"));
      setFilteredProducts(JSON.parse(productList || "[]"));
    } catch (error) {
      console.error("خطا در به‌روزرسانی لیست محصولات:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200"
        style={{ maxHeight: "500px", zIndex: 99999 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">محصولات</h3>
            {/* <button
              onClick={handleAddProduct}
              className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary-dark transition-colors"
            >
              افزودن کالا
            </button> */}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Input
              placeholder="جستجو در محصولات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<SearchIcon />}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Products List */}
        <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              در حال بارگذاری محصولات...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? "محصولی یافت نشد" : "هیچ محصولی موجود نیست"}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 py-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleProductSelect(product)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {product.name}
                      </h4>
                    </div>
                    <div className="text-left ml-3">
                      <p className="font-semibold text-gray-900 text-sm">
                        {product.price.toLocaleString("fa-IR")} ریال
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={handleAddProductClose}
        categories={[]}
        units={[]}
        brands={[]}
        onAdd={handleAddProductSuccess}
      />
    </>
  );
};

export default ProductsTooltip;
