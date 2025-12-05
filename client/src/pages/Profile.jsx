import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Alert,
  Badge,
} from "react-bootstrap";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import ToastNotification from "../components/ToastNotification";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonLoader from "../components/SkeletonLoader";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState({
    name: "Jane Doe",
    email: "jane@example.com",
  });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({
    user: true,
    addresses: true,
    orders: true,
  });
  const [errors, setErrors] = useState({
    user: null,
    addresses: null,
    orders: null,
  });
  const [editingUser, setEditingUser] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    message: "",
    type: "success",
  });

  // Simulate API calls
  useEffect(() => {
    loadUserData();
    loadAddresses();
    loadOrders();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading((prev) => ({ ...prev, user: true }));
      setErrors((prev) => ({ ...prev, user: null }));
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUser({ name: "Jane Doe", email: "jane@example.com" });
    } catch (error) {
      setErrors((prev) => ({ ...prev, user: "Failed to load user data" }));
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  };

  const loadAddresses = async () => {
    try {
      setLoading((prev) => ({ ...prev, addresses: true }));
      setErrors((prev) => ({ ...prev, addresses: null }));
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAddresses([
        {
          id: 1,
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zip_code: "10001",
          country: "USA",
        },
      ]);
    } catch (error) {
      setErrors((prev) => ({ ...prev, addresses: "Failed to load addresses" }));
    } finally {
      setLoading((prev) => ({ ...prev, addresses: false }));
    }
  };

  const loadOrders = async () => {
    try {
      setLoading((prev) => ({ ...prev, orders: true }));
      setErrors((prev) => ({ ...prev, orders: null }));
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setOrders([
        { id: 101, date: "2023-10-20", total: 120.5, status: "Delivered" },
        { id: 102, date: "2023-11-15", total: 89.99, status: "Processing" },
      ]);
    } catch (error) {
      setErrors((prev) => ({ ...prev, orders: "Failed to load orders" }));
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  const showToastMessage = (message, type = "success") => {
    setToastConfig({ message, type });
    setShowToast(true);
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading((prev) => ({ ...prev, user: true }));
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEditingUser(false);
      showToastMessage("Profile updated successfully!");
    } catch (error) {
      showToastMessage("Failed to update profile", "error");
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  };

  const handleAddAddress = async () => {
    try {
      setLoading((prev) => ({ ...prev, addresses: true }));
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newAddress = {
        id: Date.now(),
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zip_code: "90210",
        country: "USA",
      };
      setAddresses((prev) => [...prev, newAddress]);
      showToastMessage("Address added successfully!");
    } catch (error) {
      showToastMessage("Failed to add address", "error");
    } finally {
      setLoading((prev) => ({ ...prev, addresses: false }));
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      setLoading((prev) => ({ ...prev, addresses: true }));
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      showToastMessage("Address deleted successfully!");
    } catch (error) {
      showToastMessage("Failed to delete address", "error");
    } finally {
      setLoading((prev) => ({ ...prev, addresses: false }));
    }
  };

  const renderUserInfoTab = () => {
    if (loading.user) {
      return (
        <Card>
          <Card.Body>
            <SkeletonLoader type="text" count={3} />
          </Card.Body>
        </Card>
      );
    }

    if (errors.user) {
      return (
        <Alert
          variant="danger"
          className="d-flex align-items-center justify-content-between"
        >
          <div>
            <i className="bi bi-exclamation-triangle me-2"></i>
            {errors.user}
          </div>
          <Button variant="outline-danger" size="sm" onClick={loadUserData}>
            <ArrowPathIcon width={16} height={16} className="me-1" />
            Retry
          </Button>
        </Alert>
      );
    }

    return (
      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Full Name</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="text"
                  value={user.name}
                  readOnly={!editingUser}
                  className={`${
                    !editingUser ? "bg-light" : ""
                  } border-0 border-bottom border-2`}
                  style={{ borderRadius: "0" }}
                />
                {editingUser && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setEditingUser(false)}
                    className="ms-2"
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email Address</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="email"
                  value={user.email}
                  readOnly={!editingUser}
                  className={`${
                    !editingUser ? "bg-light" : ""
                  } border-0 border-bottom border-2`}
                  style={{ borderRadius: "0" }}
                />
                {editingUser && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setEditingUser(false)}
                    className="ms-2"
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </div>
            </Form.Group>

            <div className="d-flex gap-2">
              {!editingUser ? (
                <Button
                  variant="outline-primary"
                  onClick={() => setEditingUser(true)}
                  className="d-flex align-items-center"
                >
                  <PencilIcon width={16} height={16} className="me-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={handleUpdateProfile}
                    disabled={loading.user}
                    className="d-flex align-items-center"
                  >
                    {loading.user ? (
                      <LoadingSpinner size="sm" text="" className="me-2 p-0" />
                    ) : (
                      <i className="bi bi-check me-2"></i>
                    )}
                    Save Changes
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setEditingUser(false)}
                    disabled={loading.user}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  };

  const renderAddressesTab = () => {
    if (loading.addresses) {
      return (
        <div>
          <Button variant="success" className="mb-3" disabled>
            <PlusIcon width={16} height={16} className="me-2" />
            Add New Address
          </Button>
          <Row>
            {[1, 2].map((i) => (
              <Col md={6} key={i} className="mb-3">
                <Card>
                  <Card.Body>
                    <SkeletonLoader type="text" count={4} />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      );
    }

    if (errors.addresses) {
      return (
        <Alert
          variant="danger"
          className="d-flex align-items-center justify-content-between"
        >
          <div>
            <i className="bi bi-exclamation-triangle me-2"></i>
            {errors.addresses}
          </div>
          <Button variant="outline-danger" size="sm" onClick={loadAddresses}>
            <ArrowPathIcon width={16} height={16} className="me-1" />
            Retry
          </Button>
        </Alert>
      );
    }

    return (
      <div>
        <Button
          variant="success"
          className="mb-3 d-flex align-items-center"
          onClick={handleAddAddress}
          disabled={loading.addresses}
        >
          {loading.addresses ? (
            <LoadingSpinner size="sm" text="" className="me-2 p-0" />
          ) : (
            <PlusIcon width={16} height={16} className="me-2" />
          )}
          Add New Address
        </Button>

        {addresses.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-5">
              <i className="bi bi-geo-alt display-1 text-muted"></i>
              <h5 className="mt-3 text-muted">No addresses yet</h5>
              <p className="text-muted">
                Add your first address to get started
              </p>
              <Button
                variant="primary"
                onClick={handleAddAddress}
                disabled={loading.addresses}
              >
                <PlusIcon width={16} height={16} className="me-2" />
                Add Address
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {addresses.map((addr) => (
              <Col md={6} key={addr.id} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex align-items-start">
                        <i className="bi bi-house-door text-primary me-2 mt-1"></i>
                        <div>
                          {addr.street}
                          <br />
                          <small className="text-muted">
                            {addr.city}, {addr.state} {addr.zip_code}
                            <br />
                            {addr.country}
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center"
                      >
                        <PencilIcon width={14} height={14} className="me-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="d-flex align-items-center"
                        onClick={() => handleDeleteAddress(addr.id)}
                        disabled={loading.addresses}
                      >
                        <TrashIcon width={14} height={14} className="me-1" />
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  };

  const renderOrdersTab = () => {
    if (loading.orders) {
      return (
        <ListGroup>
          {[1, 2, 3].map((i) => (
            <ListGroup.Item
              key={i}
              className="d-flex justify-content-between align-items-center"
            >
              <SkeletonLoader type="text" count={2} />
              <div className="text-end">
                <SkeletonLoader type="text" />
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      );
    }

    if (errors.orders) {
      return (
        <Alert
          variant="danger"
          className="d-flex align-items-center justify-content-between"
        >
          <div>
            <i className="bi bi-exclamation-triangle me-2"></i>
            {errors.orders}
          </div>
          <Button variant="outline-danger" size="sm" onClick={loadOrders}>
            <ArrowPathIcon width={16} height={16} className="me-1" />
            Retry
          </Button>
        </Alert>
      );
    }

    return (
      <>
        {orders.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-5">
              <i className="bi bi-bag display-1 text-muted"></i>
              <h5 className="mt-3 text-muted">No orders yet</h5>
              <p className="text-muted">
                Start shopping to see your order history
              </p>
              <Button variant="primary" href="/shop">
                <i className="bi bi-shop me-2"></i>
                Start Shopping
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <ListGroup variant="flush">
            {orders.map((order) => (
              <ListGroup.Item
                key={order.id}
                className="d-flex justify-content-between align-items-center py-3 border-0 border-bottom"
              >
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <i className="bi bi-bag text-primary fs-4"></i>
                  </div>
                  <div>
                    <h6 className="mb-1 fw-semibold">Order #{order.id}</h6>
                    <small className="text-muted d-flex align-items-center">
                      <i className="bi bi-calendar me-1"></i>
                      {new Date(order.date).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <div className="text-end">
                  <h5 className="text-primary mb-1">${order.total}</h5>
                  <Badge
                    bg={
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Processing"
                        ? "warning"
                        : order.status === "Shipped"
                        ? "info"
                        : "secondary"
                    }
                    className="text-uppercase fw-light"
                  >
                    {order.status}
                  </Badge>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </>
    );
  };

  return (
    <>
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 fw-bold">My Account</h2>
          <div className="text-muted">
            <i className="bi bi-person-circle me-2"></i>
            {user.name}
          </div>
        </div>

        <style>{`
          .custom-tabs {
            display: flex;
            border-bottom: 2px solid #e9ecef;
            margin-bottom: 0;
          }
          
          .custom-tab {
            padding: 1rem 1.5rem;
            background: none;
            border: none;
            color: #6c757d;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .custom-tab:hover {
            color: var(--primary-color);
            background: rgba(233, 30, 99, 0.05);
            border-bottom-color: var(--primary-light);
          }
          
          .custom-tab.active {
            color: var(--primary-color);
            border-bottom-color: var(--primary-color);
            background: rgba(233, 30, 99, 0.1);
            font-weight: 600;
          }
          
          .tab-content {
            background: white;
            padding: 2rem;
            animation: fadeIn 0.3s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="custom-tabs">
              <button
                className={`custom-tab ${activeTab === "info" ? "active" : ""}`}
                onClick={() => setActiveTab("info")}
              >
                <i className="bi bi-person"></i>
                Personal Info
              </button>
              <button
                className={`custom-tab ${
                  activeTab === "addresses" ? "active" : ""
                }`}
                onClick={() => setActiveTab("addresses")}
              >
                <i className="bi bi-geo-alt"></i>
                Address Book
                {addresses.length > 0 && (
                  <Badge bg="secondary" className="ms-1">
                    {addresses.length}
                  </Badge>
                )}
              </button>
              <button
                className={`custom-tab ${
                  activeTab === "orders" ? "active" : ""
                }`}
                onClick={() => setActiveTab("orders")}
              >
                <i className="bi bi-bag"></i>
                Order History
                {orders.length > 0 && (
                  <Badge bg="secondary" className="ms-1">
                    {orders.length}
                  </Badge>
                )}
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "info" && renderUserInfoTab()}
              {activeTab === "addresses" && renderAddressesTab()}
              {activeTab === "orders" && renderOrdersTab()}
            </div>
          </Card.Body>
        </Card>
      </Container>

      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastConfig.message}
        type={toastConfig.type}
      />
    </>
  );
};

export default Profile;
