import { Container, Row, Col, Accordion, Card } from "react-bootstrap";
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Ordering & Payment",
      icon: <QuestionMarkCircleIcon width={24} height={24} />,
      questions: [
        {
          q: "How do I place an order?",
          a: "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, provide shipping information, and complete payment.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept Visa, MasterCard, American Express, PayPal, Apple Pay, and Google Pay. All payments are processed securely through encrypted connections.",
        },
        {
          q: "Is my payment information secure?",
          a: "Yes, we use industry-standard SSL encryption and PCI-compliant payment processors to ensure your payment information is completely secure.",
        },
        {
          q: "Can I modify or cancel my order?",
          a: "Orders can be modified or cancelled within 2 hours of placement by contacting our customer service team. Once processing begins, changes may not be possible.",
        },
      ],
    },
    {
      title: "Shipping & Delivery",
      icon: <QuestionMarkCircleIcon width={24} height={24} />,
      questions: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Overnight shipping delivers the next business day. International shipping varies by destination.",
        },
        {
          q: "Do you offer free shipping?",
          a: "Yes! We offer free standard shipping on all orders over $50 within the United States. International orders have different free shipping thresholds.",
        },
        {
          q: "Can I track my order?",
          a: "Yes, you'll receive a tracking number via email once your order ships. You can also track your order status in your account dashboard.",
        },
        {
          q: "What if my package is damaged or lost?",
          a: "If your package arrives damaged, please contact us immediately with photos. We'll arrange for a replacement or refund. For lost packages, we'll work with the carrier to locate it.",
        },
      ],
    },
    {
      title: "Returns & Exchanges",
      icon: <QuestionMarkCircleIcon width={24} height={24} />,
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer a 30-day return policy for unworn shoes in their original packaging with tags attached. Returns are free for orders over $50.",
        },
        {
          q: "How do I return an item?",
          a: "Contact our customer service team to initiate a return. We'll provide a prepaid return label and instructions. Once received, we'll process your refund within 3-5 business days.",
        },
        {
          q: "Can I exchange an item for a different size?",
          a: "Yes, we offer exchanges for different sizes or colors within 30 days. If the new item costs more, you'll pay the difference. If it costs less, we'll refund the difference.",
        },
        {
          q: "How long do refunds take?",
          a: "Refunds are processed within 3-5 business days after we receive your return. The time for the refund to appear in your account depends on your payment method.",
        },
      ],
    },
    {
      title: "Product & Sizing",
      icon: <QuestionMarkCircleIcon width={24} height={24} />,
      questions: [
        {
          q: "How do I know my shoe size?",
          a: "Check our Size Guide for detailed measurements. We recommend measuring your foot and comparing it to our size chart. If you're between sizes, we suggest going up half a size.",
        },
        {
          q: "Are your shoes true to size?",
          a: "Most of our shoes run true to size, but some styles may fit differently. We include specific fit notes on each product page. If you're unsure, contact our size experts.",
        },
        {
          q: "Do you offer wide or narrow sizes?",
          a: "We offer various width options including narrow (AA), medium (B), and wide (D) widths. Width availability varies by style and is indicated on the product page.",
        },
        {
          q: "Are your shoes comfortable?",
          a: "Comfort is our priority! We use premium materials and cushioning technology. All shoes include memory foam insoles and are designed for all-day wear.",
        },
      ],
    },
  ];

  return (
    <div className="faq-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-4">Frequently Asked Questions</h1>
              <p className="lead text-muted">
                Find quick answers to common questions about our products and
                services
              </p>
            </div>

            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-5">
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "50px", height: "50px" }}
                  >
                    {category.icon}
                  </div>
                  <h2 className="fw-bold mb-0">{category.title}</h2>
                </div>

                <Accordion className="mb-4">
                  {category.questions.map((faq, faqIndex) => (
                    <Accordion.Item
                      eventKey={`${categoryIndex}-${faqIndex}`}
                      key={faqIndex}
                    >
                      <Accordion.Header>{faq.q}</Accordion.Header>
                      <Accordion.Body>{faq.a}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            ))}

            {/* Contact Support */}
            <Card className="border-0 shadow-sm bg-light">
              <Card.Body className="text-center p-5">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <ChatBubbleLeftRightIcon
                    width={32}
                    height={32}
                    className="text-primary me-3"
                  />
                  <h3 className="fw-bold mb-0">Still Have Questions?</h3>
                </div>
                <p className="text-muted mb-4">
                  Can't find the answer you're looking for? Our friendly
                  customer service team is here to help.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button className="btn btn-primary px-4">
                    Contact Support
                  </button>
                  <button className="btn btn-outline-primary px-4">
                    Live Chat
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

export default FAQ;
