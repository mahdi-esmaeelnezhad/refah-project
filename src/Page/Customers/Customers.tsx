import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import useRequest from "../../hooks/useRequest";
import { PRODUCT_ENDPOINTS } from "../../endpoint/product/product";
import { Button } from "../../Components/Ui/Button/button";
import filterIcon from "../../assets/filter.svg";
import Input from "../../Components/Ui/Input/input";
import productLabel from "../../assets/productLabel.svg";
import addIcon from "../../assets/add.svg";
import arrowDownn from "../../assets/arrow-down.svg";
import optionIcon from "../../assets/option.svg";
import NoShowCustomerModal from "../../Components/Modal/NoShowCategoryModal";
import Pagination from "../../Components/Pagination/Pagination";
import CustomerDefinitionModal from "../../Components/Modal/CustomerDefinitionModal";
import CustomerFilter from "../../Components/CustomerFilter/CustomerFilter";
import Tooltip from "../../Components/Base/SideMenu/Tooltip";
import CustomerOption from "../../Components/CustomerTooltip/CustomerTooltip";
import axios from "axios";
import { useModal } from "../../hooks/useModal";

interface Item {
  id: string;
  displayName: string;
  mobile: string;
  address: string;
  isArchive: boolean;
  nationalCode: number;
  gender: string;
  // subscriptionCode: number;
  // debt: number;
  // maxAllowedDebt: number;
  // email: string;
  // economicCode: string;
  // postalCode: string;
  // customerType: string;
  // merchantId: string;
}

interface CustomerApiResponseShow {
  id: string;
  displayName: string;
  mobile: string;
  address: string;
  debt: number;
  isArchive: boolean;
  subscriptionCode: number;
  nationalCode: number;
  gender: string;
}

interface CustomerApiResponse {
  id: string;
  displayName: string;
  maxAllowedDebt: number;
  mobile: string;
  subscriptionCode: number;
  address: string;
  debt: number;
  isArchive: boolean;
  nationalCode: number;
  gender: string;
}

const pageSize = 20;

