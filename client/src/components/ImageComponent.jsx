import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import {
  PhotoIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const ImageComponent = ({
  src,
  alt,
  className = "",
  style = {},
  onLoad,
  onError,
  fallbackSrc = "https://placehold.co/400x300?text=No+Image",
  showLoader = true,
  showError = true,
  lazy = true,
  quality = "auto",
  ...props
}) => {
  const [imageState, setImageState] = useState({
    src: src,
    loading: true,
    error: false,
    loaded: false,
  });

  const [isInView, setIsInView] = useState(!lazy);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const currentElement = document.getElementById(`img-${src}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => observer.disconnect();
  }, [src, lazy]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();

    const handleLoad = () => {
      setImageState((prev) => ({
        ...prev,
        loading: false,
        error: false,
        loaded: true,
      }));
      onLoad && onLoad();
    };

    const handleError = () => {
      setImageState((prev) => ({
        ...prev,
        loading: false,
        error: true,
        loaded: false,
      }));
      onError && onError();
    };

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    // Add quality parameter if using a service that supports it
    let imageSrc = src;
    if (quality !== "auto" && src.includes("?")) {
      imageSrc = `${src}&q=${quality}`;
    } else if (quality !== "auto") {
      imageSrc = `${src}?q=${quality}`;
    }

    img.src = imageSrc;

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [src, isInView, quality, onLoad, onError]);

  const handleRetry = () => {
    setImageState((prev) => ({
      ...prev,
      loading: true,
      error: false,
    }));
  };

  if (!isInView) {
    return (
      <div
        id={`img-${src}`}
        className={`image-placeholder ${className}`}
        style={{
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          ...style,
        }}
      >
        <div className="text-center text-muted">
          <PhotoIcon width={48} height={48} className="mb-2" />
          <p className="mb-0 small">Loading image...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (imageState.error && showError) {
    return (
      <div
        className={`image-error ${className}`}
        style={{
          backgroundColor: "#f8f9fa",
          border: "2px dashed #dee2e6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          ...style,
        }}
        onClick={handleRetry}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#e9ecef";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#f8f9fa";
        }}
      >
        <ExclamationTriangleIcon
          width={48}
          height={48}
          className="text-warning mb-2"
        />
        <p className="text-muted mb-2 text-center">Failed to load image</p>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleRetry();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading state
  if (imageState.loading && showLoader) {
    return (
      <div
        className={`image-loading ${className}`}
        style={{
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          position: "relative",
          ...style,
        }}
      >
        <div className="text-center">
          <div className="spinner-premium mb-3"></div>
          <p className="text-muted mb-0 small">Loading image...</p>
        </div>
        {/* Shimmer effect */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            animation: "shimmer 1.5s infinite",
          }}
        />
      </div>
    );
  }

  // Success state - render the image
  return (
    <img
      src={imageState.src}
      alt={alt}
      className={`${className} ${imageState.loaded ? "fade-in" : ""}`}
      style={{
        transition: "opacity 0.3s ease",
        opacity: imageState.loaded ? 1 : 0,
        ...style,
      }}
      onLoad={() => {
        if (!imageState.loaded) {
          setImageState((prev) => ({ ...prev, loaded: true }));
        }
      }}
      loading={lazy ? "lazy" : "eager"}
      {...props}
    />
  );
};

// Product Image Component with specific styling for product cards
export const ProductImage = ({
  product,
  className = "",
  showBadge = true,
  size = "medium",
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    small: { height: "200px" },
    medium: { height: "280px" },
    large: { height: "400px" },
    thumbnail: { height: "80px", width: "80px" },
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  if (imageError) {
    return (
      <div
        className={`product-image-fallback d-flex align-items-center justify-content-center bg-light ${className}`}
        style={{
          ...sizeStyles[size],
          borderRadius: "var(--radius-xl)",
          border: "2px dashed #dee2e6",
        }}
      >
        <div className="text-center text-muted">
          <PhotoIcon width={32} height={32} className="mb-2" />
          <p className="mb-0 small">No Image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="position-relative">
      <ImageComponent
        src={product.image_url}
        alt={product.name}
        className={`product-image ${className}`}
        style={{
          ...sizeStyles[size],
          objectFit: "cover",
          borderRadius: "var(--radius-xl)",
          cursor: "pointer",
        }}
        onError={handleImageError}
        onLoad={handleImageLoad}
        quality={80}
        {...props}
      />

      {/* Product Badges */}
      {showBadge && (product.isNew || product.isSale) && (
        <div className="position-absolute top-0 start-0 p-3">
          {product.isNew && <span className="badge bg-success me-1">New</span>}
          {product.isSale && <span className="badge bg-danger">Sale</span>}
        </div>
      )}

      {/* Quick Actions Overlay */}
      <div
        className="position-absolute top-0 end-0 p-2 d-flex flex-column gap-1"
        style={{ opacity: 0, transition: "opacity 0.3s ease" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
      >
        <button className="btn btn-light btn-sm rounded-circle shadow-sm">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageComponent;
