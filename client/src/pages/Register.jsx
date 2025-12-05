import { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate individual fields
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return "Full name is required";
        }
        if (value.trim().length < 2) {
          return "Name must be at least 2 characters long";
        }
        return "";
      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
        return "";
      case "password":
        if (!value.trim()) {
          return "Password is required";
        }
        if (value.length < 6) {
          return "Password must be at least 6 characters long";
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
        return "";
      case "confirmPassword":
        if (!value.trim()) {
          return "Please confirm your password";
        }
        if (value !== formData.password) {
          return "Passwords do not match";
        }
        return "";
      default:
        return "";
    }
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear register error when user makes changes
    if (registerError) {
      setRegisterError("");
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setRegisterError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column py-5"
      style={{
        background: "#fef1f6",
      }}
    >
      <Container className="my-auto">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-2xl animate-fadeIn border border-light">
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #fff0f5, #fff)",
                    border: "1px solid #ffe4e1",
                  }}
                >
                  <UserIcon
                    width={36}
                    height={36}
                    style={{ color: "var(--primary-color)" }}
                  />
                </div>
                <h2
                  className="fw-bold mb-2"
                  style={{
                    color: "var(--gray-900)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Create Account
                </h2>
                <p className="text-muted">
                  Join us to start your shopping journey
                </p>
              </div>

              {registerError && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setRegisterError("")}
                  className="mb-4"
                >
                  {registerError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                {/* Name Field */}
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <UserIcon width={18} height={18} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      isInvalid={!!errors.name}
                      className="border-start-0 form-control-premium"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Email Field */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <EnvelopeIcon
                        width={18}
                        height={18}
                        className="text-muted"
                      />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      isInvalid={!!errors.email}
                      className="border-start-0 form-control-premium"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <LockClosedIcon
                        width={18}
                        height={18}
                        className="text-muted"
                      />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      isInvalid={!!errors.password}
                      className="border-start-0 border-end-0 form-control-premium"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      className="border-start-0"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeSlashIcon width={16} height={16} />
                      ) : (
                        <EyeIcon width={16} height={16} />
                      )}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Confirm Password Field */}
                <Form.Group
                  className="mb-4"
                  controlId="formBasicConfirmPassword"
                >
                  <Form.Label className="fw-semibold">
                    Confirm Password
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <LockClosedIcon
                        width={18}
                        height={18}
                        className="text-muted"
                      />
                    </InputGroup.Text>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      isInvalid={!!errors.confirmPassword}
                      className="border-start-0 border-end-0 form-control-premium"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="border-start-0"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon width={16} height={16} />
                      ) : (
                        <EyeIcon width={16} height={16} />
                      )}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Password Requirements */}
                <div className="mb-4 p-3 bg-light rounded-3 border border-light">
                  <small className="text-muted">
                    <strong className="d-block mb-2">
                      Password must contain:
                    </strong>
                    <ul className="list-unstyled mb-0">
                      <li
                        className={`d-flex align-items-center mb-1 ${formData.password.length >= 6
                          ? "text-success"
                          : "text-muted"
                          }`}
                      >
                        <span className="me-2">
                          {formData.password.length >= 6 ? "✓" : "•"}
                        </span>
                        At least 6 characters
                      </li>
                      <li
                        className={`d-flex align-items-center mb-1 ${/(?=.*[a-z])/.test(formData.password)
                          ? "text-success"
                          : "text-muted"
                          }`}
                      >
                        <span className="me-2">
                          {/(?=.*[a-z])/.test(formData.password) ? "✓" : "•"}
                        </span>
                        One lowercase letter
                      </li>
                      <li
                        className={`d-flex align-items-center mb-1 ${/(?=.*[A-Z])/.test(formData.password)
                          ? "text-success"
                          : "text-muted"
                          }`}
                      >
                        <span className="me-2">
                          {/(?=.*[A-Z])/.test(formData.password) ? "✓" : "•"}
                        </span>
                        One uppercase letter
                      </li>
                      <li
                        className={`d-flex align-items-center ${/(?=.*\d)/.test(formData.password)
                          ? "text-success"
                          : "text-muted"
                          }`}
                      >
                        <span className="me-2">
                          {/(?=.*\d)/.test(formData.password) ? "✓" : "•"}
                        </span>
                        One number
                      </li>
                    </ul>
                  </small>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-4 btn-premium py-3 shadow-sm"
                  disabled={isLoading}
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary-color), var(--primary-dark))",
                    border: "none",
                  }}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Form>

              <div className="text-center">
                <p className="mb-0 text-muted">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-decoration-none fw-semibold"
                    style={{ color: "var(--primary-color)" }}
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
