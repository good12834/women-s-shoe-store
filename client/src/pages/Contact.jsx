import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const Contact = () => {
  return (
    <div className="contact-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-4">Contact Us</h1>
              <p className="lead text-muted">
                We'd love to hear from you. Get in touch with our team.
              </p>
            </div>

            <Row className="g-5">
              <Col lg={6}>
                <div className="mb-5">
                  <h2 className="fw-bold mb-4">Get In Touch</h2>
                  <p className="mb-4">
                    Have a question about our products, need help with an order,
                    or want to share feedback? We're here to help! Reach out to
                    us through any of the channels below.
                  </p>

                  <div className="contact-info">
                    <div className="d-flex align-items-start mb-4">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: "50px", height: "50px", flexShrink: 0 }}
                      >
                        <MapPinIcon width={24} height={24} />
                      </div>
                      <div>
                        <h5 className="mb-1">Visit Our Store</h5>
                        <p className="text-muted mb-0">
                          123 Fashion Street
                          <br />
                          New York, NY 10001
                          <br />
                          United States
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-4">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: "50px", height: "50px", flexShrink: 0 }}
                      >
                        <PhoneIcon width={24} height={24} />
                      </div>
                      <div>
                        <h5 className="mb-1">Call Us</h5>
                        <p className="text-muted mb-0">
                          +1 (555) 123-4567
                          <br />
                          Mon-Fri: 9AM - 6PM EST
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-4">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: "50px", height: "50px", flexShrink: 0 }}
                      >
                        <EnvelopeIcon width={24} height={24} />
                      </div>
                      <div>
                        <h5 className="mb-1">Email Us</h5>
                        <p className="text-muted mb-0">
                          hello@shoesfeminine.com
                          <br />
                          support@shoesfeminine.com
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: "50px", height: "50px", flexShrink: 0 }}
                      >
                        <ClockIcon width={24} height={24} />
                      </div>
                      <div>
                        <h5 className="mb-1">Business Hours</h5>
                        <p className="text-muted mb-0">
                          Monday - Friday: 9:00 AM - 6:00 PM
                          <br />
                          Saturday: 10:00 AM - 4:00 PM
                          <br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h3 className="fw-bold mb-4">Send us a Message</h3>
                    <Form>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter your first name"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter your last name"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mt-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                        />
                      </Form.Group>

                      <Form.Group className="mt-3">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="What's this about?"
                        />
                      </Form.Group>

                      <Form.Group className="mt-3">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          placeholder="Tell us how we can help you..."
                        />
                      </Form.Group>

                      <Button type="submit" className="w-100 mt-4" size="lg">
                        Send Message
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
