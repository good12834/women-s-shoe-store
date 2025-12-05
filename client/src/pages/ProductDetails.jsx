import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Form,
  Card,
  Badge,
  Tabs,
  Tab,
  Accordion,
} from "react-bootstrap";
import {
  HeartIcon,
  ShoppingBagIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  MagnifyingGlassPlusIcon,
  ShareIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";
import ToastNotification from "../components/ToastNotification";
import { getProductById } from "../services/mockData";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
  });
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);

        // Process variants to extract unique sizes and colors
        const uniqueSizes = [...new Set(data.variants.map((v) => v.size))];
        const uniqueColors = [
          ...new Set(
            data.variants.map((v) =>
              JSON.stringify({
                name: v.color_name,
                value: v.hex_code,
                inStock: v.stock > 0,
              })
            )
          ),
        ].map(JSON.parse);

        // Transform data to match component state structure
        const formattedProduct = {
          ...data,
          sizes: uniqueSizes,
          colors: uniqueColors,
        };

        setProduct(formattedProduct);
        if (uniqueSizes.length > 0) setSelectedSize(uniqueSizes[0]);
        if (uniqueColors.length > 0) setSelectedColor(uniqueColors[0].value);

        // Fetch reviews (mock for now as endpoint might not exist or be empty)
        setReviews([]);

        // Fetch related products (mock or separate endpoint)
        setRelatedProducts([]);
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <Container>
        <div className="text-center py-5">
          <div className="spinner"></div>
          <p className="mt-3">Loading product...</p>
        </div>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setToast({
      show: true,
      message: `${product.name} added to cart!`,
      type: "success",
    });
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    console.log("Toggle wishlist for product:", product.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        width={20}
        height={20}
        className={i < Math.floor(rating) ? "text-warning" : "text-muted"}
        fill="currentColor"
      />
    ));
  };

  const renderReviewStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        width={16}
        height={16}
        className={i < rating ? "text-warning" : "text-muted"}
        fill="currentColor"
      />
    ));
  };

  const handleRatingClick = (rating) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0 || !reviewForm.comment.trim()) {
      setToast({
        show: true,
        message: "Please provide both rating and review comment",
        type: "error",
      });
      return;
    }

    // Simulate API call - in real app, this would submit to backend
    const newReview = {
      id: Date.now(),
      userName: "Current User",
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toLocaleDateString(),
      verified: true,
      helpful: 0,
    };

    setReviews((prev) => [...prev, newReview]);
    setReviewForm({ rating: 0, comment: "" });
    setToast({
      show: true,
      message: "Thank you for your review!",
      type: "success",
    });
  };

  return (
    <div className="product-details-page py-4">
      <Container fluid>
        {/* Breadcrumb */}
        <div className="d-flex align-items-center mb-4">
          <Link to="/shop" className="btn btn-outline-secondary btn-sm me-3">
            <ArrowLeftIcon width={16} height={16} />
            <span className="ms-1">Back to Shop</span>
          </Link>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/shop">Shop</Link>
              </li>
              <li className="breadcrumb-item">
                <Link
                  to={`/shop?category=${(
                    product.category || ""
                  ).toLowerCase()}`}
                >
                  {product.category || "Category"}
                </Link>
              </li>
              <li className="breadcrumb-item active">{product.name}</li>
            </ol>
          </nav>
        </div>

        <Row className="g-5">
          {/* Product Images */}
          <Col lg={6}>
            <div className="product-images">
              {/* Main Image */}
              <div className="main-image-container mb-3 position-relative">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="img-fluid rounded-3"
                  style={{ width: "100%", height: "500px", objectFit: "cover" }}
                />
                <button
                  className="position-absolute top-3 end-3 bg-white border-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: "50px", height: "50px" }}
                >
                  <MagnifyingGlassPlusIcon width={24} height={24} />
                </button>
                <div className="position-absolute top-3 start-3">
                  {product.isNew && (
                    <Badge bg="success" className="me-1">
                      New
                    </Badge>
                  )}
                  {product.isSale && <Badge bg="danger">Sale</Badge>}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="thumbnail-images d-flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`border-0 bg-transparent p-0 rounded ${selectedImage === index ? "ring-2 ring-primary" : ""
                      }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="rounded"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </Col>

          {/* Product Information */}
          <Col lg={6}>
            <div className="product-info">
              <div className="mb-3">
                <Badge bg="light" text="dark" className="me-2">
                  {product.category}
                </Badge>
                <Badge bg="light" text="dark">
                  {product.brand}
                </Badge>
              </div>

              <h1 className="fw-bold mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="d-flex align-items-center mb-3">
                <div className="d-flex me-2">{renderStars(product.rating)}</div>
                <span className="text-muted">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <h3 className="text-primary fw-bold mb-1">${product.price}</h3>
                {product.originalPrice && (
                  <span className="text-muted text-decoration-line-through fs-5 me-2">
                    ${product.originalPrice}
                  </span>
                )}
                <Badge bg="success" className="ms-2">
                  Save $
                  {(
                    parseFloat(product.originalPrice || 0) -
                    parseFloat(product.price || 0)
                  ).toFixed(2)}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-muted mb-4">{product.shortDescription}</p>

              {/* Size Selection */}
              <div className="mb-4">
                <label className="form-label fw-semibold d-block mb-2">
                  Size <span className="text-danger">*</span>
                </label>
                <div className="size-grid">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? "active" : ""
                        }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <small className="text-muted mt-2 d-block">
                  Size guide:{" "}
                  <button className="btn btn-link p-0 text-decoration-none">
                    How to measure your foot
                  </button>
                </small>
              </div>

              {/* Color Selection */}
              <div className="mb-4">
                <label className="form-label fw-semibold d-block mb-2">
                  Color:{" "}
                  <span className="text-capitalize">{selectedColor}</span>
                </label>
                <div className="color-grid">
                  {product.colors.map((color, index) => (
                    <button
                      key={`${color.value}-${index}`}
                      className={`color-btn ${selectedColor === color.value ? "active" : ""
                        }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.value)}
                      disabled={!color.inStock}
                      title={`${color.name}${!color.inStock ? " (Out of Stock)" : ""
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label className="form-label fw-semibold d-block mb-2">
                  Quantity
                </label>
                <div
                  className="d-flex align-items-center"
                  style={{ width: "120px" }}
                >
                  <button
                    className="btn btn-outline-secondary border-end-0 rounded-end-0"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center border-start-0 border-end-0"
                    value={quantity}
                    min="1"
                    max="10"
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                  <button
                    className="btn btn-outline-secondary border-start-0 rounded-start-0"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {product.stock > 5 ? (
                  <div className="d-flex align-items-center text-success">
                    <CheckIcon width={20} height={20} className="me-2" />
                    <span>In Stock ({product.stock} available)</span>
                  </div>
                ) : product.stock > 0 ? (
                  <div className="d-flex align-items-center text-warning">
                    <ExclamationTriangleIcon
                      width={20}
                      height={20}
                      className="me-2"
                    />
                    <span>Only {product.stock} left in stock!</span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center text-danger">
                    <ExclamationTriangleIcon
                      width={20}
                      height={20}
                      className="me-2"
                    />
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-3 mb-4">
                <Button
                  size="lg"
                  className="btn-product"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingBagIcon width={20} height={20} />
                  <span className="ms-2">Add to Cart</span>
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={handleWishlistToggle}
                  className={isWishlisted ? "border-danger text-danger" : ""}
                >
                  <HeartIcon
                    width={20}
                    height={20}
                    className={isWishlisted ? "fill-current" : ""}
                  />
                  <span className="ms-2">
                    {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  </span>
                </Button>
              </div>

              {/* Additional Actions */}
              <div className="d-flex gap-3 mb-4">
                <Button variant="outline-secondary" onClick={handleShare}>
                  <ShareIcon width={18} height={18} />
                  <span className="ms-1">Share</span>
                </Button>
                <Button as={Link} to="/virtual-try-on" variant="outline-info">
                  Virtual Try-On
                </Button>
              </div>

              {/* Features */}
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <TruckIcon
                      width={24}
                      height={24}
                      className="text-primary me-2"
                    />
                    <small>Free shipping over $50</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <ShieldCheckIcon
                      width={24}
                      height={24}
                      className="text-primary me-2"
                    />
                    <small>30-day return policy</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Product Details Tabs */}
        <Row className="mt-5">
          <Col>
            <Tabs
              activeKey={activeTab}
              onSelect={setActiveTab}
              className="mb-4"
            >
              <Tab eventKey="description" title="Description">
                <Card>
                  <Card.Body>
                    <p className="lead">{product.description}</p>

                    <Row>
                      <Col md={6}>
                        <h5 className="fw-bold mb-3">Specifications</h5>
                        {Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="d-flex justify-content-between mb-2"
                            >
                              <span className="text-muted">{key}:</span>
                              <span className="fw-medium">{value}</span>
                            </div>
                          )
                        )}
                      </Col>
                      <Col md={6}>
                        <h5 className="fw-bold mb-3">Care Instructions</h5>
                        <ul className="list-unstyled">
                          {product.care.map((instruction, index) => (
                            <li key={index} className="mb-2">
                              <CheckIcon
                                width={16}
                                height={16}
                                className="text-success me-2"
                              />
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="reviews" title={`Reviews (${reviews.length})`}>
                <Row>
                  <Col lg={8}>
                    {reviews.map((review) => (
                      <Card key={review.id} className="mb-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="mb-1">{review.userName}</h6>
                              <div className="d-flex align-items-center">
                                <div className="d-flex me-2">
                                  {renderReviewStars(review.rating)}
                                </div>
                                <small className="text-muted">
                                  {review.date}
                                </small>
                                {review.verified && (
                                  <Badge bg="success" className="ms-2">
                                    Verified Purchase
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <p className="mb-2">{review.comment}</p>
                          <small className="text-muted">
                            Helpful? ({review.helpful} people found this
                            helpful)
                          </small>
                        </Card.Body>
                      </Card>
                    ))}

                    {/* Write Review */}
                    <Card>
                      <Card.Body>
                        <h5 className="fw-bold mb-3">Write a Review</h5>
                        <Form>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Your Rating</Form.Label>
                                <div className="d-flex gap-1">
                                  {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                      key={rating}
                                      type="button"
                                      className="bg-transparent border-0 p-0"
                                    >
                                      <StarIcon
                                        width={24}
                                        height={24}
                                        className="text-warning"
                                        fill="currentColor"
                                      />
                                    </button>
                                  ))}
                                </div>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Form.Group className="mb-3">
                            <Form.Label>Your Review</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              placeholder="Share your experience with this product..."
                            />
                          </Form.Group>
                          <Button variant="primary">Submit Review</Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={4}>
                    <Card>
                      <Card.Body>
                        <h5 className="fw-bold mb-3">Review Summary</h5>
                        <div className="text-center mb-3">
                          <h2 className="text-warning mb-1">
                            {product.rating}
                          </h2>
                          <div className="d-flex justify-content-center mb-2">
                            {renderStars(product.rating)}
                          </div>
                          <small className="text-muted">
                            Based on {product.reviews} reviews
                          </small>
                        </div>

                        {/* Rating Breakdown */}
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div
                            key={rating}
                            className="d-flex align-items-center mb-2"
                          >
                            <small className="me-2">{rating} star</small>
                            <div
                              className="flex-grow-1 bg-light rounded"
                              style={{ height: "8px" }}
                            >
                              <div
                                className="bg-warning rounded"
                                style={{
                                  height: "100%",
                                  width: `${rating === 5
                                      ? 70
                                      : rating === 4
                                        ? 20
                                        : rating === 3
                                          ? 7
                                          : rating === 2
                                            ? 2
                                            : 1
                                    }%`,
                                }}
                              />
                            </div>
                            <small className="ms-2 text-muted">
                              {rating === 5
                                ? 87
                                : rating === 4
                                  ? 25
                                  : rating === 3
                                    ? 9
                                    : rating === 2
                                      ? 2
                                      : 1}
                            </small>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="shipping" title="Shipping & Returns">
                <Card>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h5 className="fw-bold mb-3">Shipping Information</h5>
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <TruckIcon
                              width={20}
                              height={20}
                              className="text-primary me-2"
                            />
                            <strong>Standard Shipping:</strong> 5-7 business
                            days ($9.99)
                          </li>
                          <li className="mb-2">
                            <TruckIcon
                              width={20}
                              height={20}
                              className="text-primary me-2"
                            />
                            <strong>Express Shipping:</strong> 2-3 business days
                            ($19.99)
                          </li>
                          <li className="mb-2">
                            <TruckIcon
                              width={20}
                              height={20}
                              className="text-primary me-2"
                            />
                            <strong>Free Shipping:</strong> On orders over $50
                          </li>
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h5 className="fw-bold mb-3">Return Policy</h5>
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <CheckIcon
                              width={20}
                              height={20}
                              className="text-success me-2"
                            />
                            30-day return window
                          </li>
                          <li className="mb-2">
                            <CheckIcon
                              width={20}
                              height={20}
                              className="text-success me-2"
                            />
                            Items must be unworn with tags attached
                          </li>
                          <li className="mb-2">
                            <CheckIcon
                              width={20}
                              height={20}
                              className="text-success me-2"
                            />
                            Free return shipping on defective items
                          </li>
                        </ul>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>

        {/* Related Products */}
        <Row className="mt-5">
          <Col>
            <h3 className="fw-bold mb-4">You Might Also Like</h3>
            <Row className="g-4">
              {relatedProducts.map((relatedProduct) => (
                <Col key={relatedProduct.id} xs={12} sm={6} md={3}>
                  <Card className="product-card h-100 border-0">
                    <div className="position-relative">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="product-image card-img-top"
                      />
                      <div className="position-absolute top-3 start-3">
                        {relatedProduct.isNew && (
                          <Badge bg="success" className="me-1">
                            New
                          </Badge>
                        )}
                        {relatedProduct.isSale && (
                          <Badge bg="danger">Sale</Badge>
                        )}
                      </div>
                      <button className="product-wishlist">
                        <HeartIcon width={20} height={20} />
                      </button>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="product-name h6 mb-2">
                        {relatedProduct.name}
                      </Card.Title>
                      <div className="product-rating mb-2">
                        <div className="stars d-flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              width={16}
                              height={16}
                              className={
                                i < Math.floor(relatedProduct.rating)
                                  ? "text-warning"
                                  : "text-muted"
                              }
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <span className="product-price fw-bold">
                            ${relatedProduct.price}
                          </span>
                          {relatedProduct.originalPrice && (
                            <span className="text-muted text-decoration-line-through ms-2">
                              ${relatedProduct.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="d-grid gap-2 mt-auto">
                        <Button
                          as={Link}
                          to={`/product/${relatedProduct.id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
      {/* Sticky Bottom Bar for Mobile */}
      <div className="fixed-bottom bg-white border-top p-3 d-lg-none shadow-lg" style={{ zIndex: 1020 }}>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            className="flex-grow-1"
            onClick={handleWishlistToggle}
          >
            <HeartIcon width={20} height={20} className={isWishlisted ? "fill-current text-danger" : ""} />
          </Button>
          <Button
            className="btn-product flex-grow-1 w-50"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
