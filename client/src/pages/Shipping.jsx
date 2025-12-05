import { Container, Row, Col, Card, Table } from "react-bootstrap";
import {
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const Shipping = () => {
  const shippingOptions = [
    {
      method: "Standard Shipping",
      time: "5-7 business days",
      cost: "Free on orders $50+",
      description: "Perfect for non-urgent orders",
    },
    {
      method: "Express Shipping",
      time: "2-3 business days",
      cost: "$15.99",
      description: "Fast delivery for urgent needs",
    },
    {
      method: "Overnight Shipping",
      time: "1 business day",
      cost: "$29.99",
      description: "Next business day delivery",
    },
  ];

  const internationalShipping = [
    { region: "Canada", time: "7-10 business days", cost: "$25.99" },
    { region: "Europe", time: "10-14 business days", cost: "$35.99" },
    { region: "Asia Pacific", time: "12-18 business days", cost: "$45.99" },
    {
      region: "Other International",
      time: "14-21 business days",
      cost: "$55.99",
    },
  ];

  return (
    <div className="shipping-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-4">Shipping Information</h1>
              <p className="lead text-muted">
                Fast, reliable delivery to get your new shoes to you quickly
              </p>
            </div>

            <Row className="g-4 mb-5">
              <Col md={4}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body className="p-4">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <TruckIcon width={30} height={30} />
                    </div>
                    <h5 className="fw-bold mb-2">Fast Delivery</h5>
                    <p className="text-muted">
                      Multiple shipping options to fit your schedule
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
                      <MapPinIcon width={30} height={30} />
                    </div>
                    <h5 className="fw-bold mb-2">Worldwide Shipping</h5>
                    <p className="text-muted">
                      We ship to over 50 countries globally
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
                      <CurrencyDollarIcon width={30} height={30} />
                    </div>
                    <h5 className="fw-bold mb-2">Free Shipping</h5>
                    <p className="text-muted">
                      Free shipping on orders over $50
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Domestic Shipping */}
            <div className="mb-5">
              <h2 className="fw-bold mb-4">Domestic Shipping (US)</h2>
              <Row className="g-4">
                {shippingOptions.map((option, index) => (
                  <Col md={4} key={index}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body className="p-4">
                        <h5 className="fw-bold mb-3">{option.method}</h5>
                        <div className="d-flex align-items-center mb-2">
                          <ClockIcon
                            width={20}
                            height={20}
                            className="text-primary me-2"
                          />
                          <span className="fw-semibold">{option.time}</span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <CurrencyDollarIcon
                            width={20}
                            height={20}
                            className="text-primary me-2"
                          />
                          <span className="fw-semibold">{option.cost}</span>
                        </div>
                        <p className="text-muted small mb-0">
                          {option.description}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            {/* International Shipping */}
            <div className="mb-5">
              <h2 className="fw-bold mb-4">International Shipping</h2>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <Table responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>Region</th>
                        <th>Delivery Time</th>
                        <th>Shipping Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internationalShipping.map((region, index) => (
                        <tr key={index}>
                          <td className="fw-semibold">{region.region}</td>
                          <td>{region.time}</td>
                          <td>{region.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>

            {/* Shipping Policies */}
            <div className="mb-5">
              <h2 className="fw-bold mb-4">Shipping Policies</h2>
              <Row className="g-4">
                <Col md={6}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="fw-bold mb-3">Processing Time</h5>
                      <ul className="list-unstyled mb-0">
                        <li className="mb-2">
                          • Orders are processed within 1-2 business days
                        </li>
                        <li className="mb-2">
                          • Custom orders may take 3-5 business days
                        </li>
                        <li className="mb-2">
                          • Processing begins after payment is confirmed
                        </li>
                        <li>• You will receive a tracking number via email</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="fw-bold mb-3">Important Notes</h5>
                      <ul className="list-unstyled mb-0">
                        <li className="mb-2">
                          • Delivery times exclude weekends and holidays
                        </li>
                        <li className="mb-2">
                          • We are not responsible for customs delays
                        </li>
                        <li className="mb-2">
                          • Additional duties may apply for international orders
                        </li>
                        <li>
                          • Contact us if your order hasn't arrived within
                          expected timeframe
                        </li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Shipping;
