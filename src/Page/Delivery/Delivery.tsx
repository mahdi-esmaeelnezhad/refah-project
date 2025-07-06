import React, { useState, useMemo, useEffect } from "react";
import deliveryIcon from "../../assets/delivery.svg";
import arrowDownn from "../../assets/arrow-down.svg";
import Input from "../../Components/Ui/Input/input";
import mapIcon from "../../assets/map.svg";

interface PaykInvoice {
  id: number;
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    id: number;
    name: string;
    quantity: string;
    unit: string;
    price: number;
    discount: number | string;
    total: number;
  }>;
  totalAmount: number;
  totalDiscount: number;
  finalAmount: number;
  paymentMethod: string;
  deliveryMethod: string;
  courier: {
    type: string;
    name: string;
  };
  status: "pending" | "delivered" | "cancelled";
  createdAt: string;
}

interface DeliveryItem {
  id: number;
  deliveryType: "فروشگاه" | "تیپاکس";
  phoneNumber: string;
  trackingNumber: string;
  time: string;
  customerName: string;
  customerPhone: string;
  address: string;
  status: "آماده ارسال" | "ارسال شده" | "تحویل داده شده";
}

const pageSize = 20;

const Delivery: React.FC = () => {
  const [paykInvoices, setPaykInvoices] = useState<PaykInvoice[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);

  // Load payk invoices from localStorage
  useEffect(() => {
    const loadPaykInvoices = () => {
      try {
        const savedInvoices = JSON.parse(
          localStorage.getItem("paykInvoices") || "[]"
        );
        setPaykInvoices(savedInvoices);

        // Convert payk invoices to delivery items format
        const convertedDeliveries: DeliveryItem[] = savedInvoices.map(
          (invoice: PaykInvoice) => ({
            id: invoice.id,
            deliveryType: invoice.courier.type === "tpx" ? "تیپاکس" : "فروشگاه",
            phoneNumber:
              invoice.courier.type === "tpx" ? "" : invoice.courier.name,
            trackingNumber:
              invoice.courier.type === "tpx" ? `TP${invoice.id}` : "",
            time: new Date(invoice.date).toLocaleTimeString("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            customerName: invoice.customer.name,
            customerPhone: invoice.customer.phone,
            address: invoice.customer.address,
            status:
              invoice.status === "pending"
                ? "آماده ارسال"
                : invoice.status === "delivered"
                ? "تحویل داده شده"
                : "ارسال شده",
          })
        );

        setDeliveries(convertedDeliveries);
      } catch (error) {
        console.error("Error loading payk invoices:", error);
      }
    };

    loadPaykInvoices();

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      loadPaykInvoices();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDeliveries = useMemo(() => {
    if (!searchTerm.trim()) return deliveries;

    return deliveries.filter(
      (delivery) =>
        delivery.customerName.includes(searchTerm) ||
        delivery.customerPhone.includes(searchTerm)
    );
  }, [deliveries, searchTerm]);

  const totalPages = Math.ceil(filteredDeliveries.length / pageSize);

  const paginatedDeliveries = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDeliveries.slice(startIndex, startIndex + pageSize);
  }, [filteredDeliveries, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (
    deliveryId: number,
    newStatus: "آماده ارسال" | "ارسال شده" | "تحویل داده شده"
  ) => {
    // Update local state
    const updatedDeliveries = deliveries.map((delivery) =>
      delivery.id === deliveryId ? { ...delivery, status: newStatus } : delivery
    );
    setDeliveries(updatedDeliveries);

    // Update localStorage
    const updatedPaykInvoices = paykInvoices.map((invoice) => {
      if (invoice.id === deliveryId) {
        const newPaykStatus: "pending" | "delivered" | "cancelled" =
          newStatus === "آماده ارسال"
            ? "pending"
            : newStatus === "تحویل داده شده"
            ? "delivered"
            : "cancelled";
        return { ...invoice, status: newPaykStatus };
      }
      return invoice;
    });

    setPaykInvoices(updatedPaykInvoices);
    localStorage.setItem("paykInvoices", JSON.stringify(updatedPaykInvoices));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "آماده ارسال":
        return "#FF7E20";
      case "ارسال شده":
        return "#38A6FF";
      case "تحویل داده شده":
        return "#3BBB2A";
      case "pending":
        return "#FF7E20";
      case "cancelled":
        return "#38A6FF";
      case "delivered":
        return "#3BBB2A";
      default:
        return "#FF7E20";
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center mb-2">
          <img src={deliveryIcon} alt="" />
          <span
            className="text-black mr-2"
            style={{ fontSize: "30px", fontWeight: 500 }}
          >
            ارسال با پیک -
          </span>
          <span style={{ fontSize: "23px", fontWeight: 400, color: "#7E7E7E" }}>
            {filteredDeliveries.length} سفارش
          </span>
        </div>
        <img
          src={arrowDownn}
          style={{
            transition: "transform 0.2s",
          }}
          alt="arrow"
        />

        <div className=" mb-4">
          <Input
            type="text"
            width={"603px"}
            height={52}
            placeholder="جستجو بر اساس نام یا شماره تلفن مشتری"
            placeholderStyle={{
              fontSize: "19px",
              color: "#7E7E7E",
              fontWeight: "400",
            }}
            onChange={(e) => handleSearch(e.target.value)}
            value={searchTerm}
            style={{
              borderRadius: "55px",
              backgroundColor: "#fff",
              border: "2px solid #7485E5",
              marginBottom: "5px",
              marginLeft: "15px",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-6 overflow-y-auto h-[650px]">
        {paginatedDeliveries.map((delivery) => (
          <div
            key={delivery.id}
            style={{
              width: "1505px",
              height: "220px",
              backgroundColor: "#EFEFEF",
              borderRadius: "15px",
              padding: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "23px", fontWeight: 500 }}>
                  ارسال از طریق ({delivery.deliveryType})
                </span>
                <div
                  style={{
                    backgroundColor: "#7485E5",
                    borderRadius: "53px",
                    padding: "8px 16px",
                    color: "white",
                    fontSize: "23px",
                    fontWeight: 500,
                  }}
                >
                  {delivery.deliveryType === "فروشگاه"
                    ? delivery.phoneNumber
                    : delivery.trackingNumber}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span style={{ fontSize: "23px", fontWeight: 500 }}>ساعت</span>
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "55px",
                    width: "120px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "23px",
                    fontWeight: 500,
                    color: "black",
                  }}
                >
                  {delivery.time}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span style={{ fontSize: "23px", fontWeight: 500 }}>
                  به مشتری:
                </span>
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "55px",
                    width: "217px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "23px",
                    fontWeight: 500,
                    color: "black",
                  }}
                >
                  {delivery.customerName}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span style={{ fontSize: "23px", fontWeight: 500 }}>
                  شماره تلفن:
                </span>

                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "55px",
                    width: "217px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "23px",
                    fontWeight: 500,
                    color: "black",
                  }}
                >
                  {delivery.customerPhone || " ثبت نشده است"}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span style={{ fontSize: "23px", fontWeight: 500 }}>آدرس:</span>
                <div
                  style={{
                    width: "700px",
                    height: "52px",
                    backgroundColor: "white",
                    borderRadius: "55px",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "23px",
                      fontWeight: 500,
                      color: "black",
                    }}
                  >
                    {delivery.address || "آدرسی ثبت نشده است"}
                  </span>
                </div>
                <img
                  src={mapIcon}
                  alt="map"
                  style={{ width: "35px", height: "35px" }}
                />
              </div>

              <div className="flex items-center gap-3">
                <span style={{ fontSize: "23px", fontWeight: 500 }}>
                  وضعیت:
                </span>
                <select
                  value={delivery.status}
                  onChange={(e) =>
                    handleStatusChange(delivery.id, e.target.value as any)
                  }
                  style={{
                    width: "217px",
                    height: "42px",
                    backgroundColor: getStatusColor(delivery.status),
                    borderRadius: "55px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "23px",
                    fontWeight: 500,
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    padding: "0 15px",
                  }}
                >
                  <option value="آماده ارسال">آماده ارسال</option>
                  <option value="ارسال شده">ارسال شده</option>
                  <option value="تحویل داده شده">تحویل داده شده</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: currentPage === page ? "#7485E5" : "#EFEFEF",
                  color: currentPage === page ? "white" : "black",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Delivery;
