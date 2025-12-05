import { Container, Row, Col } from 'react-bootstrap';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="about-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-4">About ShoesFeminine</h1>
              <p className="lead text-muted">
                Empowering women to walk in confidence and style since 2020
              </p>
            </div>

            <Row className="g-5">
              <Col lg={6}>
                <div className="mb-5">
                  <h2 className="fw-bold mb-4">Our Story</h2>
                  <p className="mb-4">
                    ShoesFeminine was born from a simple belief: every woman deserves to feel
                    confident and beautiful in her footwear. Founded in 2020, we've been
                    dedicated to curating the finest collection of women's shoes that combine
                    fashion, comfort, and quality.
                  </p>
                  <p className="mb-4">
                    Our journey began with a small boutique and has grown into a beloved
                    destination for fashion-conscious women worldwide. We work directly with
                    designers and manufacturers to ensure every pair meets our high standards
                    of craftsmanship and style.
                  </p>
                  <p>
                    Today, ShoesFeminine continues to innovate, bringing you the latest trends
                    while maintaining our commitment to timeless elegance and exceptional
                    customer service.
                  </p>
                </div>
              </Col>

              <Col lg={6}>
                <div className="bg-light p-4 rounded-3">
                  <h3 className="fw-bold mb-4">Our Values</h3>
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <HeartIcon width={24} height={24} className="text-primary me-3" />
                      <div>
                        <h5 className="mb-1">Empowerment</h5>
                        <p className="text-muted small mb-0">
                          We believe great shoes empower women to conquer their day
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <StarIcon width={24} height={24} className="text-primary me-3" />
                      <div>
                        <h5 className="mb-1">Quality</h5>
                        <p className="text-muted small mb-0">
                          Every pair is crafted with premium materials and attention to detail
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="g-4 mt-3">
              <Col md={4}>
                <div className="text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <span className="fw-bold fs-4">50K+</span>
                  </div>
                  <h5 className="fw-bold">Happy Customers</h5>
                  <p className="text-muted">Women who trust our style</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <span className="fw-bold fs-4">1000+</span>
                  </div>
                  <h5 className="fw-bold">Shoe Styles</h5>
                  <p className="text-muted">From casual to formal</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <span className="fw-bold fs-4">5★</span>
                  </div>
                  <h5 className="fw-bold">Average Rating</h5>
                  <p className="text-muted">Customer satisfaction guaranteed</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;