import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Modal,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ToastNotification from "../components/ToastNotification";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, isInWishlist, loading } =
    useWishlist();
  const { addToCart } = useCart();
  const [showClearModal, setShowClearModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [itemLoading, setItemLoading] = useState({});

  const handleAddToCart = async (product) => {
    setItemLoading((prev) => ({ ...prev, [product.id]: true }));

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      addToCart(
        product,
        1,
        product.sizes?.[0] || "M",
        product.colors?.[0]?.value || "#000000"
      );
      setToast({
        show: true,
        message: `${product.name} added to cart!`,
        type: "success",
      });
    } catch (error) {
      setToast({
        show: true,
        message: "Failed to add item to cart",
        type: "error",
      });
    } finally {
      setItemLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product.id);
    setToast({
      show: true,
      message: `${product.name} removed from wishlist`,
      type: "info",
    });
  };

  const handleClearWishlist = () => {
    // This would be implemented in the context
    setToast({
      show: true,
      message: "Wishlist cleared",
      type: "info",
    });
    setShowClearModal(false);
  };

  const handleShare = async (product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this amazing product: ${product.name}`,
          url: window.location.origin + `/product/${product.id}`,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(
        window.location.origin + `/product/${product.id}`
      );
      setToast({
        show: true,
        message: "Product link copied to clipboard!",
        type: "success",
      });
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading your wishlist...</p>
        </div>
      </Container>
    );
  }

  return (
    <div
      className="wishlist-page pb-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <Container>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="display-5 fw-bold mb-2">My Wishlist</h1>
            <p className="text-muted fs-5">
              {wishlistItems.length === 0
                ? "Your saved favorites"
                : `${wishlistItems.length} item${wishlistItems.length !== 1 ? "s" : ""
                } in your wishlist`}
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <Button
              variant="outline-danger"
              onClick={() => setShowClearModal(true)}
              className="d-none d-md-flex align-items-center"
            >
              <TrashIcon width={18} height={18} className="me-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist-state text-center py-5">
            <div className="mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                  border: "3px solid #dee2e6",
                }}
              >
                <HeartIcon width={60} height={60} className="text-muted" />
              </div>
            </div>
            <h3 className="fw-bold mb-3">Your wishlist is empty</h3>
            <p className="text-muted mb-4 fs-5">
              Start browsing and save your favorite items to your wishlist
            </p>
            <Button
              as={Link}
              to="/shop"
              variant="primary"
              size="lg"
              className="btn-premium px-5"
            >
              <ShoppingBagIcon width={20} height={20} className="me-2" />
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Mobile Clear Button */}
            <div className="d-md-none mb-4">
              <Button
                variant="outline-danger"
                onClick={() => setShowClearModal(true)}
                className="w-100"
              >
                <TrashIcon width={18} height={18} className="me-2" />
                Clear All Items
              </Button>
            </div>

            <Row className="g-4">
              {wishlistItems.map((product, index) => (
                <Col
                  key={product.id}
                  xs={12}
                  sm={6}
                  lg={4}
                  xl={3}
                  className="stagger-animation"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="product-card h-100 border-0 shadow-sm">
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={product.image_url}
                        alt={product.name}
                        className="product-image"
                        style={{ height: "250px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/300x250?text=No+Image";
                        }}
                      />

                      {/* Badges */}
                      <div className="position-absolute top-0 start-0 p-3">
                        {product.isNew && (
                          <Badge bg="success" className="me-1">
                            New
                          </Badge>
                        )}
                        {product.isSale && <Badge bg="danger">Sale</Badge>}
                      </div>

                      {/* Quick Actions */}
                      <div className="position-absolute top-0 end-0 p-3 d-flex flex-column gap-2">
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle p-2 shadow-sm"
                          onClick={() => handleShare(product)}
                        >
                          <ShareIcon width={16} height={16} />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle p-2 shadow-sm"
                          onClick={() => handleRemoveFromWishlist(product)}
                        >
                          <XMarkIcon width={16} height={16} />
                        </Button>
                      </div>

                      {/* Quick Add Overlay */}
                      <div
                        className="position-absolute bottom-0 start-0 end-0 p-3"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = 1)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = 0)
                        }
                      >
                        <Button
                          variant="light"
                          size="sm"
                          className="w-100 rounded-pill"
                          onClick={() => handleAddToCart(product)}
                          disabled={itemLoading[product.id]}
                        >
                          {itemLoading[product.id] ? (
                            <Spinner size="sm" className="me-2" />
                          ) : (
                            <ShoppingBagIcon
                              width={16}
                              height={16}
                              className="me-2"
                            />
                          )}
                          Quick Add
                        </Button>
                      </div>
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <small
                          className="text-muted text-uppercase fw-bold"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {product.category || "Shoes"}
                        </small>
                      </div>

                      <Card.Title
                        className="h6 fw-bold mb-2"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className="text-decoration-none text-dark"
                        >
                          {product.name}
                        </Link>
                      </Card.Title>

                      <div className="d-flex align-items-center mb-3">
                        <div className="d-flex text-warning me-2">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < Math.floor(product.rating || 4.5)
                                  ? "text-warning"
                                  : "text-muted"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <small className="text-muted">
                          ({product.reviews || 0})
                        </small>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <span className="fw-bold text-dark fs-5">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-muted text-decoration-line-through ms-2 small">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Color Options */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="mb-3">
                          <small className="text-muted d-block mb-2">
                            Available Colors:
                          </small>
                          <div className="d-flex gap-1">
                            {product.colors.slice(0, 4).map((color, i) => (
                              <div
                                key={i}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  backgroundColor: color.value || color,
                                  border: "2px solid #fff",
                                  boxShadow: "0 0 0 1px #ddd",
                                }}
                                title={color.name || color}
                              />
                            ))}
                            {product.colors.length > 4 && (
                              <div
                                className="d-flex align-items-center justify-content-center bg-light rounded-circle"
                                style={{ width: "20px", height: "20px" }}
                              >
                                <small className="text-muted">
                                  +{product.colors.length - 4}
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-auto d-grid gap-2">
                        <Button
                          variant="primary"
                          className="btn-product"
                          onClick={() => handleAddToCart(product)}
                          disabled={itemLoading[product.id]}
                        >
                          {itemLoading[product.id] ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingBagIcon
                                width={16}
                                height={16}
                                className="me-2"
                              />
                              Add to Cart
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveFromWishlist(product)}
                        >
                          <HeartSolidIcon
                            width={16}
                            height={16}
                            className="me-2 text-danger"
                          />
                          Remove from Wishlist
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Continue Shopping Section */}
            <div className="text-center mt-5 pt-4 border-top">
              <h4 className="mb-3">Discover More Amazing Products</h4>
              <p className="text-muted mb-4">
                Keep exploring our collection to find more items you'll love
              </p>
              <Button
                as={Link}
                to="/shop"
                variant="outline-primary"
                size="lg"
                className="px-5"
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}

        {/* Clear Wishlist Modal */}
        <Modal
          show={showClearModal}
          onHide={() => setShowClearModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center">
              <ExclamationTriangleIcon
                width={24}
                height={24}
                className="text-warning me-2"
              />
              Clear Wishlist
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="mb-0">
              Are you sure you want to remove all items from your wishlist? This
              action cannot be undone.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setShowClearModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearWishlist}>
              Clear All Items
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast Notification */}
        <ToastNotification
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          message={toast.message}
          type={toast.type}
        />
      </Container>
    </div>
  );
};

export default Wishlist;
