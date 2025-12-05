import React, { useState } from "react";
import { Dropdown, Button, Badge, Image, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  ShoppingBagIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";

const CartDropdown = () => {
  const { cartItems, cartCount, subtotal, updateQuantity, removeItem } =
    useCart();
  const [show, setShow] = useState(false);
  const [actionFeedback, setActionFeedback] = useState({
    type: "",
    message: "",
  });
  const [removingItems, setRemovingItems] = useState(new Set());

  const toggle = () => setShow(!show);

  const handleUpdateQuantity = async (item, newQuantity) => {
    try {
      if (newQuantity < 1) {
        setRemovingItems((prev) => new Set([...prev, item.id]));
        setActionFeedback({
          type: "info",
          message: `Removed ${item.name} from cart`,
        });
        setTimeout(() => {
          removeItem(item.id, item.size, item.color);
          setRemovingItems((prev) => {
            const newSet = new Set(prev);
            newSet.delete(item.id);
            return newSet;
          });
        }, 300);
      } else {
        updateQuantity(item.id, item.size, item.color, newQuantity);
        setActionFeedback({
          type: "success",
          message: `Updated ${item.name} quantity`,
        });
      }
      setTimeout(() => setActionFeedback({ type: "", message: "" }), 2000);
    } catch (error) {
      setActionFeedback({
        type: "error",
        message: "Failed to update cart item",
      });
    }
  };

  const handleRemoveItem = async (item) => {
    setRemovingItems((prev) => new Set([...prev, item.id]));
    setActionFeedback({
      type: "info",
      message: `Removed ${item.name} from cart`,
    });
    setTimeout(() => {
      removeItem(item.id, item.size, item.color);
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 300);
  };

  return (
    <Dropdown show={show} onToggle={toggle} align="end">
      <Dropdown.Toggle
        variant="ghost"
        className="p-2 position-relative rounded-pill icon-luxe overflow-visible"
        as={Button}
        onClick={toggle}
      >
        <ShoppingBagIcon width={20} height={20} />
        {cartCount > 0 && (
          <Badge
            bg="danger"
            className="position-absolute top-0 start-100 translate-middle pulse-new"
            style={{
              fontSize: "0.7rem",
              minWidth: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cartCount > 99 ? "99+" : cartCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="border-0 shadow-lg"
        style={{
          width: "380px",
          borderRadius: "16px",
          padding: "0",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="p-3 border-bottom"
          style={{
            background:
              "linear-gradient(135deg, var(--primary-color), var(--primary-light))",
          }}
        >
          <div className="d-flex align-items-center justify-content-between text-white">
            <h6 className="mb-0 fw-bold">
              <ShoppingBagIcon width={20} height={20} className="me-2" />
              Shopping Cart
            </h6>
            {cartCount > 0 && (
              <Badge bg="light" text="dark" className="fw-bold">
                {cartCount} item{cartCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Feedback */}
        {actionFeedback.message && (
          <Alert
            variant={
              actionFeedback.type === "error" ? "danger" : actionFeedback.type
            }
            className="m-3 mb-0 rounded-3"
            style={{ fontSize: "0.875rem" }}
          >
            {actionFeedback.type === "error" && (
              <ExclamationTriangleIcon
                width={16}
                height={16}
                className="me-2"
              />
            )}
            {actionFeedback.message}
          </Alert>
        )}

        {/* Cart Items */}
        <div className="p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {cartItems.length === 0 ? (
            <div className="text-center py-4">
              <div className="mb-3">
                <ShoppingBagIcon
                  width={48}
                  height={48}
                  className="text-muted"
                />
              </div>
              <h6 className="text-muted mb-2">Your cart is empty</h6>
              <p className="text-muted small mb-3">
                Add some items to get started
              </p>
              <Button
                as={Link}
                to="/shop"
                variant="outline-primary"
                size="sm"
                className="rounded-pill"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className={`cart-item d-flex mb-3 p-3 rounded-3 border transition-all ${removingItems.has(item.id) ? "removing" : ""
                    }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="position-relative">
                    <Image
                      src={
                        item.image_url ||
                        item.image ||
                        "https://placehold.co/60x60"
                      }
                      rounded
                      className="me-3"
                      width={60}
                      height={60}
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/60x60?text=No+Image";
                      }}
                    />
                    {removingItems.has(item.id) && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 rounded">
                        <div className="spinner-border spinner-border-sm text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow-1">
                    <h6
                      className="mb-1 fw-bold"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </h6>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <small className="text-muted">
                        Size: <span className="fw-bold">{item.size}</span>
                      </small>
                      {item.color && (
                        <small className="text-muted">
                          Color: <span className="fw-bold">{item.color}</span>
                        </small>
                      )}
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="rounded-circle p-1"
                          style={{ width: "28px", height: "28px" }}
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity - 1)
                          }
                          disabled={removingItems.has(item.id)}
                        >
                          <MinusIcon width={12} height={12} />
                        </Button>
                        <span className="fw-bold px-2">{item.quantity}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="rounded-circle p-1"
                          style={{ width: "28px", height: "28px" }}
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity + 1)
                          }
                          disabled={removingItems.has(item.id)}
                        >
                          <PlusIcon width={12} height={12} />
                        </Button>
                      </div>

                      <div className="text-end">
                        <div className="fw-bold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <small className="text-muted">
                            ${item.price} each
                          </small>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="link"
                      className="text-danger p-0 mt-2 small"
                      onClick={() => handleRemoveItem(item)}
                      disabled={removingItems.has(item.id)}
                    >
                      <TrashIcon width={14} height={14} className="me-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <>
            <div className="p-3 border-top">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Subtotal:</span>
                <span className="fw-bold text-primary fs-5">
                  ${parseFloat(subtotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="d-grid gap-2">
                <Button
                  as={Link}
                  to="/cart"
                  variant="outline-primary"
                  size="sm"
                  className="rounded-pill"
                >
                  View Full Cart
                </Button>
                <Button
                  as={Link}
                  to="/checkout"
                  variant="primary"
                  size="sm"
                  className="rounded-pill btn-premium"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CartDropdown;
