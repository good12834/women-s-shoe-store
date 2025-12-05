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
import { Link } from "react-router-dom";
import { EnvelopeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setMessage("Password reset instructions have been sent to your email.");
        } catch (err) {
            setError("Failed to reset password. Please try again.");
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
                        <div className="bg-white p-5 rounded-4 shadow-2xl animate-fadeIn border border-light">
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
                                    <EnvelopeIcon
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
                                    Forgot Password?
                                </h2>
                                <p className="text-muted">
                                    Enter your email to reset your password
                                </p>
                            </div>

                            {error && (
                                <Alert
                                    variant="danger"
                                    dismissible
                                    onClose={() => setError("")}
                                    className="mb-4"
                                >
                                    {error}
                                </Alert>
                            )}

                            {message && (
                                <Alert
                                    variant="success"
                                    dismissible
                                    onClose={() => setMessage("")}
                                    className="mb-4"
                                >
                                    {message}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4" controlId="formBasicEmail">
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
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="border-start-0 form-control-premium"
                                        />
                                    </InputGroup>
                                </Form.Group>

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
                                            Sending...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="text-decoration-none fw-semibold d-inline-flex align-items-center"
                                    style={{ color: "var(--gray-600)" }}
                                >
                                    <ArrowLeftIcon width={16} height={16} className="me-2" />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ForgotPassword;
