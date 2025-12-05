import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Badge,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import StripeCheckout from "../components/StripeCheckout";
import { useCart } from "../context/CartContext";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [cardType, setCardType] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [useStripePayment, setUseStripePayment] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Real-time card number formatting
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const detectCardType = (number) => {
    const num = number.replace(/\s/g, "");
    if (num.match(/^4/)) return "visa";
    if (num.match(/^5[1-5]/)) return "mastercard";
    if (num.match(/^3[47]/)) return "amex";
    if (num.match(/^6/)) return "discover";
    return "";
  };

  // Helper function to format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Real-time validation function
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (value.trim().length < 2)
          error = "Must be at least 2 characters";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required";
        else if (value.trim().length < 2)
          error = "Must be at least 2 characters";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) error = "Email is required";
        else if (!emailRegex.test(value)) error = "Invalid email format";
        break;
      case "phone":
        const phoneRegex =
          /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        if (!value.trim()) error = "Phone is required";
        else if (!phoneRegex.test(value.replace(/\s/g, "")))
          error = "Invalid phone number";
        break;
      case "street":
        if (!value.trim()) error = "Street address is required";
        else if (value.trim().length < 5)
          error = "Please enter complete address";
        break;
      case "city":
        if (!value.trim()) error = "City is required";
        break;
      case "zipCode":
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!value.trim()) error = "ZIP code is required";
        else if (!zipRegex.test(value)) error = "Invalid ZIP code format";
        break;
      case "cardNumber":
        const cleanNumber = value.replace(/\s/g, "");
        if (!value.trim()) error = "Card number is required";
        else if (cleanNumber.length < 13 || cleanNumber.length > 19)
          error = "Invalid card number";
        break;
      case "expiry":
        if (!value.trim()) error = "Expiry date required";
        else {
          const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
          if (!expiryRegex.test(value)) error = "Use MM/YY format";
        }
        break;
      case "cvc":
        if (!value.trim()) error = "CVC is required";
        else if (!/^\d{3,4}$/.test(value)) error = "3-4 digits required";
        break;
      case "cardName":
        if (!value.trim()) error = "Cardholder name required";
        else if (value.trim().length < 2) error = "Full name required";
        break;
      default:
        break;
    }

    return error;
  };

  // Handle field blur for validation
  const handleFieldBlur = (fieldName) => {
    setFieldTouched((prev) => ({ ...prev, [fieldName]: true }));
    if (isDirty) {
      validateShipping();
      validatePayment();
    }
  };

  useEffect(() => {
    if (cardDetails.number) {
      const formatted = formatCardNumber(cardDetails.number);
      const type = detectCardType(cardDetails.number);
      setCardDetails((prev) => ({
        ...prev,
        number: formatted,
        type: type,
      }));
      setCardType(type);
    }
  }, [cardDetails.number]);

  // Compute order summary from cart
  const TAX_RATE = 0.08; // 8% tax
  const FREE_SHIPPING_THRESHOLD = 50;
  const SHIPPING_COST = 9.99;

  const subtotal = cartTotal;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const discount = 0; // Can be updated with coupon logic
  const total = subtotal + shipping + tax - discount;

  const orderSummary = {
    subtotal,
    shipping,
    tax,
    discount,
    total,
    items: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || "N/A",
      color: item.color || "N/A",
      image: item.image || item.image_url || "https://via.placeholder.com/60",
    })),
  };

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const validateShipping = () => {
    const newErrors = {};

    // Name validation
    if (!shippingAddress.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (shippingAddress.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!shippingAddress.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (shippingAddress.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!shippingAddress.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(shippingAddress.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex =
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(shippingAddress.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Address validation
    if (!shippingAddress.street.trim()) {
      newErrors.street = "Street address is required";
    } else if (shippingAddress.street.trim().length < 5) {
      newErrors.street = "Please enter a complete street address";
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!shippingAddress.state) {
      newErrors.state = "Please select a state";
    }

    // ZIP code validation
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!shippingAddress.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!zipRegex.test(shippingAddress.zipCode)) {
      newErrors.zipCode =
        "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};

    if (paymentMethod === "card") {
      // Card number validation
      if (!cardDetails.number.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else {
        const cleanNumber = cardDetails.number.replace(/\s/g, "");
        if (cleanNumber.length < 13 || cleanNumber.length > 19) {
          newErrors.cardNumber = "Please enter a valid card number";
        } else if (!/^\d+$/.test(cleanNumber)) {
          newErrors.cardNumber = "Card number must contain only digits";
        } else {
          // Luhn algorithm check
          let sum = 0;
          let isEven = false;
          for (let i = cleanNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanNumber.charAt(i), 10);
            if (isEven) {
              digit *= 2;
              if (digit > 9) {
                digit -= 9;
              }
            }
            sum += digit;
            isEven = !isEven;
          }
          if (sum % 10 !== 0) {
            newErrors.cardNumber = "Please enter a valid card number";
          }
        }
      }

      // Expiry date validation
      if (!cardDetails.expiry.trim()) {
        newErrors.expiry = "Expiry date is required";
      } else {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(cardDetails.expiry)) {
          newErrors.expiry = "Please use MM/YY format";
        } else {
          const [month, year] = cardDetails.expiry.split("/");
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentYear = currentDate.getFullYear() % 100;
          const expYear = parseInt(year, 10);
          const expMonth = parseInt(month, 10);

          if (
            expYear < currentYear ||
            (expYear === currentYear && expMonth < currentMonth)
          ) {
            newErrors.expiry = "Card has expired";
          }
        }
      }

      // CVC validation
      if (!cardDetails.cvc.trim()) {
        newErrors.cvc = "CVC is required";
      } else if (!/^\d{3,4}$/.test(cardDetails.cvc)) {
        newErrors.cvc = "CVC must be 3-4 digits";
      }

      // Cardholder name validation
      if (!cardDetails.name.trim()) {
        newErrors.cardName = "Cardholder name is required";
      } else if (cardDetails.name.trim().length < 2) {
        newErrors.cardName = "Please enter the cardholder's full name";
      }
    }

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      setStep(3);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setLoading(true);
    setProcessing(true);

    try {
      // Prepare order data for Stripe
      const orderData = {
        amount: orderSummary.total,
        currency: "usd",
        customerEmail: shippingAddress.email,
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        items: orderSummary.items,
      };

      // If using Stripe, handle payment through Stripe component
      if (useStripePayment && paymentMethod === "card") {
        setStep(4); // Move to payment step
        return;
      }

      // For other payment methods (mock implementation)
      if (paymentMethod === "cash") {
        // Simulate order processing for cash on delivery
        setTimeout(() => {
          setLoading(false);
          setProcessing(false);
          navigate("/track-order", {
            state: {
              orderNumber:
                "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
              total: orderSummary.total,
              paymentMethod: "Cash on Delivery",
            },
          });
        }, 2000);
      } else if (paymentMethod === "paypal") {
        // Simulate PayPal processing
        setTimeout(() => {
          setLoading(false);
          setProcessing(false);
          navigate("/track-order", {
            state: {
              orderNumber:
                "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
              total: orderSummary.total,
              paymentMethod: "PayPal",
            },
          });
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      setProcessing(false);
      console.error("Payment processing error:", error);
    }
  };

  // Handle successful Stripe payment
  const handleStripeSuccess = async (paymentIntent) => {
    try {
      setPaymentSuccess(true);

      // Create order in database
      const token = localStorage.getItem("token");
      const orderResponse = await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: orderSummary.items,
          total_amount: orderSummary.total,
          shipping_address: shippingAddress,
          billing_address: sameAsShipping ? shippingAddress : billingAddress,
          payment_method: "stripe",
          stripe_payment_intent_id: paymentIntent.id,
          status: "confirmed",
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      // Clear the cart after successful order
      clearCart();

      if (orderResponse.data.success) {
        navigate("/track-order", {
          state: {
            orderNumber: orderResponse.data.order.order_number,
            total: orderSummary.total,
            paymentMethod: "Credit/Debit Card (Stripe)",
            stripePaymentId: paymentIntent.id,
          },
        });
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      setPaymentError(
        "Payment successful but order creation failed. Please contact support."
      );
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  // Handle Stripe payment errors
  const handleStripeError = (error) => {
    console.error("Stripe payment error:", error);
    setPaymentError(error);
    setLoading(false);
    setProcessing(false);
  };

  // Prepare order data for Stripe
  const getStripeOrderData = () => ({
    amount: orderSummary.total,
    currency: "usd",
    customerEmail: shippingAddress.email,
    shippingAddress,
    items: orderSummary.items,
  });

  const steps = [
    { number: 1, title: "Shipping", description: "Delivery information" },
    { number: 2, title: "Payment", description: "Payment method" },
    { number: 3, title: "Review", description: "Review your order" },
    { number: 4, title: "Process", description: "Complete payment" },
  ];

  return (
    <>
      <style>{`
        .checkout-page .transition-all {
          transition: all 0.3s ease-in-out;
        }
        .checkout-page .hover-shadow-sm:hover {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
        }
        .checkout-page .cursor-pointer {
          cursor: pointer;
          user-select: none;
        }
        .checkout-page .cursor-pointer:focus {
          outline: 2px solid #0d6efd;
          outline-offset: 2px;
        }
        .checkout-page .bg-gradient-light {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        .checkout-page .progress-bar-animated {
          animation: progress-bar-stripes 1s linear infinite;
        }
        @keyframes progress-bar-stripes {
          0% {
            background-position-x: 1rem;
          }
        }
        .checkout-page .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }
        .checkout-page .is-valid {
          border-color: #28a745;
        }
        .checkout-page .is-invalid {
          border-color: #dc3545;
        }
        @media (max-width: 768px) {
          .checkout-page .sticky-top {
            position: relative !important;
            top: auto !important;
          }
        }
      `}</style>
      <div
        className="checkout-page"
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
      >
        {/* Professional Header with Gradient */}
        <div
          className="text-white py-5 mb-5 position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div className="position-absolute top-0 end-0 opacity-10">
            <div
              style={{
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
              }}
            ></div>
          </div>
          <Container>
            <div className="text-center position-relative">
              <div className="d-flex justify-content-center align-items-center mb-3">
                <LockClosedIcon width={32} height={32} className="me-3" />
                <h1 className="display-4 fw-bold mb-0">Secure Checkout</h1>
              </div>
              <p className="lead mb-0 opacity-90">
                Complete your purchase with confidence and security
              </p>
              <div className="mt-3 d-flex justify-content-center gap-3">
                <Badge bg="success" className="px-3 py-2">
                  <ShieldCheckIcon width={16} height={16} className="me-1" />
                  SSL Secured
                </Badge>
                <Badge bg="info" className="px-3 py-2">
                  <TruckIcon width={16} height={16} className="me-1" />
                  Free Shipping
                </Badge>
              </div>
            </div>
          </Container>
        </div>

        <Container fluid>
          {/* Enhanced Progress Steps */}
          <Row className="mb-5">
            <Col>
              <div className="bg-white rounded-3 shadow-sm p-4">
                <div className="d-flex justify-content-center align-items-center flex-wrap">
                  {steps.map((stepItem, index) => (
                    <div
                      key={stepItem.number}
                      className="d-flex align-items-center mb-3 mb-md-0"
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className={`
                          d-flex align-items-center justify-content-center rounded-circle border-2 position-relative
                          ${
                            step >= stepItem.number
                              ? "border-primary bg-primary text-white shadow-sm"
                              : "border-light bg-light text-muted"
                          }
                          ${index === 0 ? "" : "ms-4"}
                        `}
                          style={{
                            width: "48px",
                            height: "48px",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {step > stepItem.number ? (
                            <CheckIcon width={20} height={20} />
                          ) : (
                            <span className="fw-bold">{stepItem.number}</span>
                          )}
                          {step === stepItem.number && (
                            <div
                              className="position-absolute top-100 start-50 translate-middle"
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "#0d6efd",
                                marginTop: "4px",
                              }}
                            ></div>
                          )}
                        </div>
                        <div className="ms-3 d-none d-lg-block">
                          <h6
                            className={`mb-0 fw-semibold ${
                              step >= stepItem.number
                                ? "text-primary"
                                : "text-muted"
                            }`}
                          >
                            {stepItem.title}
                          </h6>
                          <small className="text-muted">
                            {stepItem.description}
                          </small>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`
                          mx-4
                          ${step > stepItem.number ? "bg-primary" : "bg-light"}
                        `}
                          style={{
                            width: "80px",
                            height: "3px",
                            borderRadius: "2px",
                            transition: "all 0.3s ease",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            {/* Main Content */}
            <Col lg={8}>
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                  <div className="bg-gradient-light p-4 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                        <TruckIcon
                          width={28}
                          height={28}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <h4 className="fw-bold mb-1 text-dark">
                          Shipping Information
                        </h4>
                        <p className="text-muted mb-0">
                          Where should we deliver your order?
                        </p>
                      </div>
                    </div>
                  </div>
                  <Card.Body className="p-4">
                    <Form onSubmit={handleShippingSubmit}>
                      {/* Contact Information */}
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                          <UserIcon
                            width={20}
                            height={20}
                            className="text-primary me-2"
                          />
                          <h6 className="fw-semibold mb-0">
                            Contact Information
                          </h6>
                        </div>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>First Name *</Form.Label>
                              <Form.Control
                                type="text"
                                value={shippingAddress.firstName}
                                onChange={(e) => {
                                  setShippingAddress((prev) => ({
                                    ...prev,
                                    firstName: e.target.value,
                                  }));
                                  setIsDirty(true);
                                  if (fieldTouched.firstName) {
                                    const error = validateField(
                                      "firstName",
                                      e.target.value
                                    );
                                    setErrors((prev) => ({
                                      ...prev,
                                      firstName: error,
                                    }));
                                  }
                                }}
                                onBlur={() => handleFieldBlur("firstName")}
                                isInvalid={
                                  fieldTouched.firstName && !!errors.firstName
                                }
                                isValid={
                                  fieldTouched.firstName &&
                                  !errors.firstName &&
                                  shippingAddress.firstName.trim()
                                }
                                className="border-2"
                                placeholder="Enter your first name"
                                autoComplete="given-name"
                                aria-describedby={
                                  fieldTouched.firstName && errors.firstName
                                    ? "firstName-error"
                                    : undefined
                                }
                              />
                              <Form.Control.Feedback
                                type="invalid"
                                id="firstName-error"
                              >
                                {errors.firstName}
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="valid">
                                Looks good!
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Last Name *</Form.Label>
                              <Form.Control
                                type="text"
                                value={shippingAddress.lastName}
                                onChange={(e) => {
                                  setShippingAddress((prev) => ({
                                    ...prev,
                                    lastName: e.target.value,
                                  }));
                                  setIsDirty(true);
                                  if (fieldTouched.lastName) {
                                    const error = validateField(
                                      "lastName",
                                      e.target.value
                                    );
                                    setErrors((prev) => ({
                                      ...prev,
                                      lastName: error,
                                    }));
                                  }
                                }}
                                onBlur={() => handleFieldBlur("lastName")}
                                isInvalid={
                                  fieldTouched.lastName && !!errors.lastName
                                }
                                isValid={
                                  fieldTouched.lastName &&
                                  !errors.lastName &&
                                  shippingAddress.lastName.trim()
                                }
                                className="border-2"
                                placeholder="Enter your last name"
                                autoComplete="family-name"
                                aria-describedby={
                                  fieldTouched.lastName && errors.lastName
                                    ? "lastName-error"
                                    : undefined
                                }
                              />
                              <Form.Control.Feedback
                                type="invalid"
                                id="lastName-error"
                              >
                                {errors.lastName}
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="valid">
                                Looks good!
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                <EnvelopeIcon
                                  width={16}
                                  height={16}
                                  className="me-1"
                                />
                                Email Address *
                              </Form.Label>
                              <Form.Control
                                type="email"
                                value={shippingAddress.email}
                                onChange={(e) => {
                                  setShippingAddress((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }));
                                  setIsDirty(true);
                                  if (fieldTouched.email) {
                                    const error = validateField(
                                      "email",
                                      e.target.value
                                    );
                                    setErrors((prev) => ({
                                      ...prev,
                                      email: error,
                                    }));
                                  }
                                }}
                                onBlur={() => handleFieldBlur("email")}
                                isInvalid={fieldTouched.email && !!errors.email}
                                isValid={
                                  fieldTouched.email &&
                                  !errors.email &&
                                  shippingAddress.email.trim()
                                }
                                className="border-2"
                                placeholder="your@email.com"
                                autoComplete="email"
                                aria-describedby={
                                  fieldTouched.email && errors.email
                                    ? "email-error"
                                    : undefined
                                }
                              />
                              <Form.Control.Feedback
                                type="invalid"
                                id="email-error"
                              >
                                {errors.email}
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="valid">
                                Valid email address
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                <DevicePhoneMobileIcon
                                  width={16}
                                  height={16}
                                  className="me-1"
                                />
                                Phone Number *
                              </Form.Label>
                              <Form.Control
                                type="tel"
                                value={shippingAddress.phone}
                                onChange={(e) => {
                                  setShippingAddress((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                  }));
                                  setIsDirty(true);
                                  if (fieldTouched.phone) {
                                    const error = validateField(
                                      "phone",
                                      e.target.value
                                    );
                                    setErrors((prev) => ({
                                      ...prev,
                                      phone: error,
                                    }));
                                  }
                                }}
                                onBlur={() => handleFieldBlur("phone")}
                                isInvalid={fieldTouched.phone && !!errors.phone}
                                isValid={
                                  fieldTouched.phone &&
                                  !errors.phone &&
                                  shippingAddress.phone.trim()
                                }
                                className="border-2"
                                placeholder="(555) 123-4567"
                                autoComplete="tel"
                                aria-describedby={
                                  fieldTouched.phone && errors.phone
                                    ? "phone-error"
                                    : undefined
                                }
                              />
                              <Form.Control.Feedback
                                type="invalid"
                                id="phone-error"
                              >
                                {errors.phone}
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="valid">
                                Valid phone number
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>

                      {/* Shipping Address */}
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                          <MapPinIcon
                            width={20}
                            height={20}
                            className="text-primary me-2"
                          />
                          <h6 className="fw-semibold mb-0">Shipping Address</h6>
                        </div>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <HomeIcon width={16} height={16} className="me-1" />
                            Street Address *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={shippingAddress.street}
                            onChange={(e) => {
                              setShippingAddress((prev) => ({
                                ...prev,
                                street: e.target.value,
                              }));
                              setIsDirty(true);
                              if (fieldTouched.street) {
                                const error = validateField(
                                  "street",
                                  e.target.value
                                );
                                setErrors((prev) => ({
                                  ...prev,
                                  street: error,
                                }));
                              }
                            }}
                            onBlur={() => handleFieldBlur("street")}
                            isInvalid={fieldTouched.street && !!errors.street}
                            isValid={
                              fieldTouched.street &&
                              !errors.street &&
                              shippingAddress.street.trim()
                            }
                            className="border-2"
                            placeholder="123 Main Street, Apt 4B"
                            autoComplete="street-address"
                            aria-describedby={
                              fieldTouched.street && errors.street
                                ? "street-error"
                                : undefined
                            }
                          />
                          <Form.Control.Feedback
                            type="invalid"
                            id="street-error"
                          >
                            {errors.street}
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="valid">
                            Complete address
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>City *</Form.Label>
                              <Form.Control
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) => {
                                  setShippingAddress((prev) => ({
                                    ...prev,
                                    city: e.target.value,
                                  }));
                                  setIsDirty(true);
                                  if (fieldTouched.city) {
                                    const error = validateField(
                                      "city",
                                      e.target.value
                                    );
                                    setErrors((prev) => ({
                                      ...prev,
                                      city: error,
                                    }));
                                  }
                                }}
                                onBlur={() => handleFieldBlur("city")}
                                isInvalid={fieldTouched.city && !!errors.city}
                                isValid={
                                  fieldTouched.city &&
                                  !errors.city &&
                                  shippingAddress.city.trim()
                                }
                                className="border-2"
                                placeholder="Enter your city"
                                autoComplete="address-level2"
                                aria-describedby={
                                  fieldTouched.city && errors.city
                                    ? "city-error"
                                    : undefined
                                }
                              />
                              <Form.Control.Feedback
                                type="invalid"
                                id="city-error"
                              >
                                {errors.city}
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="valid">
                                Perfect!
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>State *</Form.Label>
                              <Form.Select
                                value={shippingAddress.state}
                                onChange={(e) =>
                                  setShippingAddress((prev) => ({
                                    ...prev,
                                    state: e.target.value,
                                  }))
                                }
                                isInvalid={!!errors.state}
                                className="border-2"
                              >
                                <option value="">Select State</option>
                                <option value="CA">California</option>
                                <option value="NY">New York</option>
                                <option value="TX">Texas</option>
                                <option value="FL">Florida</option>
                                <option value="IL">Illinois</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="OH">Ohio</option>
                                <option value="GA">Georgia</option>
                                <option value="NC">North Carolina</option>
                                <option value="MI">Michigan</option>
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {errors.state}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>ZIP Code *</Form.Label>
                              <Form.Control
                                type="text"
                                value={shippingAddress.zipCode}
                                onChange={(e) => {
                                  setShippingAddress((prev) => ({
                                    ...prev,
                                    zipCode: e.target.value,
                                  }));
                                  setIsDirty(true);
                                  if (fieldTouched.zipCode) {
                                    const error = validateField(
                                      "zipCode",
                                      e.target.value
                                    );
                                    setErrors((prev) => ({
                                      ...prev,
                                      zipCode: error,
                                    }));
                                  }
                                }}
                                onBlur={() => handleFieldBlur("zipCode")}
                                isInvalid={
                                  fieldTouched.zipCode && !!errors.zipCode
                                }
                                isValid={
                                  fieldTouched.zipCode &&
                                  !errors.zipCode &&
                                  shippingAddress.zipCode.trim()
                                }
                                className="border-2"
                                placeholder="12345 or 12345-6789"
                                autoComplete="postal-code"
                                maxLength={10}
                                aria-describedby={
                                  fieldTouched.zipCode && errors.zipCode
                                    ? "zipCode-error"
                                    : undefined
                                }
                              />
                              <Form.Control.Feedback
                                type="invalid"
                                id="zipCode-error"
                              >
                                {errors.zipCode}
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="valid">
                                Valid ZIP code
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>

                      <div className="d-grid">
                        <Button
                          type="submit"
                          size="lg"
                          className="btn-primary fw-bold py-3"
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                          }}
                        >
                          Continue to Payment
                          <CreditCardIcon
                            width={20}
                            height={20}
                            className="ms-2"
                          />
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              {/* Step 2: Payment Information */}
              {step === 2 && (
                <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                  <div className="bg-gradient-light p-4 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-4">
                        <CreditCardIcon
                          width={28}
                          height={28}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <h4 className="fw-bold mb-1 text-dark">
                          Payment Method
                        </h4>
                        <p className="text-muted mb-0">
                          How would you like to pay?
                        </p>
                      </div>
                    </div>
                  </div>
                  <Card.Body className="p-4">
                    <Form onSubmit={handlePaymentSubmit}>
                      {/* Payment Method Selection */}
                      <div className="mb-4">
                        <h6 className="fw-semibold mb-3">
                          Choose Payment Method
                        </h6>
                        <div className="row g-3">
                          <div className="col-12 col-md-4">
                            <div
                              className={`
                              border rounded-3 p-4 text-center cursor-pointer h-100 d-flex flex-column align-items-center justify-content-center transition-all
                              ${
                                paymentMethod === "card"
                                  ? "border-primary bg-primary bg-opacity-5 shadow-sm"
                                  : "border-light hover-border-primary hover-shadow-sm"
                              }
                            `}
                              onClick={() => setPaymentMethod("card")}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setPaymentMethod("card");
                                }
                              }}
                              aria-pressed={paymentMethod === "card"}
                              aria-label="Select Credit or Debit Card payment method"
                            >
                              <div className="mb-3">
                                <CreditCardIcon
                                  width={32}
                                  height={32}
                                  className="text-primary"
                                />
                              </div>
                              <div className="fw-bold">Credit/Debit Card</div>
                              <small className="text-muted mt-1">
                                Visa, Mastercard, Amex
                              </small>
                            </div>
                          </div>
                          <div className="col-12 col-md-4">
                            <div
                              className={`
                              border rounded-3 p-4 text-center cursor-pointer h-100 d-flex flex-column align-items-center justify-content-center transition-all
                              ${
                                paymentMethod === "paypal"
                                  ? "border-primary bg-primary bg-opacity-5 shadow-sm"
                                  : "border-light hover-border-primary hover-shadow-sm"
                              }
                            `}
                              onClick={() => setPaymentMethod("paypal")}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setPaymentMethod("paypal");
                                }
                              }}
                              aria-pressed={paymentMethod === "paypal"}
                              aria-label="Select PayPal payment method"
                            >
                              <div className="mb-3">
                                <div
                                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                  style={{ width: "32px", height: "32px" }}
                                >
                                  P
                                </div>
                              </div>
                              <div className="fw-bold mb-1">PayPal</div>
                              <small className="text-muted">
                                Pay with your PayPal account
                              </small>
                            </div>
                          </div>
                          <div className="col-12 col-md-4">
                            <div
                              className={`
                              border rounded-3 p-4 text-center cursor-pointer h-100 d-flex flex-column align-items-center justify-content-center transition-all
                              ${
                                paymentMethod === "cash"
                                  ? "border-primary bg-primary bg-opacity-5 shadow-sm"
                                  : "border-light hover-border-primary hover-shadow-sm"
                              }
                            `}
                              onClick={() => setPaymentMethod("cash")}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setPaymentMethod("cash");
                                }
                              }}
                              aria-pressed={paymentMethod === "cash"}
                              aria-label="Select Cash on Delivery payment method"
                            >
                              <div className="mb-3">
                                <BanknotesIcon
                                  width={32}
                                  height={32}
                                  className="text-success"
                                />
                              </div>
                              <div className="fw-bold mb-1">
                                Cash on Delivery
                              </div>
                              <small className="text-muted">
                                Pay when you receive
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Details */}
                      {paymentMethod === "card" && (
                        <div className="mb-4">
                          <div className="d-flex align-items-center mb-3">
                            <CreditCardIcon
                              width={20}
                              height={20}
                              className="text-primary me-2"
                            />
                            <h6 className="fw-semibold mb-0">Card Details</h6>
                            {cardType && (
                              <Badge
                                bg="secondary"
                                className="ms-2 text-uppercase"
                              >
                                {cardType}
                              </Badge>
                            )}
                          </div>

                          <Form.Group className="mb-3">
                            <Form.Label>Cardholder Name *</Form.Label>
                            <Form.Control
                              type="text"
                              value={cardDetails.name}
                              onChange={(e) => {
                                setCardDetails((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }));
                                setIsDirty(true);
                                if (fieldTouched.cardName) {
                                  const error = validateField(
                                    "cardName",
                                    e.target.value
                                  );
                                  setErrors((prev) => ({
                                    ...prev,
                                    cardName: error,
                                  }));
                                }
                              }}
                              onBlur={() => handleFieldBlur("cardName")}
                              isInvalid={
                                fieldTouched.cardName && !!errors.cardName
                              }
                              isValid={
                                fieldTouched.cardName &&
                                !errors.cardName &&
                                cardDetails.name.trim()
                              }
                              className="border-2"
                              placeholder="John Doe"
                              autoComplete="cc-name"
                              aria-describedby={
                                fieldTouched.cardName && errors.cardName
                                  ? "cardName-error"
                                  : undefined
                              }
                            />
                            <Form.Control.Feedback
                              type="invalid"
                              id="cardName-error"
                            >
                              {errors.cardName}
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">
                              Cardholder name verified
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Card Number *</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={cardDetails.number}
                              onChange={(e) => {
                                const formatted = formatCardNumber(
                                  e.target.value
                                );
                                setCardDetails((prev) => ({
                                  ...prev,
                                  number: formatted,
                                }));
                                setIsDirty(true);
                                if (fieldTouched.cardNumber) {
                                  const error = validateField(
                                    "cardNumber",
                                    formatted
                                  );
                                  setErrors((prev) => ({
                                    ...prev,
                                    cardNumber: error,
                                  }));
                                }
                              }}
                              onBlur={() => handleFieldBlur("cardNumber")}
                              isInvalid={
                                fieldTouched.cardNumber && !!errors.cardNumber
                              }
                              isValid={
                                fieldTouched.cardNumber &&
                                !errors.cardNumber &&
                                cardDetails.number.trim().length >= 15
                              }
                              className="border-2"
                              maxLength={19}
                              autoComplete="cc-number"
                              aria-describedby={
                                fieldTouched.cardNumber && errors.cardNumber
                                  ? "cardNumber-error"
                                  : undefined
                              }
                            />
                            <Form.Control.Feedback
                              type="invalid"
                              id="cardNumber-error"
                            >
                              {errors.cardNumber}
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">
                              {cardType
                                ? `${cardType.toUpperCase()} card detected`
                                : "Card number verified"}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Expiry Date *</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="MM/YY"
                                  value={cardDetails.expiry}
                                  onChange={(e) => {
                                    const formatted = formatExpiryDate(
                                      e.target.value
                                    );
                                    setCardDetails((prev) => ({
                                      ...prev,
                                      expiry: formatted,
                                    }));
                                    setIsDirty(true);
                                    if (fieldTouched.expiry) {
                                      const error = validateField(
                                        "expiry",
                                        formatted
                                      );
                                      setErrors((prev) => ({
                                        ...prev,
                                        expiry: error,
                                      }));
                                    }
                                  }}
                                  onBlur={() => handleFieldBlur("expiry")}
                                  isInvalid={
                                    fieldTouched.expiry && !!errors.expiry
                                  }
                                  isValid={
                                    fieldTouched.expiry &&
                                    !errors.expiry &&
                                    cardDetails.expiry.trim()
                                  }
                                  className="border-2"
                                  maxLength={5}
                                  autoComplete="cc-exp"
                                  aria-describedby={
                                    fieldTouched.expiry && errors.expiry
                                      ? "expiry-error"
                                      : undefined
                                  }
                                />
                                <Form.Control.Feedback
                                  type="invalid"
                                  id="expiry-error"
                                >
                                  {errors.expiry}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="valid">
                                  Valid expiry date
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>CVC *</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="123"
                                  value={cardDetails.cvc}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    ); // Only digits
                                    setCardDetails((prev) => ({
                                      ...prev,
                                      cvc: value,
                                    }));
                                    setIsDirty(true);
                                    if (fieldTouched.cvc) {
                                      const error = validateField("cvc", value);
                                      setErrors((prev) => ({
                                        ...prev,
                                        cvc: error,
                                      }));
                                    }
                                  }}
                                  onBlur={() => handleFieldBlur("cvc")}
                                  isInvalid={fieldTouched.cvc && !!errors.cvc}
                                  isValid={
                                    fieldTouched.cvc &&
                                    !errors.cvc &&
                                    cardDetails.cvc.trim()
                                  }
                                  className="border-2"
                                  maxLength={4}
                                  autoComplete="cc-csc"
                                  aria-describedby={
                                    fieldTouched.cvc && errors.cvc
                                      ? "cvc-error"
                                      : undefined
                                  }
                                />
                                <Form.Control.Feedback
                                  type="invalid"
                                  id="cvc-error"
                                >
                                  {errors.cvc}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="valid">
                                  Security code verified
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Check
                            type="checkbox"
                            label="Save card for future purchases"
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                            className="mb-3"
                          />
                        </div>
                      )}

                      {/* Terms and Conditions */}
                      <div className="mb-4">
                        <Form.Check
                          type="checkbox"
                          label={
                            <span>
                              I accept the{" "}
                              <a
                                href="/terms"
                                className="text-primary text-decoration-none"
                              >
                                Terms and Conditions
                              </a>{" "}
                              and{" "}
                              <a
                                href="/privacy"
                                className="text-primary text-decoration-none"
                              >
                                Privacy Policy
                              </a>
                            </span>
                          }
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          isInvalid={!!errors.terms}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.terms}
                        </Form.Control.Feedback>
                      </div>

                      <div className="d-flex gap-3">
                        <Button
                          variant="outline-primary"
                          onClick={() => setStep(1)}
                          className="flex-fill py-3 fw-bold"
                          size="lg"
                        >
                          Back to Shipping
                        </Button>
                        <Button
                          type="submit"
                          className="btn-primary flex-fill py-3 fw-bold"
                          size="lg"
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                          }}
                        >
                          Review Order
                          <CheckIcon width={20} height={20} className="ms-2" />
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                  <div className="bg-gradient-light p-4 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="bg-success bg-opacity-10 p-3 rounded-circle me-4">
                        <CheckIcon
                          width={28}
                          height={28}
                          className="text-success"
                        />
                      </div>
                      <div>
                        <h4 className="fw-bold mb-1 text-dark">
                          Review Your Order
                        </h4>
                        <p className="text-muted mb-0">
                          Please confirm your details before placing the order
                        </p>
                      </div>
                    </div>
                  </div>
                  <Card.Body className="p-4">
                    {/* Order Items */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <TruckIcon
                          width={20}
                          height={20}
                          className="text-primary me-2"
                        />
                        <h6 className="fw-semibold mb-0">Order Items</h6>
                      </div>
                      {orderSummary.items.map((item) => (
                        <div
                          key={item.id}
                          className="d-flex align-items-center mb-3 p-3 bg-light rounded-3 border"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="rounded me-3"
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold">{item.name}</h6>
                            <div className="text-muted small">
                              <Badge bg="secondary" className="me-2">
                                Size: {item.size}
                              </Badge>
                              <Badge bg="secondary" className="me-2">
                                Color: {item.color}
                              </Badge>
                              <Badge bg="info">Qty: {item.quantity}</Badge>
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold text-primary h6">
                              $
                              {(
                                parseFloat(item.price || 0) * item.quantity
                              ).toFixed(2)}
                            </div>
                            <div className="text-muted small">
                              ${parseFloat(item.price || 0).toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <MapPinIcon
                          width={20}
                          height={20}
                          className="text-primary me-2"
                        />
                        <h6 className="fw-semibold mb-0">Shipping Address</h6>
                      </div>
                      <div className="p-3 bg-light rounded-3 border">
                        <div className="fw-bold mb-2">
                          {shippingAddress.firstName} {shippingAddress.lastName}
                        </div>
                        <div className="text-muted mb-1">
                          <MapPinIcon width={16} height={16} className="me-1" />
                          {shippingAddress.street}
                          <br />
                          {shippingAddress.city}, {shippingAddress.state}{" "}
                          {shippingAddress.zipCode}
                          <br />
                          {shippingAddress.country}
                        </div>
                        <div className="text-muted">
                          <EnvelopeIcon
                            width={16}
                            height={16}
                            className="me-1"
                          />
                          {shippingAddress.email} |{" "}
                          <DevicePhoneMobileIcon
                            width={16}
                            height={16}
                            className="me-1"
                          />
                          {shippingAddress.phone}
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <CreditCardIcon
                          width={20}
                          height={20}
                          className="text-primary me-2"
                        />
                        <h6 className="fw-semibold mb-0">Payment Method</h6>
                      </div>
                      <div className="p-3 bg-light rounded-3 border">
                        {paymentMethod === "card" && (
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                              <CreditCardIcon
                                width={20}
                                height={20}
                                className="text-primary"
                              />
                            </div>
                            <div>
                              <div className="fw-bold">
                                •••• •••• •••• {cardDetails.number.slice(-4)}
                              </div>
                              <div className="text-muted small">
                                Expires {cardDetails.expiry} |{" "}
                                {cardDetails.name}
                              </div>
                            </div>
                          </div>
                        )}
                        {paymentMethod === "paypal" && (
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                              <div
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "20px", height: "20px" }}
                              >
                                P
                              </div>
                            </div>
                            <div className="fw-bold">PayPal</div>
                          </div>
                        )}
                        {paymentMethod === "cash" && (
                          <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                              <BanknotesIcon
                                width={20}
                                height={20}
                                className="text-success"
                              />
                            </div>
                            <div className="fw-bold">Cash on Delivery</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Form onSubmit={handleFinalSubmit}>
                      {processing && (
                        <>
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.9)",
                              zIndex: 1000,
                            }}
                          >
                            <div className="text-center">
                              <div
                                className="spinner-border text-primary mb-3"
                                style={{ width: "3rem", height: "3rem" }}
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Processing...
                                </span>
                              </div>
                              <h5 className="text-primary fw-bold">
                                Processing Your Order
                              </h5>
                              <p className="text-muted mb-2">
                                Please wait while we securely process your
                                payment...
                              </p>
                              <div
                                className="progress mb-2"
                                style={{ height: "4px", width: "200px" }}
                              >
                                <div
                                  className="progress-bar progress-bar-striped progress-bar-animated"
                                  role="progressbar"
                                  style={{ width: "100%" }}
                                ></div>
                              </div>
                              <small className="text-muted">
                                This may take a few moments
                              </small>
                            </div>
                          </div>
                          <Alert variant="info" className="mb-4">
                            <div className="d-flex align-items-center">
                              <Spinner
                                animation="border"
                                size="sm"
                                className="me-3"
                              />
                              <div>
                                <strong>Processing your order...</strong>
                                <br />
                                <small>Please don't close this window</small>
                              </div>
                            </div>
                          </Alert>
                        </>
                      )}

                      <div className="d-flex gap-3">
                        <Button
                          variant="outline-primary"
                          onClick={() => setStep(2)}
                          className="flex-fill py-3 fw-bold"
                          size="lg"
                          disabled={processing}
                        >
                          Back to Payment
                        </Button>
                        <Button
                          type="submit"
                          className="btn-primary flex-fill py-3 fw-bold"
                          size="lg"
                          disabled={loading || processing}
                          style={{
                            background:
                              "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                            border: "none",
                            boxShadow: "0 4px 15px rgba(40, 167, 69, 0.4)",
                          }}
                        >
                          {loading || processing ? (
                            <>
                              <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                              />
                              Processing...
                            </>
                          ) : (
                            <>
                              Place Order - ${orderSummary.total.toFixed(2)}
                              <CheckIcon
                                width={20}
                                height={20}
                                className="ms-2"
                              />
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              {/* Step 4: Stripe Payment Processing */}
              {step === 4 && (
                <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                  <div className="bg-gradient-light p-4 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-4">
                        <CreditCardIcon
                          width={28}
                          height={28}
                          className="text-warning"
                        />
                      </div>
                      <div>
                        <h4 className="fw-bold mb-1 text-dark">
                          Secure Payment Processing
                        </h4>
                        <p className="text-muted mb-0">
                          Complete your payment securely with Stripe
                        </p>
                      </div>
                    </div>
                  </div>
                  <Card.Body className="p-4">
                    {paymentError && (
                      <Alert variant="danger" className="mb-4">
                        <Alert.Heading>Payment Error</Alert.Heading>
                        <p>{paymentError}</p>
                        <Button
                          variant="outline-danger"
                          onClick={() => {
                            setPaymentError("");
                            setStep(3);
                          }}
                        >
                          Go Back
                        </Button>
                      </Alert>
                    )}

                    <StripeCheckout
                      orderData={getStripeOrderData()}
                      onSuccess={handleStripeSuccess}
                      onError={handleStripeError}
                    />

                    <div className="mt-4 text-center">
                      <Button
                        variant="outline-secondary"
                        onClick={() => setStep(3)}
                        disabled={processing}
                      >
                        Back to Review
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>

            {/* Order Summary Sidebar */}
            <Col lg={4}>
              <Card
                className="border-0 shadow-sm sticky-top"
                style={{ top: "100px" }}
              >
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <ShieldCheckIcon
                      width={24}
                      height={24}
                      className="text-primary me-2"
                    />
                    <h5 className="fw-bold mb-0">Order Summary</h5>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    {orderSummary.items.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex justify-content-between mb-3 p-2 bg-light rounded-2"
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="rounded me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <div className="small fw-bold">{item.name}</div>
                            <div className="text-muted small">
                              Qty: {item.quantity} | {item.size} | {item.color}
                            </div>
                          </div>
                        </div>
                        <div className="small fw-bold text-primary">
                          $
                          {(
                            parseFloat(item.price || 0) * item.quantity
                          ).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <span className="fw-medium">
                        ${orderSummary.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping</span>
                      <span
                        className={
                          orderSummary.shipping === 0
                            ? "text-success fw-bold"
                            : "fw-medium"
                        }
                      >
                        {orderSummary.shipping === 0
                          ? "FREE"
                          : `$${orderSummary.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax</span>
                      <span className="fw-medium">
                        ${orderSummary.tax.toFixed(2)}
                      </span>
                    </div>
                    {orderSummary.discount > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Discount</span>
                        <span className="fw-bold">
                          -${orderSummary.discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <hr className="my-3" />
                    <div className="d-flex justify-content-between">
                      <h5 className="mb-0">Total</h5>
                      <h5 className="mb-0 text-primary fw-bold">
                        ${orderSummary.total.toFixed(2)}
                      </h5>
                    </div>
                  </div>

                  {/* Enhanced Security Features */}
                  <div className="pt-3 border-top">
                    <div className="d-flex align-items-center mb-2">
                      <ShieldCheckIcon
                        width={16}
                        height={16}
                        className="text-success me-2"
                      />
                      <small className="text-muted">
                        256-bit SSL encryption
                      </small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <ShieldCheckIcon
                        width={16}
                        height={16}
                        className="text-success me-2"
                      />
                      <small className="text-muted">
                        Secure payment processing
                      </small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <TruckIcon
                        width={16}
                        height={16}
                        className="text-success me-2"
                      />
                      <small className="text-muted">
                        Free shipping over $50
                      </small>
                    </div>
                    <div className="d-flex align-items-center">
                      <CheckIcon
                        width={16}
                        height={16}
                        className="text-success me-2"
                      />
                      <small className="text-muted">30-day return policy</small>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="mt-3 pt-3 border-top">
                    <div className="text-center">
                      <TruckIcon
                        width={24}
                        height={24}
                        className="text-primary mb-2"
                      />
                      <h6 className="fw-bold text-primary mb-1">
                        Estimated Delivery
                      </h6>
                      <p className="small text-muted mb-0">
                        <strong>5-7 business days</strong>
                        <br />
                        <small>Standard Shipping</small>
                      </p>
                    </div>
                  </div>

                  {/* Payment Icons */}
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted d-block mb-2">
                      Secure payment with:
                    </small>
                    <div className="d-flex gap-2 flex-wrap">
                      <div className="bg-light rounded px-2 py-1 small fw-bold">
                        💳 VISA
                      </div>
                      <div className="bg-light rounded px-2 py-1 small fw-bold">
                        💳 MC
                      </div>
                      <div className="bg-light rounded px-2 py-1 small fw-bold">
                        💳 AMEX
                      </div>
                      <div className="bg-light rounded px-2 py-1 small fw-bold">
                        🅿️ PayPal
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Checkout;
