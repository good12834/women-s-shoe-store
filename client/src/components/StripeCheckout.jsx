import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { CreditCardIcon } from "@heroicons/react/24/outline";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51S6FlVQg4BXMauysYGfgPUFR0XRVYxespEng4NQoFr9OKQcBJ0pz3XVspEiGrCtMftbpIs3pnvl052QbqavWfDKW00OtJymeIB"
);

// API base URL
const API_URL = "http://localhost:5000/api";

// Stripe Card Form Component
const StripeCardForm = ({
  clientSecret,
  onSuccess,
  onError,
  amount,
  orderData,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setMessage("");

    try {
      const cardElement = elements.getElement(CardElement);

      // Confirm payment with CardElement
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        setMessage(error.message);
        onError(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("Payment successful!");
        onSuccess(paymentIntent);
      } else {
        setMessage("Payment processing. Please wait...");
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="form-label fw-semibold mb-3">
          <CreditCardIcon className="me-2" width={20} height={20} />
          Card Details
        </label>
        <div className="stripe-card-element">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>

      {message && (
        <Alert
          variant={message.includes("successful") ? "success" : "danger"}
          className="mb-3"
        >
          {message}
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-100 py-3 fw-bold"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
        }}
      >
        {processing ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Processing Payment...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>
    </Form>
  );
};

// Payment Intent Form Component
const PaymentIntentForm = ({ orderData, onSuccess, onError }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // Simplify items for metadata (Stripe has 500 char limit per value)
      const simplifiedItems = orderData.items.map((item) => ({
        id: item.id,
        name: item.name.substring(0, 30), // Truncate name
        qty: item.quantity,
        price: item.price,
      }));

      // Truncate metadata to fit Stripe's limits
      const itemsJson = JSON.stringify(simplifiedItems);
      const truncatedItems =
        itemsJson.length > 490
          ? itemsJson.substring(0, 490) + "...]"
          : itemsJson;

      const response = await axios.post(
        `${API_URL}/payment/create-intent`,
        {
          amount: orderData.amount,
          currency: "usd",
          metadata: {
            order_items: truncatedItems,
            customer_email: orderData.customerEmail || "",
            item_count: orderData.items.length.toString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setClientSecret(response.data.paymentIntent.client_secret);
      } else {
        setError(response.data.error || "Failed to create payment intent");
        onError(response.data.error);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" className="mb-3" />
        <p>Setting up secure payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Payment Setup Error</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={createPaymentIntent}>
          Try Again
        </Button>
      </Alert>
    );
  }

  if (!clientSecret) {
    return (
      <Alert variant="warning">
        Unable to initialize payment. Please try again.
      </Alert>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripeCardForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
        amount={orderData.amount}
        orderData={orderData}
      />
    </Elements>
  );
};

// Main Stripe Checkout Component
const StripeCheckout = ({ orderData, onSuccess, onError }) => {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">
          <CreditCardIcon className="me-2" width={20} height={20} />
          Secure Payment
        </h5>
        <small>Powered by Stripe</small>
      </Card.Header>
      <Card.Body className="p-4">
        <PaymentIntentForm
          orderData={orderData}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Card.Body>
    </Card>
  );
};

export default StripeCheckout;
