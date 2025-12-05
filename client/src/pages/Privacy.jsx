import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import {
  ShieldCheckIcon,
  EyeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const Privacy = () => {
  const privacySections = [
    {
      title: "Information We Collect",
      content: `We collect information you provide directly to us, such as when you create an account,
      make a purchase, or contact us for support. This includes your name, email address, shipping address,
      payment information, and any other information you choose to provide.`,
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect to:
      • Process and fulfill your orders
      • Provide customer service and support
      • Send you important updates about your orders
      • Improve our products and services
      • Send marketing communications (with your consent)
      • Comply with legal obligations`,
    },
    {
      title: "Information Sharing",
      content: `We do not sell, trade, or rent your personal information to third parties. We may share
      your information only in the following circumstances:
      • With service providers who help us operate our business
      • To comply with legal obligations
      • To protect our rights and prevent fraud
      • With your explicit consent`,
    },
    {
      title: "Data Security",
      content: `We implement appropriate technical and organizational measures to protect your personal
      information against unauthorized access, alteration, disclosure, or destruction. This includes
      encryption of sensitive data and regular security assessments.`,
    },
    {
      title: "Your Rights",
      content: `You have the right to:
      • Access the personal information we hold about you
      • Correct inaccurate or incomplete information
      • Request deletion of your personal information
      • Object to or restrict processing of your information
      • Data portability
      • Withdraw consent for marketing communications`,
    },
    {
      title: "Cookies and Tracking",
      content: `We use cookies and similar technologies to enhance your browsing experience,
      analyze site traffic, and personalize content. You can control cookie settings through your
      browser preferences. See our Cookie Policy for more details.`,
    },
    {
      title: "Third-Party Services",
      content: `Our website may contain links to third-party websites or integrate with third-party
      services. We are not responsible for the privacy practices of these external sites or services.
      We encourage you to review their privacy policies.`,
    },
    {
      title: "Children's Privacy",
      content: `Our services are not intended for children under 13 years of age. We do not knowingly
      collect personal information from children under 13. If we become aware that we have collected
      personal information from a child under 13, we will take steps to delete such information.`,
    },
    {
      title: "Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of any changes
      by posting the new Privacy Policy on this page and updating the "Last updated" date. Your
      continued use of our services after any changes constitutes acceptance of the updated policy.`,
    },
  ];

  return (
    <div className="privacy-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-4">Privacy Policy</h1>
              <p className="lead text-muted">
                Your privacy is important to us. Learn how we collect, use, and
                protect your information.
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
                      <ShieldCheckIcon width={30} height={30} />
                    </div>
                    <h5 className="fw-bold mb-2">Data Protection</h5>
                    <p className="text-muted">
                      We implement robust security measures to protect your
                      information
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
                      <EyeIcon width={30} height={30} />
                    </div>
                    <h5 className="fw-bold mb-2">Transparency</h5>
                    <p className="text-muted">
                      We clearly explain how we use your data and your rights
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
                      <LockClosedIcon width={30} height={30} />
                    </div>
                    <h5 className="fw-bold mb-2">Your Control</h5>
                    <p className="text-muted">
                      You have control over your data and how it's used
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h3 className="mb-0">Detailed Privacy Information</h3>
              </Card.Header>
              <Card.Body className="p-4">
                <Accordion>
                  {privacySections.map((section, index) => (
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
                <h4 className="fw-bold mb-3">Questions About Your Privacy?</h4>
                <p className="text-muted mb-4">
                  If you have any questions about this Privacy Policy or our
                  data practices, please don't hesitate to contact us.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button className="btn btn-primary px-4">
                    Contact Privacy Team
                  </button>
                  <button className="btn btn-outline-primary px-4">
                    Data Request Form
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Privacy;
