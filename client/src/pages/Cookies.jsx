import { Container, Row, Col, Card, Accordion, Button } from "react-bootstrap";
import { CogIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const Cookies = () => {
  const cookieTypes = [
    {
      title: "Essential Cookies",
      description: "Required for the website to function properly",
      purpose:
        "These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services.",
      examples: [
        "Authentication cookies",
        "Security cookies",
        "Session management",
      ],
      required: true,
    },
    {
      title: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website",
      purpose:
        "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.",
      examples: [
        "Google Analytics",
        "Traffic analysis",
        "User behavior tracking",
      ],
      required: false,
    },
    {
      title: "Functional Cookies",
      description: "Enable enhanced functionality and personalization",
      purpose:
        "These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party providers whose services we have added to our pages.",
      examples: [
        "Language preferences",
        "Location settings",
        "Customized content",
      ],
      required: false,
    },
    {
      title: "Marketing Cookies",
      description: "Used to deliver relevant advertisements",
      purpose:
        "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts.",
      examples: [
        "Targeted advertising",
        "Social media pixels",
        "Retargeting cookies",
      ],
      required: false,
    },
  ];

  return (
    <div className="cookies-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-4">Cookie Policy</h1>
              <p className="lead text-muted">
                Learn about how we use cookies to improve your experience
              </p>
              <p className="text-muted">Last updated: November 28, 2025</p>
            </div>

            <Card className="border-0 shadow-sm mb-5">
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h3 className="fw-bold mb-3">What Are Cookies?</h3>
                    <p className="mb-0">
                      Cookies are small text files that are stored on your
                      computer or mobile device when you visit our website. They
                      help us provide you with a better browsing experience by
                      remembering your preferences and understanding how you use
                      our site.
                    </p>
                  </Col>
                  <Col md={4} className="text-center">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{ width: "80px", height: "80px" }}
                    >
                      🍪
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row className="g-4 mb-5">
              <Col md={4}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body className="p-4">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <CogIcon width={30} height={30} />
                    </div>
                    <h5 className="fw-bold mb-2">Your Control</h5>
                    <p className="text-muted">
                      You can manage your cookie preferences anytime
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
                      <ChartBarIcon width={30} height={30} />
                    </div>
                    <h5 className="fw-bold mb-2">Better Experience</h5>
                    <p className="text-muted">
                      Cookies help us improve your shopping experience
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body className="p-4">
                    <div
                      className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <span className="fw-bold">✓</span>
                    </div>
                    <h5 className="fw-bold mb-2">Safe & Secure</h5>
                    <p className="text-muted">
                      We only use cookies for legitimate purposes
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h3 className="mb-0">Types of Cookies We Use</h3>
              </Card.Header>
              <Card.Body className="p-4">
                <Accordion>
                  {cookieTypes.map((cookieType, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index}>
                      <Accordion.Header>
                        <div className="d-flex align-items-center">
                          <span className="fw-bold">{cookieType.title}</span>
                          {cookieType.required && (
                            <span className="badge bg-primary ms-2">
                              Required
                            </span>
                          )}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="mb-3">
                          <strong>Description:</strong> {cookieType.description}
                        </p>
                        <p className="mb-3">
                          <strong>Purpose:</strong> {cookieType.purpose}
                        </p>
                        <p className="mb-0">
                          <strong>Examples:</strong>
                        </p>
                        <ul>
                          {cookieType.examples.map((example, exIndex) => (
                            <li key={exIndex}>{example}</li>
                          ))}
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>

            <Row className="g-4 mt-4">
              <Col md={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <h5 className="fw-bold mb-3">Manage Your Cookies</h5>
                    <p className="text-muted mb-4">
                      You can control which cookies are set on your device
                      through your browser settings.
                    </p>
                    <Button variant="outline-primary">Cookie Settings</Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <h5 className="fw-bold mb-3">Questions?</h5>
                    <p className="text-muted mb-4">
                      Have questions about our cookie policy? Contact our
                      privacy team.
                    </p>
                    <Button variant="primary">Contact Us</Button>
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

export default Cookies;
