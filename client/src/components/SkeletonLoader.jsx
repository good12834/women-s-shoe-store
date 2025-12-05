import React from "react";

const SkeletonLoader = ({ type = "card", count = 1 }) => {
  const renderSkeletonCard = () => (
    <div className="card-premium">
      <div
        className="loading-skeleton"
        style={{
          height: "280px",
          borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
        }}
      ></div>
      <div className="p-4">
        <div
          className="loading-skeleton mb-2"
          style={{ height: "20px", width: "80%" }}
        ></div>
        <div
          className="loading-skeleton mb-2"
          style={{ height: "16px", width: "60%" }}
        ></div>
        <div
          className="loading-skeleton mb-3"
          style={{ height: "24px", width: "40%" }}
        ></div>
        <div
          className="loading-skeleton"
          style={{
            height: "40px",
            width: "100%",
            borderRadius: "var(--radius-lg)",
          }}
        ></div>
      </div>
    </div>
  );

  const renderSkeletonProductList = () => (
    <div className="d-flex align-items-center mb-3 p-3 bg-light rounded">
      <div
        className="loading-skeleton me-3"
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "var(--radius-lg)",
        }}
      ></div>
      <div className="flex-grow-1">
        <div
          className="loading-skeleton mb-2"
          style={{ height: "16px", width: "70%" }}
        ></div>
        <div
          className="loading-skeleton"
          style={{ height: "14px", width: "50%" }}
        ></div>
      </div>
      <div
        className="loading-skeleton"
        style={{ height: "20px", width: "60px" }}
      ></div>
    </div>
  );

  const renderSkeletonText = () => (
    <div
      className="loading-skeleton mb-2"
      style={{ height: "16px", width: "100%" }}
    ></div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return renderSkeletonCard();
      case "product-list":
        return renderSkeletonProductList();
      case "text":
        return renderSkeletonText();
      default:
        return renderSkeletonCard();
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="row g-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="col-12 col-sm-6 col-lg-4">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
