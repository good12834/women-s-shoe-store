import { Container, Row, Col, Card, Accordion, Button } from "react-bootstrap";
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const Help = () => {
  const helpCategories = [
    {
      icon: <QuestionMarkCircleIcon width={24} height={24} />,
      title: "Getting Started",
      description: "Learn the basics of shopping with us",
    },
    {
      icon: <ChatBubbleLeftRightIcon width={24} height={24} />,
      title: "Account & Orders",
      description: "Manage your account and track orders",
    },
    {
      icon: <DocumentTextIcon width={24} height={24} />,
      title: "Returns & Exchanges",
      description: "Our return policy and how to process exchanges",
    },
  ];

  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        'You can track your order by logging into your account and visiting the "My Orders" section, or by using the tracking number provided in your shipping confirmation email.',
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unworn shoes in their original packaging. Returns are free for orders over $50. Please visit our Returns page for detailed instructions.",
    },
    {
      question: "How do I know my size?",
      answer:
        "Check our Size Guide for detailed measurements. We recommend measuring your foot and comparing it to our size chart. If you're between sizes, we suggest going up a half size.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can see exact rates during checkout.",
    },
    {
      question: "Can I cancel or modify my order?",
      answer:
        "Orders can be modified or cancelled within 2 hours of placement. Please contact our customer service team immediately if you need to make changes.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay for secure and convenient checkout.",
    },
  ];

  return (
    <div className="help-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-4">Help Center</h1>
              <p className="lead text-muted">
                Find answers to common questions and get the help you need
              </p>
            </div>

            {/* Help Categories */}
            <Row className="g-4 mb-5">
              {helpCategories.map((category, index) => (
                <Col md={4} key={index}>
                  <Card className="border-0 shadow-sm h-100 text-center">
                    <Card.Body className="p-4">
                      <div
                        className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: "60px", height: "60px" }}
                      >
                        {category.icon}
                      </div>
                      <h5 className="fw-bold mb-2">{category.title}</h5>
                      <p className="text-muted mb-3">{category.description}</p>
                      <Button variant="outline-primary" size="sm">
                        Learn More
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* FAQ Section */}
            <div className="mb-5">
              <h2 className="fw-bold mb-4 text-center">
                Frequently Asked Questions
              </h2>
              <Accordion>
                {faqs.map((faq, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>{faq.question}</Accordion.Header>
                    <Accordion.Body>{faq.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>

            {/* Contact Support */}
            <Card className="border-0 shadow-sm bg-light">
              <Card.Body className="text-center p-5">
                <h3 className="fw-bold mb-3">Still Need Help?</h3>
                <p className="text-muted mb-4">
                  Can't find what you're looking for? Our customer service team
                  is here to help.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Button size="lg" className="px-4">
                    Contact Support
                  </Button>
                  <Button variant="outline-primary" size="lg" className="px-4">
                    Live Chat
                  </Button>
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

export default Help;
