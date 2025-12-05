import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import {
  DocumentTextIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Terms = () => {
  const termsSections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing and using ShoesFeminine, you accept and agree to be bound by the terms
      and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      title: "Use License",
      content: `Permission is granted to temporarily download one copy of the materials on ShoesFeminine
      for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
      of title, and under this license you may not:
      • Modify or copy the materials
      • Use the materials for any commercial purpose or for any public display
      • Attempt to decompile or reverse engineer any software contained on the website
      • Remove any copyright or other proprietary notations from the materials`,
    },
    {
      title: "User Accounts",
      content: `When you create an account with us, you must provide information that is accurate,
      complete, and current at all times. You are responsible for safeguarding the password and
      for all activities that occur under your account. You agree not to disclose your password
      to any third party.`,
    },
    {
      title: "Products and Pricing",
      content: `All products are subject to availability. We reserve the right to discontinue any
      product at any time. Prices for our products are subject to change without notice. We
      strive to display accurate price information, but errors may occur. In the event of a
      pricing error, we reserve the right to cancel orders.`,
    },
    {
      title: "Shipping and Delivery",
      content: `We will make reasonable efforts to deliver products within the estimated timeframe,
      but we are not responsible for delays caused by factors beyond our control. Risk of loss
      passes to the buyer upon delivery to the carrier.`,
    },
    {
      title: "Returns and Exchanges",
      content: `Items may be returned within 30 days of purchase in accordance with our return policy.
      Items must be unworn, in original packaging with tags attached. Return shipping costs may
      apply unless otherwise specified.`,
    },
    {
      title: "Limitation of Liability",
      content: `In no event shall ShoesFeminine or its suppliers be liable for any damages (including,
      without limitation, damages for loss of data or profit, or due to business interruption)
      arising out of the use or inability to use the materials on our website.`,
    },
    {
      title: "Governing Law",
      content: `These terms and conditions are governed by and construed in accordance with the
      laws of the State of New York, and you irrevocably submit to the exclusive jurisdiction
      of the courts in that state or location.`,
    },
  ];

  return (
    <div className="terms-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-4">Terms of Service</h1>
              <p className="lead text-muted">
                Please read these terms carefully before using our services
              </p>
              <p className="text-muted">Last updated: November 28, 2025</p>
            </div>

            <Row className="g-4 mb-5">
              <Col md={4}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body className="p-4">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <DocumentTextIcon width={30} height={30} />
                    </div>
                    <h5 className="fw-bold mb-2">Clear Terms</h5>
                    <p className="text-muted">
                      Transparent and easy-to-understand terms
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body className="p-4">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <ScaleIcon width={30} height={30} />
                    </div>
                    <h5 className="fw-bold mb-2">Fair Usage</h5>
                    <p className="text-muted">
                      Balanced terms that protect both parties
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body className="p-4">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <ShieldCheckIcon width={30} height={30} />
                    </div>
                    <h5 className="fw-bold mb-2">Your Rights</h5>
                    <p className="text-muted">
                      Clear understanding of your rights and obligations
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h3 className="mb-0">Terms and Conditions</h3>
              </Card.Header>
              <Card.Body className="p-4">
                <Accordion>
                  {termsSections.map((section, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index}>
                      <Accordion.Header>{section.title}</Accordion.Header>
                      <Accordion.Body>{section.content}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mt-4">
              <Card.Body className="text-center p-4">
                <h4 className="fw-bold mb-3">Questions About These Terms?</h4>
                <p className="text-muted mb-4">
                  If you have any questions about these Terms of Service, please
                  contact our legal team.
                </p>
                <button className="btn btn-primary px-4">
                  Contact Legal Team
                </button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Terms;
