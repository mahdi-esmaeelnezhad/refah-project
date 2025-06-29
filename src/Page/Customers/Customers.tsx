import React, { useState, useMemo } from "react";
// import { useShopItems } from "../../endpoint/product/product";
import { Button } from "../../Components/Ui/Button/button";
import filterIcon from "../../assets/filter.svg";
import Input from "../../Components/Ui/Input/input";
import productLabel from "../../assets/productLabel.svg";
import addIcon from "../../assets/add.svg";
import arrowDownn from "../../assets/arrow-down.svg";
import Pagination from "../../Components/Pagination/Pagination";
import CustomerDefinitionModal from "../../Components/Modal/CustomerDefinitionModal";

interface Item {
  id: number;
  customerName: string;
  mobile: string;
  email: string;
  address: string;
  state: boolean;
  country: string;
  postalCode: string;
  city: string;
  factorCount: number;
  totalAmount: number;
  totalDiscount: number;
  totalPaid: number;
  totalDue: number;
}

const pageSize = 20;

const Customers: React.FC = () => {
  const [allFinalData] = useState<Item[]>(
    [...Array(150)].map((_, index) => ({
      id: index + 1,
      customerName: Math.random().toString(36).substring(2, 15) + " امین خانی",
      mobile: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      email: Math.random().toString(36).substring(2, 15) + "@test.com",
      address: Math.random().toString(36).substring(2, 15) + " خیابان",
      state: Math.random() > 0.5,
      country: Math.random().toString(36).substring(2, 15) + " کشور",
      postalCode: Math.floor(
        1000000000 + Math.random() * 9000000000
      ).toString(),
      city: Math.random().toString(36).substring(2, 15) + " شهر",
      factorCount: Math.floor(1 + Math.random() * 100),
      totalAmount: Math.floor(1000000 + Math.random() * 9000000),
      totalDiscount: Math.floor(10000 + Math.random() * 90000),
      totalPaid: Math.floor(1000000 + Math.random() * 9000000),
      totalDue: Math.floor(1000000 + Math.random() * 9000000),
    }))
  );
  const [items, setItems] = useState<Item[]>(allFinalData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCustomerDefinitionModalOpen, setIsCustomerDefinitionModalOpen] =
    useState(false);

  const totalPages = Math.ceil(items.length / pageSize);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSeachCustomer = (value: string) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setItems(allFinalData);
    } else {
      const searchData = allFinalData.filter((item) => {
        const customerName = item.customerName.toLowerCase();
        const mobile = item.mobile;
        const searchValue = value.toLowerCase();

        return (
          customerName.includes(searchValue) || mobile.includes(searchValue)
        );
      });
      setItems(searchData);
    }
    setCurrentPage(1);
  };

  const handleAddCustomer = (customerData: any) => {
    // Handle adding new customer
    console.log("New customer data:", customerData);
    // You can add the customer to your system here
    // For now, we'll add it to the items list
    const newCustomer: Item = {
      id: items.length + 1,
      customerName: customerData.name,
      mobile: customerData.phone,
      email: customerData.email || "",
      address: customerData.address || "",
      state: false,
      country: "",
      postalCode: "",
      city: "",
      factorCount: 0,
      totalAmount: 0,
      totalDiscount: 0,
      totalPaid: 0,
      totalDue: 0,
    };
    setItems((prev) => [newCustomer, ...prev]);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center mb-4">
          <img src={productLabel} alt="" />
          <span
            className="text-black mr-2"
            style={{ fontSize: "30px", fontWeight: 500 }}
          >
            مشتریان -
          </span>
          <span style={{ fontSize: "23px", fontWeight: 400, color: "#7E7E7E" }}>
            {items?.length || 0} عدد مشتری
          </span>
        </div>
        <img
          src={arrowDownn}
          style={{
            transition: "transform 0.2s",
          }}
          alt="arrow"
        />
      </div>
      <div className="flex justify-between">
        <Input
          type="text"
          width={"603px"}
          height={50}
          placeholder="نام مشتری یا تلفن همراه را وارد کنید"
          placeholderStyle={{
            fontSize: "19px",
            color: "#7E7E7E",
            fontWeight: "400",
          }}
          onChange={(e) => handleSeachCustomer(e.target.value)}
          style={{
            borderRadius: "55px",
            backgroundColor: "#fff",
            border: "2px solid #7485E5",
            marginBottom: "5px",
            marginLeft: "15px",
          }}
          value={searchTerm}
        />
        <Button
          label="فیلتر"
          color="#7485E5"
          radius={15}
          style={{
            width: "175px",
            height: "50px",
            marginLeft: "15px",
            position: "relative",
          }}
          //   onClick={() => setShowFilter((prev) => !prev)}
        >
          <img
            src={filterIcon}
            style={{ position: "relative", bottom: "25px", right: "13px" }}
          />
          <img
            src={arrowDownn}
            style={{
              position: "relative",
              bottom: "48px",
              right: "108px",
              transition: "transform 0.2s",
              //   transform: showFilter ? "rotate(180deg)" : "rotate(0deg)",
            }}
            alt="arrow"
          />
        </Button>
        <Button
          label=""
          color="#7485E5"
          radius={15}
          style={{ width: "175px", height: "50px" }}
          onClick={() => setIsCustomerDefinitionModalOpen(true)}
        >
          <span style={{ position: "relative", left: "-15px" }}>
            افزودن مشتری
          </span>
          <img
            src={addIcon}
            style={{ position: "relative", bottom: "30px", left: "5px" }}
          />
        </Button>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <section className="w-full text-right mt-8 flex flex-col gap-2 overflow-y-auto">
        <div className="flex justify-between">
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[50px]">
            #
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[400px]">
            نام مشتری
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[400px]">
            تلفن همراه
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[350px]">
            تعداد فاکتور
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[200px]">
            وضعیت بدهی
          </div>
        </div>
        <section
          className="overflow-y-auto relative"
          style={{ maxHeight: 600 }}
        >
          {paginatedItems && paginatedItems.length > 0 ? (
            paginatedItems.map((item, index) => (
              <div key={item.id} style={{ position: "relative" }}>
                <div
                  className={`flex justify-between py-1 font-21 ${
                    (index + 1) % 2 === 1 ? "bg-our-choice-200 rounded-md" : ""
                  }`}
                >
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[50px]">
                    {(currentPage - 1) * pageSize + index + 1}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[400px]">
                    {item.customerName}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[400px]">
                    {item.mobile}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[350px]">
                    {item.factorCount}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[200px]">
                    {item.totalDue > 0 ? "بدهکار" : "تسویه"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-full text-gray-500">
              {items.length === 0 ? "هیچ مشتری یافت نشد" : "در حال بارگذاری..."}
            </div>
          )}
        </section>
      </section>

      <CustomerDefinitionModal
        isOpen={isCustomerDefinitionModalOpen}
        onClose={() => setIsCustomerDefinitionModalOpen(false)}
        onAdd={handleAddCustomer}
      />
    </>
  );
};

export default Customers;