const Customers: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const { isOpen, openModal, closeModal } = useModal();

  const {
    execute: fetchCustomers,
    loading: customersLoading,
    error: customersError,
  } = useRequest<{ data: CustomerApiResponse[] }>(
    PRODUCT_ENDPOINTS.customerList,

    "POST",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const { loading: addCustomerLoading, execute: addCustomerHandler } =
    useRequest<{
      data: CustomerApiResponse[];
    }>(PRODUCT_ENDPOINTS.addCustomer, "POST", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  const { execute: editCustomerHandler } = useRequest<{
    data: CustomerApiResponse[];
  }>(PRODUCT_ENDPOINTS.addCustomer, "PUT", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const [allFinalData, setAllFinalData] = useState<CustomerApiResponseShow[]>(
    []
  );
  const [items, setItems] = useState<CustomerApiResponseShow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [openCustomerTooltipId, setOpenCustomerTooltipId] = useState<
    string | null
  >(null);
  // const [isCustomerDefinitionModalOpen, setIsCustomerDefinitionModalOpen] =
  //   useState(false);
  const [deleteCustomer, setDeleteCustomer] =
    useState<CustomerApiResponseShow | null>(null);
  const [editCustomer, setEditCustomer] =
    useState<CustomerApiResponseShow | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // const createSearchPayload = (searchValue: string = "") => {
  //   return {
  //     conditionType: "OR",
  //     conditions: [
  //       {
  //         fieldName: "mobile",
  //         operationType: "LIKE",
  //         values: [searchValue],
  //       },
  //       {
  //         fieldName: "name",
  //         operationType: "LIKE",
  //         values: [searchValue],
  //       },
  //     ],
  //   };
  // };

  const fetchCustomerList = async (searchValue: string = "") => {
    try {
      // const searchPayload = createSearchPayload(searchValue);
      console.log(searchValue, "searchValue");

      const searchPayload = {
        conditionType: "OR",
        conditions: [],
        values: [],
      };
      // const params = "?page=0&size=1000&sort=id,desc";
      const response: any = await fetchCustomers({
        searchPayload,
        page: 1,
        sort: "id,desc",
        size: 10,
      });

      const customers: CustomerApiResponse[] = response.data;

      if (customers) {
        const convertedItems = convertApiDataToItems(customers);
        const nonArchived = convertedItems.filter((item) => !item.isArchive);
        setAllFinalData(nonArchived);
        setItems(nonArchived);
        // Save to localStorage
        localStorage.setItem("customers", JSON.stringify(nonArchived));
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const convertApiDataToItems = (
    apiData: CustomerApiResponse[]
  ): CustomerApiResponseShow[] => {
    return apiData.map((customer) => ({
      id: customer.id,
      displayName: customer.displayName || "",
      mobile: customer.mobile || "",
      address: customer.address || "",
      debt: customer.debt || 0,
      isArchive: customer.isArchive,
      subscriptionCode: customer.subscriptionCode || 0,
      nationalCode: customer.nationalCode || 0,
      maxAllowedDebt: customer.maxAllowedDebt || 0,
      gender: customer.gender || "",
    }));
  };

  // Load customers from localStorage on mount
  useEffect(() => {
    const localCustomers = localStorage.getItem("customers");
    if (localCustomers) {
      try {
        const parsed: CustomerApiResponseShow[] = JSON.parse(localCustomers);
        const nonArchived = parsed.filter((item) => !item.isArchive);
        setAllFinalData(nonArchived);
        setItems(nonArchived);
      } catch (e) {
        // fallback to API if parse fails
        if (token) fetchCustomerList();
      }
    } else if (token) {
      fetchCustomerList();
    }
  }, [token]);
  const productSectionMaxHeight = showFilter ? 450 : 600;

  const totalPages = Math.ceil(items.length / pageSize);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSeachCustomer = async (value: string) => {
    setSearchTerm(value);

    let searchData: CustomerApiResponseShow[] = [];
    allFinalData.forEach((item) => {
      if (
        item.displayName.toLowerCase().includes(value.toLowerCase()) ||
        item.mobile.includes(value)
      ) {
        searchData.push(item);
      }
    });

    setItems(value ? searchData : allFinalData);
    setCurrentPage(1);
  };

  const handleAddCustomer = (customerData: any) => {
    const newCustomer: Item = {
      displayName: customerData.displayName || "",
      mobile: customerData.mobile || "",
      address: customerData.address || "",
      gender: customerData.gender === "زن" ? "0" : "1",
      id: customerData.id || "",
      isArchive: customerData.isArchive || false,
      nationalCode: customerData.nationalCode || 0,
      // debt: customerData.debt || 0,
      // subscriptionCode: customerData.subscriptionCode || 0,
      // maxAllowedDebt: customerData.maxAllowedDebt || 0,
      // email: customerData.email || "",
      // economicCode: customerData.economicCode || "",
      // postalCode: customerData.postalCode || "",
      // customerType: customerData.customerType || "",
      // merchantId: customerData.merchantId || "",
    };
    // setItems((prev) => [newCustomer, ...prev]);
    if (newCustomer.id === "") {
      addCustomerHandler(newCustomer).then(() => {
        fetchCustomerList();
      });
    } else {
      editCustomerHandler(newCustomer).then(() => {
        fetchCustomerList();
      });
    }
  };

  const handleEditCustomer = (item: CustomerApiResponseShow) => {
    setEditCustomer(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteCustomer = (item: CustomerApiResponseShow) => {
    setDeleteCustomer(item);
    setIsDeleteModalOpen(true);
  };

  const submitDeleteCustomer = async () => {
    if (!deleteCustomer) return;
    console.log(deleteCustomer, "deleteCustomer");
    await axios.delete(PRODUCT_ENDPOINTS.deleteCustomer(deleteCustomer.id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setIsDeleteModalOpen(false);
    fetchCustomerList();
  };

  return (
    <>
      <NoShowCustomerModal
        isCategoryOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onCategoryDelete={submitDeleteCustomer}
        message={`آیا مایل به حذف ${deleteCustomer?.displayName} هستید؟`}
      />
      {/* Header Section */}
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
          alt="arrow"
          style={{ transition: "transform 0.2s" }}
        />
      </div>

      {/* Search and Buttons */}
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
          onClick={() => setShowFilter((prev) => !prev)}
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
              transform: showFilter ? "rotate(180deg)" : "rotate(0deg)",
            }}
            alt="arrow"
          />
        </Button>
        <Button
          label=""
          color="#7485E5"
          radius={15}
          style={{ width: "175px", height: "50px" }}
          onClick={() => openModal("")}
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
      {showFilter && (
        <CustomerFilter
          onApply={(filters) => {
            if (!allFinalData) return;

            let filtered = allFinalData;

            if (filters.gender) {
              filtered = filtered.filter(
                (item) => item.gender === filters.gender
              );
            }

            // if (filters.startDate) {
            //   filtered = filtered.filter(
            //     (item) => new Date(item.createdDate) >= filters.startDate
            //   );
            // }
            // if (filters.endDate) {
            //   filtered = filtered.filter(
            //     (item) => new Date(item.createdDate) <= filters.endDate
            //   );
            // }
            setItems(filtered);
            setCurrentPage(1);
          }}
          onReset={() => {
            setItems(allFinalData);
            setCurrentPage(1);
          }}
          showReset={items !== allFinalData}
        />
      )}
      {/* Table */}
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
          style={{ maxHeight: productSectionMaxHeight }}
        >
          {customersLoading ? (
            <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-full text-gray-500">
              در حال بارگذاری...
            </div>
          ) : customersError ? (
            <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-full text-red-500">
              خطا در بارگذاری: {String(customersError)}
            </div>
          ) : paginatedItems && paginatedItems.length > 0 ? (
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
                    {item.displayName}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[400px]">
                    {item.mobile}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[350px]">
                    {item.subscriptionCode}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[200px]">
                    <div> {item.debt > 0 ? "بدهکار" : "تسویه"}</div>
                    <Tooltip
                      component={
                        <CustomerOption
                          product={item}
                          onEdit={() => handleEditCustomer(item)}
                          onDelete={() => handleDeleteCustomer(item)}
                          showDelete={item.debt === 0 || item.debt === null}
                        />
                      }
                      isOpen={openCustomerTooltipId === item.id}
                      setIsOpen={(isOpen) =>
                        setOpenCustomerTooltipId(isOpen ? item.id : null)
                      }
                    >
                      <img
                        className="relative right-[60px] cursor-pointer"
                        style={{
                          height: "25px",
                          width: "5px",
                          marginTop: "12px",
                        }}
                        src={optionIcon}
                        alt="options"
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-full text-gray-500">
              هیچ مشتری یافت نشد
            </div>
          )}
        </section>
      </section>

      <CustomerDefinitionModal
        isOpen={isOpen}
        onClose={closeModal}
        onAdd={handleAddCustomer}
        loading={addCustomerLoading}
        // error={addCustomerError}
      />
      <CustomerDefinitionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onAdd={handleAddCustomer}
        loading={addCustomerLoading}
        isEdit={true}
        initialData={editCustomer}
        // error={addCustomerError}
      />
    </>
  );
};

export default Customers;
