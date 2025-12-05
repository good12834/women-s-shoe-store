import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";

const AdminDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Admin protection
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      if (user?.role !== "admin") {
        navigate("/");
        return;
      }
    }
  }, [isAuthenticated, loading, user, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Checking authentication...</p>
        </div>
      </Container>
    );
  }

  // Don't render if not authenticated or not admin
  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <Container fluid className="py-4 admin-dashboard">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-1">Admin Dashboard</h2>
          <p className="text-muted mb-0">Manage your store operations</p>
        </Col>
      </Row>

      <Alert variant="success">
        Admin Dashboard is working! This is a simplified version to test the
        basic functionality.
      </Alert>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5>Quick Stats</h5>
              <p>User: {user?.name}</p>
              <p>Role: {user?.role}</p>
              <p>Email: {user?.email}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
