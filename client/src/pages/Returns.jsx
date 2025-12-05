import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import {
  ArrowPathIcon,
  ClockIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const Returns = () => {
  const returnSteps = [
    {
      step: 1,
      title: "Contact Us",
      description:
        "Reach out to our customer service team to initiate your return request.",
      icon: <ArrowPathIcon width={24} height={24} />,
    },
    {
      step: 2,
      title: "Package Item",
      description:
        "Pack your item securely in its original packaging with all tags attached.",
      icon: <TruckIcon width={24} height={24} />,
    },
    {
      step: 3,
      title: "Ship Back",
      description:
        "Use the prepaid return label we provide and ship the item back to us.",
      icon: <TruckIcon width={24} height={24} />,
    },
    {
      step: 4,
      title: "Refund Processed",
      description:
        "Once received, we'll process your refund within 3-5 business days.",
      icon: <ClockIcon width={24} height={24} />,
    },
  ];

  return (
    <div className="returns-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-4">Returns & Exchanges</h1>
              <p className="lead text-muted">
                We want you to be completely satisfied with your purchase
              </p>
            </div>

            <Alert variant="info" className="mb-5">
              <strong>30-Day Return Policy:</strong> We offer a 30-day return
              policy for unworn shoes in their original packaging with tags
              attached. Returns are free for orders over $50.
            </Alert>

            <Row className="g-4 mb-5">
              {returnSteps.map((step, index) => (
                <Col md={6} lg={3} key={index}>
                  <Card className="border-0 shadow-sm text-center h-100">
                    <Card.Body className="p-4">
                      <div
                        className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: "60px", height: "60px" }}
                      >
                        {step.icon}
                      </div>
                      <div
                        className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "30px",
                          height: "30px",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {step.step}
                      </div>
                      <h5 className="fw-bold mb-2">{step.title}</h5>
                      <p className="text-muted small mb-0">
                        {step.description}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <Row className="g-5">
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h4 className="mb-0">Return Eligibility</h4>
                  </Card.Header>
                  <Card.Body>
                    <h5 className="fw-bold mb-3">
                      Items We Accept for Return:
                    </h5>
                    <ul className="mb-4">
                      <li>Unworn shoes in original packaging</li>
                      <li>All tags and labels attached</li>
                      <li>Original shoebox included</li>
                      <li>Within 30 days of delivery</li>
                    </ul>

                    <h5 className="fw-bold mb-3">Items We Cannot Accept:</h5>
                    <ul className="mb-0">
                      <li>Worn or used shoes</li>
                      <li>Shoes without original packaging</li>
                      <li>Missing tags or labels</li>
                      <li>Customized or personalized items</li>
                      <li>Items damaged due to misuse</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h4 className="mb-0">Exchange Policy</h4>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-3">
                      We offer exchanges for different sizes or colors within 30
                      days of purchase. Exchanges are subject to availability.
                    </p>

                    <h5 className="fw-bold mb-3">Exchange Process:</h5>
                    <ol className="mb-4">
                      <li>Contact our customer service team</li>
                      <li>Confirm availability of your desired item</li>
                      <li>
                        Ship your current item back using our prepaid label
                      </li>
                      <li>
                        Receive your exchange item (additional shipping may
                        apply)
                      </li>
                    </ol>

                    <div className="bg-light p-3 rounded">
                      <strong>Note:</strong> If the exchange item costs more,
                      you'll pay the difference. If it costs less, we'll refund
                      the difference to your original payment method.
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="border-0 shadow-sm mt-5">
              <Card.Body className="text-center p-5">
                <h3 className="fw-bold mb-3">Need Help with a Return?</h3>
                <p className="text-muted mb-4">
                  Our customer service team is here to assist you with any
                  questions about returns or exchanges.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button className="btn btn-primary px-4">
                    Start Return Request
                  </button>
                  <button className="btn btn-outline-primary px-4">
                    Contact Support
                  </button>
                </div>
                <p className="text-muted mt-3 mb-0">
                  Available Monday - Friday: 9AM - 6PM EST
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Returns;
