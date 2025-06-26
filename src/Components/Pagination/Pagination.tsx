import React from "react";
import nextArrow from "../../assets/nextArrow.svg";
import previousArrow from "../../assets/perviosArrow.svg";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  let pageNumbers: (number | string)[] = [];

  const addPage = (page: number | string) => {
    if (!pageNumbers.includes(page)) {
      pageNumbers.push(page);
    }
  };

  // Always show first page
  addPage(1);

  // Add ... if needed between first page and current-1
  if (currentPage - 2 > 2) {
    addPage("...");
  }

  // Add current-1 if it's valid
  if (currentPage - 1 > 1) {
    addPage(currentPage - 1);
  }

  // Add current page if it's not first or last
  if (currentPage !== 1 && currentPage !== totalPages) {
    addPage(currentPage);
  }

  // Add current+1 if it's valid
  if (currentPage + 1 < totalPages) {
    addPage(currentPage + 1);
  }

  // Add ... if needed between current+1 and last page
  if (currentPage + 2 < totalPages - 1) {
    addPage("...");
  }

  // Always show last page if it's not already included
  if (totalPages > 1) {
    addPage(totalPages);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: 500,
        justifyContent: "center",
        gap: 8,
        marginRight: 16,
      }}
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          width: 100,
          height: 42,
          borderRadius: 15,
          border: "2px solid #7485E5",
          background: "#fff",
          color: "#7485E5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 500,
          fontSize: 18,
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        <img src={previousArrow} style={{ marginLeft: 8 }} />
        قبلی
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((num, idx) =>
        num === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            style={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#7485E5",
            }}
          >
            ...
          </span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(Number(num))}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              border:
                currentPage === num ? "2px solid #7485E5" : "2px solid #fff",
              background: "#fff",
              color: "#7485E5",
              fontWeight: 500,
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {num}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          width: 100,
          height: 42,
          borderRadius: 15,
          border: "2px solid #7485E5",
          background: "#fff",
          color: "#7485E5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 500,
          fontSize: 18,
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
      >
        بعدی
        <img src={nextArrow} style={{ marginRight: 8 }} />
      </button>
    </div>
  );
};

export default Pagination;
