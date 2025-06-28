import React, { useState, useMemo } from "react";
import deliveryIcon from "../../assets/delivery.svg";
import arrowDownn from "../../assets/arrow-down.svg";
import Input from "../../Components/Ui/Input/input";
import mapIcon from "../../assets/map.svg";

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
  const [deliveries] = useState<DeliveryItem[]>([
    {
      id: 1,
      deliveryType: "فروشگاه",
      phoneNumber: "09123456789",
      trackingNumber: "",
      time: "14:30",
      customerName: "علی محمدی",
      customerPhone: "09187654321",
      address: "تهران، خیابان ولیعصر، پلاک 123، طبقه 2",
      status: "آماده ارسال",
    },
    {
      id: 2,
      deliveryType: "تیپاکس",
      phoneNumber: "",
      trackingNumber: "TP123456789",
      time: "15:45",
      customerName: "مریم حسینی",
      customerPhone: "09351234567",
      address: "اصفهان، خیابان چهارباغ، پلاک 456، واحد 5",
      status: "ارسال شده",
    },
    {
      id: 3,
      deliveryType: "فروشگاه",
      phoneNumber: "09987654321",
      trackingNumber: "",
      time: "16:20",
      customerName: "احمد رضایی",
      customerPhone: "09123456789",
      address: "مشهد، خیابان امام رضا، پلاک 789، طبقه 1",
      status: "تحویل داده شده",
    },
    {
      id: 4,
      deliveryType: "تیپاکس",
      phoneNumber: "",
      trackingNumber: "TP987654321",
      time: "17:10",
      customerName: "فاطمه کریمی",
      customerPhone: "09387654321",
      address: "شیراز، خیابان زند، پلاک 321، واحد 3",
      status: "آماده ارسال",
    },
    {
      id: 5,
      deliveryType: "فروشگاه",
      phoneNumber: "09111111111",
      trackingNumber: "",
      time: "18:00",
      customerName: "محمد احمدی",
      customerPhone: "09222222222",
      address: "تبریز، خیابان امام، پلاک 654، طبقه 4",
      status: "ارسال شده",
    },
  ]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "آماده ارسال":
        return "#FF7E20";
      case "ارسال شده":
        return "#38A6FF";
      case "تحویل داده شده":
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
                  {delivery.customerPhone}
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
                    {delivery.address}
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
                <div
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
                  }}
                >
                  {delivery.status}
                </div>
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
