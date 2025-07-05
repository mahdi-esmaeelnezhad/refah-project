interface InvoiceItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  price: number;
  discount: number | string;
  total: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  debt: number;
}

interface SavedInvoice {
  id: number;
  invoiceNumber: string;
  date: string;
  customer: Customer;
  items: InvoiceItem[];
  totalAmount: number;
  totalDiscount: number;
  finalAmount: number;
  paymentMethod: string;
  deliveryMethod: string;
  status: string;
}

export const saveInvoice = (invoice: Omit<SavedInvoice, 'id'>): SavedInvoice => {
  try {
    const savedInvoices = getSavedInvoices();
    const newInvoice: SavedInvoice = {
      ...invoice,
      id: Date.now()
    };
    
    savedInvoices.push(newInvoice);
    localStorage.setItem("savedInvoices", JSON.stringify(savedInvoices));
    
    updateSavedInvoices();
    
    return newInvoice;
  } catch (error) {
    console.error("خطا در ذخیره فاکتور:", error);
    throw error;
  }
};

export const getSavedInvoices = (): SavedInvoice[] => {
  try {
    return JSON.parse(localStorage.getItem("savedInvoices") || "[]");
  } catch (error) {
    console.error("خطا در دریافت فاکتورهای ذخیره شده:", error);
    return [];
  }
};

export const deleteInvoice = (invoiceId: number): boolean => {
  try {
    const savedInvoices = getSavedInvoices();
    const filteredInvoices = savedInvoices.filter(invoice => invoice.id !== invoiceId);
    localStorage.setItem("savedInvoices", JSON.stringify(filteredInvoices));
    updateSavedInvoices();
    return true;
  } catch (error) {
    console.error("خطا در حذف فاکتور:", error);
    return false;
  }
};

export const deleteInvoiceByNumber = (invoiceNumber: string): boolean => {
  try {
    const savedInvoices = getSavedInvoices();
    const filteredInvoices = savedInvoices.filter(
      (invoice: SavedInvoice) => invoice.invoiceNumber !== invoiceNumber
    );
    localStorage.setItem("savedInvoices", JSON.stringify(filteredInvoices));
    updateSavedInvoices();
    return true;
  } catch (error) {
    console.error("خطا در حذف فاکتور:", error);
    return false;
  }
};

export const getNextInvoiceNumber = (): string => {
  try {
    const savedInvoices = getSavedInvoices();
    return (savedInvoices.length + 1).toString();
  } catch (error) {
    console.error("خطا در تولید شماره فاکتور:", error);
    return "1";
  }
};

export const updateSavedInvoices = () => {
  const event = new CustomEvent('invoicesUpdated');
  window.dispatchEvent(event);
}; 