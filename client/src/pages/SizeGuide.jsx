import { Container, Row, Col, Card, Table, Alert } from "react-bootstrap";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const SizeGuide = () => {
  const sizeChart = [
    { size: "5", length: '8.5"', width: '3.1"' },
    { size: "5.5", length: '8.7"', width: '3.1"' },
    { size: "6", length: '8.9"', width: '3.2"' },
    { size: "6.5", length: '9.1"', width: '3.2"' },
    { size: "7", length: '9.3"', width: '3.2"' },
    { size: "7.5", length: '9.4"', width: '3.3"' },
    { size: "8", length: '9.5"', width: '3.3"' },
    { size: "8.5", length: '9.7"', width: '3.3"' },
    { size: "9", length: '9.9"', width: '3.4"' },
    { size: "9.5", length: '10.0"', width: '3.4"' },
    { size: "10", length: '10.2"', width: '3.4"' },
    { size: "10.5", length: '10.3"', width: '3.5"' },
    { size: "11", length: '10.5"', width: '3.5"' },
    { size: "11.5", length: '10.7"', width: '3.5"' },
    { size: "12", length: '10.9"', width: '3.6"' },
  ];

  const measuringTips = [
    "Measure your foot at the end of the day when it's largest",
    "Stand on a piece of paper and mark the longest point",
    "Measure from heel to toe for the most accurate length",
    "Consider the width of your foot for proper fit",
    "If you're between sizes, go up half a size",
  ];

  return (
    <div className="size-guide-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-4">Size Guide</h1>
              <p className="lead text-muted">
                Find your perfect fit with our comprehensive size guide
              </p>
            </div>

            <Alert variant="info" className="mb-4">
              <div className="d-flex align-items-start">
                <ExclamationTriangleIcon
                  width={20}
                  height={20}
                  className="me-2 mt-1"
                />
                <div>
                  <strong>Important:</strong> Shoe sizes can vary by brand and
                  style. This guide is for reference only. If you're unsure
                  about your size, we recommend measuring your feet or
                  contacting our customer service.
                </div>
              </div>
            </Alert>

            <Row className="g-5">
              <Col lg={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h3 className="mb-0">Women's Shoe Size Chart</h3>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>US Size</th>
                          <th>Foot Length</th>
                          <th>Foot Width</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeChart.map((row, index) => (
                          <tr key={index}>
                            <td className="fw-semibold">{row.size}</td>
                            <td>{row.length}</td>
                            <td>{row.width}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">How to Measure</h5>
                  </Card.Header>
                  <Card.Body>
                    <ol className="mb-0">
                      <li className="mb-3">
                        Place a piece of paper on the floor against a wall
                      </li>
                      <li className="mb-3">
                        Stand on the paper with your heel against the wall
                      </li>
                      <li className="mb-3">
                        Mark the longest point of your toes
                      </li>
                      <li className="mb-3">
                        Measure the distance from wall to mark
                      </li>
                      <li>
                        Use this measurement to find your size in the chart
                      </li>
                    </ol>
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Measuring Tips</h5>
                  </Card.Header>
                  <Card.Body>
                    <ul className="list-unstyled mb-0">
                      {measuringTips.map((tip, index) => (
                        <li key={index} className="mb-2 d-flex">
                          <span className="text-primary me-2">•</span>
                          <span className="small">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-4 mt-4">
              <Col md={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <h5 className="fw-bold mb-3">Width Guide</h5>
                    <div className="mb-3">
                      <strong>AA:</strong> Narrowest width
                      <br />
                      <strong>A/B:</strong> Narrow width
                      <br />
                      <strong>B:</strong> Medium width
                      <br />
                      <strong>C/D:</strong> Wide width
                      <br />
                      <strong>E:</strong> Widest width
                    </div>
                    <p className="text-muted small mb-0">
                      Most of our shoes are available in B (medium) width
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <h5 className="fw-bold mb-3">Still Unsure?</h5>
                    <p className="text-muted mb-3">
                      Our customer service team is here to help you find the
                      perfect size
                    </p>
                    <div className="d-grid">
                      <button className="btn btn-primary">
                        Contact Size Help
                      </button>
                    </div>
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

export default SizeGuide;
