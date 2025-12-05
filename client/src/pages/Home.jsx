import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  HeartIcon,
  ShoppingBagIcon,
  StarIcon,
  ArrowRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  GiftIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 30,
  });
  const [animatedElements, setAnimatedElements] = useState({});
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const heroImages = [
    "https://images.unsplash.com/photo-1554062614-6da4fa67725a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29tZW4lMjBzaG9lc3xlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1630407332126-70ebb700976b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdvbWVuJTIwc2hvZXN8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1603213060868-fc57c78f4c84?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fHdvbWVuJTIwc2hvZXN8ZW58MHx8MHx8fDA%3D"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageVisible, setIsImageVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsImageVisible(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setIsImageVisible(true);
      }, 500); // Wait for fade out (0.5s)
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Mock data for demonstration
  const featuredProducts = [
    {
      id: 1,
      name: "Elegant Red Heels",
      price: 89.99,
      originalPrice: 129.99,
      image_url:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      reviews: 124,
      badge: "New",
      category: "Heels",
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["#E91E63", "#000000", "#8B4513"],
    },
    {
      id: 2,
      name: "Comfy White Sneakers",
      price: 65.0,
      image_url:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      reviews: 89,
      badge: "Sale",
      category: "Sneakers",
      sizes: ["36", "37", "38", "39", "40", "41"],
      colors: ["#FFFFFF", "#F5F5F5", "#FFD700"],
    },
    {
      id: 3,
      name: "Summer Sandals",
      price: 39.99,
      originalPrice: 59.99,
      image_url:
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      reviews: 56,
      badge: "Hot",
      category: "Sandals",
      sizes: ["36", "37", "38", "39"],
      colors: ["#D2691E", "#000000", "#FAEBD7"],
    },
    {
      id: 4,
      name: "Classic Black Boots",
      price: 120.0,
      image_url:
        "https://media.istockphoto.com/id/1348707285/photo/stylish-woman-tying-shoelace-of-black-ankle-boot.webp?a=1&b=1&s=612x612&w=0&k=20&c=92DexAJ8XA_2wMiDqZM5XfyC9WPlk3L4oI9mHF4yffo=",
      rating: 4.9,
      reviews: 203,
      badge: "Premium",
      category: "Boots",
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["#000000", "#8B4513", "#2F4F4F"],
    },
  ];

  const categories = [
    {
      name: "Heels",
      count: 150,
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Elegant & Sophisticated",
    },
    {
      name: "Sneakers",
      count: 89,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Comfort Meets Style",
    },
    {
      name: "Sandals",
      count: 67,
      image:
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Summer Essentials",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Blogger",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      text: "Absolutely love the quality and style! These shoes are perfect for any occasion.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Verified Buyer",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      text: "Best online shoe shopping experience. Fast delivery and excellent customer service!",
      rating: 5,
    },
    {
      name: "Jessica Williams",
      role: "Style Enthusiast",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      text: "My go-to store for trendy footwear. The virtual try-on feature is amazing!",
      rating: 5,
    },
  ];

  // Flash sale countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animation observer for fade-in effects
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedElements((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleWishlistClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.sizes[0], product.colors[0]);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "New":
        return "success";
      case "Sale":
        return "danger";
      case "Hot":
        return "warning";
      case "Premium":
        return "info";
      default:
        return "primary";
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden">
        <div
          style={{
            background: "#ffffff",
            minHeight: "85vh",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Animated Background Shapes */}
          <div
            className="position-absolute"
            style={{
              top: "10%",
              left: "5%",
              width: "300px",
              height: "300px",
              background: "rgba(233, 30, 99, 0.05)",
              borderRadius: "50%",
              animation: "float 6s ease-in-out infinite",
            }}
          />
          <div
            className="position-absolute"
            style={{
              bottom: "15%",
              right: "10%",
              width: "200px",
              height: "200px",
              background: "rgba(233, 30, 99, 0.04)",
              borderRadius: "50%",
              animation: "float 8s ease-in-out infinite reverse",
            }}
          />
          <div
            className="position-absolute"
            style={{
              top: "50%",
              right: "20%",
              width: "150px",
              height: "150px",
              background: "rgba(233, 30, 99, 0.03)",
              borderRadius: "50%",
              animation: "float 5s ease-in-out infinite",
            }}
          />

          <Container className="position-relative">
            <Row className="align-items-center">
              <Col lg={6} className="text-dark">
                <div className="hero-content animate-fadeIn">
                  <Badge bg="dark" text="white" className="mb-3 px-3 py-2 fs-6 fw-bold">
                    <SparklesIcon width={16} height={16} className="me-2" />
                    New Collection 2025
                  </Badge>
                  <h1
                    className="display-3 fw-bold mb-4"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                      lineHeight: "1.1",
                    }}
                  >
                    Walk in
                    <span
                      className="d-block"
                      style={{
                        background: "linear-gradient(to right, #FFD700, #FFF)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Style & Comfort
                    </span>
                  </h1>
                  <p className="lead mb-4 fs-5 fw-bold" style={{ opacity: 0.95 }}>
                    Discover our curated collection of premium women's footwear.
                    Where elegance meets everyday comfort.
                  </p>
                  <div className="d-flex flex-wrap gap-3">
                    <Button
                      as={Link}
                      to="/shop"
                      size="lg"
                      className="btn-hero-primary fw-bold"
                    >
                      <ShoppingBagIcon
                        width={20}
                        height={20}
                        className="me-2"
                      />
                      Shop Now
                    </Button>
                    <Button
                      as={Link}
                      to="/virtual-try-on"
                      variant="outline-dark"
                      size="lg"
                      className="btn-hero-secondary fw-bold"
                    >
                      <SparklesIcon width={20} height={20} className="me-2" />
                      Virtual Try-On
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="d-flex flex-wrap gap-4 mt-5 pt-4">
                    <div className="d-flex align-items-center">
                      <TruckIcon width={24} height={24} className="me-2" />
                      <small>Free Shipping</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <ShieldCheckIcon
                        width={24}
                        height={24}
                        className="me-2"
                      />
                      <small>Secure Payment</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <GiftIcon width={24} height={24} className="me-2" />
                      <small>Easy Returns</small>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6} className="mt-5 mt-lg-0">
                <div className="hero-image text-center">
                  <img
                    src={heroImages[currentImageIndex]}
                    alt="Featured Shoe"
                    className={`img-fluid rounded-4 shadow-lg hero-image-transition ${isImageVisible ? 'visible' : ''}`}
                    style={{
                      maxHeight: "500px",
                      objectFit: "cover",
                      animation: "float 4s ease-in-out infinite",
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="flash-sale-luxe">
        <Container>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex align-items-center text-white">
              <div className="flash-sale-badge me-4">
                <ClockIcon width={24} height={24} className="me-2" />
                <span>Flash Sale</span>
              </div>
              <div className="d-flex gap-3">
                <div className="countdown-box-luxe text-center">
                  <div className="countdown-number">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </div>
                  <div className="countdown-label">HRS</div>
                </div>
                <div className="fs-2 fw-bold text-white d-flex align-items-center opacity-50">
                  :
                </div>
                <div className="countdown-box-luxe text-center">
                  <div className="countdown-number">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </div>
                  <div className="countdown-label">MIN</div>
                </div>
                <div className="fs-2 fw-bold text-white d-flex align-items-center opacity-50">
                  :
                </div>
                <div className="countdown-box-luxe text-center">
                  <div className="countdown-number">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="countdown-label">SEC</div>
                </div>
              </div>
            </div>
            <Button
              as={Link}
              to="/shop?flash-sale=true"
              variant="outline-light"
              className="px-4 py-2 rounded-pill border-2 fw-semibold"
            >
              View All Deals
              <ArrowRightIcon width={16} height={16} className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-5 animate-on-scroll">
        <Container>
          <div className="text-center mb-5">
            <Badge bg="primary" className="mb-3 px-3 py-2">
              Categories
            </Badge>
            <h2 className="display-5 fw-bold mb-3">Shop by Category</h2>
            <p className="text-muted fs-5">
              Find your perfect style from our diverse collection
            </p>
          </div>

          <Row className="g-4 stagger-animation">
            {categories.map((category, index) => (
              <Col key={category.name} lg={4} md={6}>
                <Link
                  to={`/shop?category=${category.name.toLowerCase()}`}
                  className="text-decoration-none"
                >
                  <div
                    className="category-card position-relative rounded-4 overflow-hidden product-card-enhanced"
                    style={{
                      height: "350px",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-100 h-100 float-animation"
                      style={{
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                    />
                    <div
                      className="position-absolute inset-0 d-flex flex-column justify-content-end p-4"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)",
                      }}
                    >
                      <span className="text-white-50 small mb-1">
                        {category.description}
                      </span>
                      <h3 className="text-white fw-bold mb-1">
                        {category.name}
                      </h3>
                      <p className="text-white-50 mb-3">
                        {category.count} Items
                      </p>
                      <Button
                        variant="light"
                        size="sm"
                        className="w-auto align-self-start btn-premium"
                      >
                        Explore
                        <ArrowRightIcon
                          width={14}
                          height={14}
                          className="ms-1 icon-hover"
                        />
                      </Button>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section
        id="featured"
        className="py-5 animate-on-scroll"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <Container>
          <div className="text-center mb-5">
            <Badge bg="danger" className="mb-3 px-3 py-2">
              Trending
            </Badge>
            <h2 className="display-5 fw-bold mb-3">Featured Products</h2>
            <p className="text-muted fs-5">Handpicked favorites just for you</p>
          </div>

          <Row className="g-4 stagger-animation">
            {featuredProducts.map((product, index) => (
              <Col key={product.id} lg={3} md={6}>
                <Card
                  className="product-card h-100 border-0 shadow-sm product-card-enhanced"
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <div className="position-relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="card-img-top"
                      style={{
                        height: "280px",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                    />

                    {/* Badge */}
                    {product.badge && (
                      <Badge
                        bg={getBadgeColor(product.badge)}
                        className="position-absolute top-0 start-0 m-3 px-3 py-2"
                      >
                        {product.badge}
                      </Badge>
                    )}

                    {/* Wishlist Button */}
                    <button
                      className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle p-2 shadow-sm icon-hover"
                      onClick={(e) => handleWishlistClick(e, product)}
                      style={{
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isInWishlist(product.id) ? (
                        <HeartSolidIcon
                          width={20}
                          height={20}
                          className="text-danger"
                        />
                      ) : (
                        <HeartIcon width={20} height={20} />
                      )}
                    </button>

                    {/* Quick Add Overlay */}
                    <div
                      className="position-absolute bottom-0 start-0 end-0 p-3"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                    >
                      <Button
                        variant="light"
                        size="sm"
                        className="w-100"
                        onClick={(e) => handleQuickAddToCart(e, product)}
                      >
                        Quick Add
                      </Button>
                    </div>
                  </div>

                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-light text-muted">
                        {product.category}
                      </span>
                      <div className="d-flex align-items-center">
                        <StarIcon
                          width={14}
                          height={14}
                          className="text-warning"
                          fill="currentColor"
                        />
                        <span className="ms-1 small">{product.rating}</span>
                      </div>
                    </div>

                    <Card.Title
                      className="h6 fw-semibold mb-2"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.name}
                    </Card.Title>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="fs-5 fw-bold text-primary">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-muted text-decoration-line-through ms-2 small">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Color Options Preview */}
                    <div className="d-flex gap-1 mb-3">
                      {product.colors.slice(0, 4).map((color, i) => (
                        <div
                          key={i}
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: color,
                            border: "2px solid #fff",
                            boxShadow: "0 0 0 1px #ddd",
                          }}
                        />
                      ))}
                    </div>

                    <Button
                      as={Link}
                      to={`/product/${product.id}`}
                      variant="primary"
                      className="w-100 btn-premium"
                    >
                      <ShoppingBagIcon
                        width={16}
                        height={16}
                        className="me-2 icon-hover"
                      />
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-5">
            <Button
              as={Link}
              to="/shop"
              variant="outline-primary"
              size="lg"
              className="btn-pill-outline"
            >
              View All Products
              <ArrowRightIcon width={20} height={20} className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Promo Banners */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <div
                className="position-relative rounded-4 overflow-hidden h-100"
                style={{
                  minHeight: "300px",
                  background: "linear-gradient(135deg, #E91E63, #FF80AB)",
                }}
              >
                <div className="position-absolute inset-0 p-5 d-flex flex-column justify-content-center">
                  <Badge
                    bg="light"
                    text="dark"
                    className="mb-3 align-self-start"
                  >
                    Limited Time
                  </Badge>
                  <h3 className="text-white fw-bold mb-3 display-6">
                    Buy 1 Get 1 20% OFF
                  </h3>
                  <p className="text-white mb-4" style={{ opacity: 0.9 }}>
                    Mix and match your favorite pairs and save more on your
                    order!
                  </p>
                  <Button
                    as={Link}
                    to="/shop?promo=bogo"
                    variant="light"
                    size="lg"
                    className="align-self-start btn-banner-light"
                  >
                    Shop Now
                    <ArrowRightIcon width={16} height={16} className="ms-2" />
                  </Button>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1554062614-6da4fa67725a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29tZW4lMjBzaG9lc3xlbnwwfHwwfHx8MA%3D%3D"
                  alt="Promo"
                  className="position-absolute end-0 bottom-0"
                  style={{
                    height: "250px",
                    opacity: 0.3,
                  }}
                />
              </div>
            </Col>
            <Col lg={6}>
              <div
                className="position-relative rounded-4 overflow-hidden h-100"
                style={{
                  minHeight: "300px",
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                }}
              >
                <div className="position-absolute inset-0 p-5 d-flex flex-column justify-content-center">
                  <Badge bg="dark" className="mb-3 align-self-start">
                    Free Shipping
                  </Badge>
                  <h3 className="fw-bold mb-3 display-6">Orders Over $50</h3>
                  <p className="mb-4" style={{ opacity: 0.8 }}>
                    Fast and reliable shipping on all orders over $50. Shop with
                    confidence!
                  </p>
                  <Button
                    as={Link}
                    to="/shop"
                    variant="dark"
                    size="lg"
                    className="align-self-start btn-banner-dark"
                  >
                    Start Shopping
                    <ArrowRightIcon width={16} height={16} className="ms-2" />
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-5" style={{ backgroundColor: "#1a1a1a" }}>
        <Container>
          <div className="text-center mb-5">
            <Badge bg="primary" className="mb-3 px-3 py-2">
              Testimonials
            </Badge>
            <h2 className="display-5 fw-bold text-white mb-3">
              What Our Customers Say
            </h2>
            <p className="text-white-50 fs-5">
              Join thousands of happy customers
            </p>
          </div>

          <Row className="g-4">
            {testimonials.map((testimonial, index) => (
              <Col key={index} lg={4} md={6}>
                <Card
                  className="h-100 border-0"
                  style={{
                    backgroundColor: "#2d2d2d",
                    borderRadius: "16px",
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          width={16}
                          height={16}
                          className="text-warning"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <p className="text-white-50 mb-4">{testimonial.text}</p>
                    <div className="d-flex align-items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="rounded-circle me-3"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h6 className="text-white mb-0">{testimonial.name}</h6>
                        <small className="text-white-50">
                          {testimonial.role}
                        </small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="text-center p-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #E91E63, #FF80AB)",
                  }}
                >
                  <TruckIcon width={36} height={36} className="text-white" />
                </div>
                <h5 className="fw-bold mb-2">Free Shipping</h5>
                <p className="text-muted mb-0">On orders over $50</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="text-center p-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #E91E63, #FF80AB)",
                  }}
                >
                  <ShieldCheckIcon
                    width={36}
                    height={36}
                    className="text-white"
                  />
                </div>
                <h5 className="fw-bold mb-2">Secure Payment</h5>
                <p className="text-muted mb-0">100% secure checkout</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="text-center p-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #E91E63, #FF80AB)",
                  }}
                >
                  <CurrencyDollarIcon
                    width={36}
                    height={36}
                    className="text-white"
                  />
                </div>
                <h5 className="fw-bold mb-2">Money Back</h5>
                <p className="text-muted mb-0">30-day return guarantee</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="text-center p-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #E91E63, #FF80AB)",
                  }}
                >
                  <GiftIcon width={36} height={36} className="text-white" />
                </div>
                <h5 className="fw-bold mb-2">Gift Cards</h5>
                <p className="text-muted mb-0">The perfect gift</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter */}
      <section
        className="py-5"
        style={{ background: "linear-gradient(135deg, #FCE4EC, #FFF)" }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} className="text-center">
              <Badge bg="primary" className="mb-3 px-3 py-2">
                Newsletter
              </Badge>
              <h2 className="display-6 fw-bold mb-3">Stay in the Loop</h2>
              <p className="text-muted mb-4">
                Subscribe to get exclusive offers, new arrivals, and style tips
                delivered to your inbox.
              </p>
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Enter your email"
                  style={{
                    maxWidth: "300px",
                    borderRadius: "50px",
                    border: "2px solid #E91E63",
                  }}
                />
                <Button
                  variant="primary"
                  size="lg"
                  style={{
                    borderRadius: "50px",
                    background: "linear-gradient(135deg, #E91E63, #C2185B)",
                  }}
                >
                  Subscribe
                </Button>
              </div>
              <small className="text-muted mt-3 d-block">
                By subscribing, you agree to our Privacy Policy
              </small>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CSS Animations */}
      <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .category-card:hover img {
                    transform: scale(1.1);
                }
                
                .product-card:hover .card-img-top {
                    transform: scale(1.05);
                }
            `}</style>
    </div>
  );
};

export default Home;
