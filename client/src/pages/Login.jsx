import { useState, useEffect } from "react";
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
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate individual fields
  const validateField = (name, value) => {
    switch (name) {
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
        return "";
      default:
        return "";
    }
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear login error when user makes changes
    if (loginError) {
      setLoginError("");
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    newErrors.email = validateField("email", formData.email);
    newErrors.password = validateField("password", formData.password);

    // Remove empty errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);

      // Handle remember me functionality
      if (formData.rememberMe) {
        localStorage.setItem("rememberEmail", formData.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      navigate("/");
    } catch (err) {
      setLoginError(
        err.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

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
                  <LockClosedIcon
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
                  Welcome Back
                </h2>
                <p className="text-muted">
                  Sign in to continue your shopping journey
                </p>
              </div>

              {loginError && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setLoginError("")}
                  className="mb-4"
                >
                  {loginError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
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
                      placeholder="Enter your password"
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

                {/* Remember Me and Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    label="Remember me"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="fw-medium"
                  />
                  <Link
                    to="/forgot-password"
                    className="text-decoration-none fw-medium"
                    style={{ color: "var(--primary-color)" }}
                  >
                    Forgot password?
                  </Link>
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
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Form>

              <div className="text-center">
                <p className="mb-3 text-muted">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-decoration-none fw-semibold"
                    style={{ color: "var(--primary-color)" }}
                  >
                    Create one here
                  </Link>
                </p>

                {/* Social Login Options (Future Enhancement) */}
                <div className="mt-4">
                  <div className="position-relative">
                    <div className="border-top"></div>
                    <div className="position-absolute top-0 start-50 translate-middle bg-white px-3">
                      <small className="text-muted">Or continue with</small>
                    </div>
                  </div>

                  <div className="row g-2 mt-3">
                    <div className="col-6">
                      <Button
                        variant="outline-secondary"
                        className="w-100 rounded-pill"
                        disabled
                      >
                        <i className="fab fa-google me-2"></i>
                        Google
                      </Button>
                    </div>
                    <div className="col-6">
                      <Button
                        variant="outline-secondary"
                        className="w-100 rounded-pill"
                        disabled
                      >
                        <i className="fab fa-facebook me-2"></i>
                        Facebook
                      </Button>
                    </div>
                  </div>
                  <small className="text-muted">
                    <em>Social login coming soon</em>
                  </small>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
