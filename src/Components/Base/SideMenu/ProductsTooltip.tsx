import React, { useState, useEffect, useRef } from "react";
import Input from "../../Ui/Input/input";
import { SearchIcon } from "../../icons";
import { ProductDataService } from "../../../utils/productService";

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
  const [isLoading, setIsLoading] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Load products when tooltip opens
  useEffect(() => {
    if (isOpen && products.length === 0) {
      const loadProducts = () => {
        setIsLoading(true);
        try {
          // Use setTimeout to prevent blocking the UI
          setTimeout(() => {
            try {
              if (ProductDataService.hasData()) {
                const productsData = ProductDataService.getProductData();
                console.log(productsData, "787");
                setProducts(productsData);
                setFilteredProducts(productsData);
              } else {
                const finalDataStorage =
                  localStorage.getItem("finalDataStorage");
                console.log(finalDataStorage, "88787");

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
          }, 0);
        } catch (error) {
          console.error("خطا در بارگذاری محصولات:", error);
          setProducts([]);
          setFilteredProducts([]);
          setIsLoading(false);
        }
      };
      loadProducts();
    } else if (isOpen && products.length > 0) {
      // If products are already loaded, just set filtered products
      setFilteredProducts(products);
    }
  }, [isOpen, products.length]);

  // Reset search when tooltip closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setFilteredProducts([]);
    }
  }, [isOpen]);

  const handleProductSelect = (product: Product) => {
    onSelectProduct(product);
    setIsOpen(false);
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={tooltipRef}
        className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200"
        style={{ maxHeight: "500px", zIndex: 1000 }}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">محصولات</h3>
          </div>
          <div className="relative">
            <Input
              placeholder="جستجو در محصولات..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);

                if (value.trim() === "") {
                  setFilteredProducts(products);
                } else {
                  const filtered = products.filter(
                    (product) =>
                      product.name
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                      (product.barcode && product.barcode.includes(value)) ||
                      (product.sku && product.sku.includes(value))
                  );
                  setFilteredProducts(filtered);
                }
              }}
              icon={<SearchIcon />}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              در حال بارگذاری محصولات...
              <div className="mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="mb-3">
                {searchTerm ? "محصولی یافت نشد" : "هیچ محصولی موجود نیست"}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors"
              >
                بستن
              </button>
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
        <div className="p-3 border-t border-gray-200">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductsTooltip;
