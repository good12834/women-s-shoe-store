import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import ToastNotification from "../components/ToastNotification";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [isClearing, setIsClearing] = useState(false);

  const subtotal = cartTotal;
  const shippingCost = subtotal >= 50 ? 0 : 15;
  const tax = subtotal * 0.05; // 5% tax as per example
  const total = subtotal + shippingCost + tax;

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity <= 0) return;
    try {
      updateQuantity(item.id, item.size, item.color, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const handleRemoveFromCart = (item) => {
    removeFromCart(item.id, item.size, item.color);
    setToast({
      show: true,
      message: `${item.name} removed from cart`,
      type: "info",
    });
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
      clearCart();
      setToast({
        show: true,
        message: "Cart cleared successfully",
        type: "info",
      });
    } catch (error) {
      console.error("Failed to clear cart", error);
    } finally {
      setIsClearing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page py-5">
        <Container>
          <div className="text-center py-5">
            <div className="mb-4">
              <ShoppingBagIcon
                width={64}
                height={64}
                className="text-muted opacity-50 mx-auto"
              />
            </div>
            <h2 className="fw-bold mb-3">Your cart is empty</h2>
            <p className="text-muted mb-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button
              as={Link}
              to="/shop"
              className="btn-pink rounded-pill px-5 py-3 fw-semibold"
            >
              Start Shopping
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="cart-page pb-5 bg-light min-vh-100">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Your Shopping Cart</h2>
          <Button
            variant="link"
            as={Link}
            to="/shop"
            className="text-decoration-none text-muted d-flex align-items-center"
          >
            <ArrowLeftIcon width={16} height={16} className="me-2" />
            Continue Shopping
          </Button>
        </div>

        <Row>
          {/* Cart Items */}
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </span>
              <Button
                variant="link"
                className="text-danger text-decoration-none p-0"
                onClick={handleClearCart}
                disabled={isClearing}
              >
                {isClearing ? "Clearing..." : "Clear Cart"}
              </Button>
            </div>

            {cartItems.map((item) => (
              <Card
                key={`${item.id}-${item.size}-${item.color}`}
                className="cart-item-card mb-3 shadow-sm p-3"
              >
                <div className="row g-0 align-items-center">
                  <div className="col-md-3">
                    <img
                      src={item.image_url || item.image}
                      alt={item.name}
                      className="img-fluid rounded-3"
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/300x200?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body py-0">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="card-title fw-bold mb-1">
                            {item.name}
                          </h5>
                          <p className="card-text text-muted small mb-0">
                            Color: {item.color} <span className="mx-2">|</span>{" "}
                            Size: {item.size}
                          </p>
                        </div>
                        <p className="fw-bold text-pink fs-5 mb-0">
                          ${parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="d-flex align-items-center border rounded-pill px-2 py-1">
                          <Button
                            variant="link"
                            className="text-dark p-1"
                            onClick={() =>
                              handleUpdateQuantity(item, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon width={16} height={16} />
                          </Button>
                          <span className="mx-3 fw-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="link"
                            className="text-dark p-1"
                            onClick={() =>
                              handleUpdateQuantity(item, item.quantity + 1)
                            }
                          >
                            <PlusIcon width={16} height={16} />
                          </Button>
                        </div>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-pill px-3 d-flex align-items-center"
                          onClick={() => handleRemoveFromCart(item)}
                        >
                          <TrashIcon width={16} height={16} className="me-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </Col>

          {/* Order Summary */}
          <Col md={4}>
            <Card className="cart-summary-card shadow-sm p-3 border-0">
              <Card.Body>
                <h4 className="fw-bold mb-4">Order Summary</h4>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Shipping</span>
                  <span className="fw-semibold">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Tax (5%)</span>
                  <span className="fw-semibold">${tax.toFixed(2)}</span>
                </div>

                <hr className="my-4" />

                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-5 text-pink">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Button
                  as={Link}
                  to="/checkout"
                  className="btn-pink w-100 py-3 rounded-pill fw-bold shadow-sm"
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-4 text-center">
                  <small className="text-muted">
                    <span className="d-block mb-2">We accept</span>
                    <div className="d-flex justify-content-center gap-2 opacity-50">
                      <span>💳 Visa</span>
                      <span>💳 MC</span>
                      <span>💳 Amex</span>
                    </div>
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <ToastNotification
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />

      {/* Sticky Bottom Bar for Mobile Cart */}
      <div className="fixed-bottom bg-white border-top p-3 d-md-none shadow-lg" style={{ zIndex: 1020 }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted">Total</span>
          <span className="fw-bold fs-5 text-pink">${total.toFixed(2)}</span>
        </div>
        <Button
          as={Link}
          to="/checkout"
          className="btn-pink w-100 py-2 rounded-pill fw-bold shadow-sm"
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;
