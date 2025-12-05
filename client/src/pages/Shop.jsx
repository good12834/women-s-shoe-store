import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Badge,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  ShoppingBagIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import ProductFilters from "../components/ProductFilters";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ToastNotification from "../components/ToastNotification";
import { fetchProducts } from "../services/mockData";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 500,
    size: "",
    color: "",
    heel: "",
    sort: "newest",
  });
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(filters);
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchQuery]);

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setSelectedSize(
      product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
    );
    setSelectedColor(
      product.colors && product.colors.length > 0 ? product.colors[0] : ""
    );
  };

  const handleAddToCart = (product) => {
    addToCart(
      product,
      1,
      selectedSize || product.sizes[0],
      selectedColor || product.colors[0]
    );
    setToast({
      show: true,
      message: `${product.name} added to cart!`,
      type: "success",
    });
    if (quickViewProduct) setQuickViewProduct(null);
  };

  const handleWishlistClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    const isWishlisted = isInWishlist(product.id);
    setToast({
      show: true,
      message: isWishlisted
        ? `${product.name} removed from wishlist!`
        : `${product.name} added to wishlist!`,
      type: "success",
    });
  };

  return (
    <div className="shop-page">
      {/* Professional Header Section */}
      <div className="bg-white text-dark py-5 mb-5 animate-fadeIn" style={{ backgroundColor: "#ffffff" }}>
        <Container>
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-3">Premium Women's Footwear</h1>
            <p className="lead mb-0 text-muted">
              Discover our curated collection of elegant, comfortable, and
              stylish shoes
            </p>
          </div>
        </Container>
      </div>
      <Container fluid className="px-4 px-lg-5">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 animate-slideIn">
          <div className="mb-3 mb-md-0">
            <h2 className="fw-bold mb-2">Shop Collection</h2>
            <p className="text-muted mb-0">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
              {searchQuery && <span> for "{searchQuery}"</span>}
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* View Mode Toggle */}
            <div className="btn-group shadow-sm rounded-pill overflow-hidden" role="group">
              <button
                className={`btn btn-sm px-3 ${viewMode === "grid" ? "btn-primary" : "bg-white text-dark"
                  }`}
                onClick={() => setViewMode("grid")}
              >
                <span className="d-none d-sm-inline">Grid</span>
                <span className="d-sm-none">G</span>
              </button>
              <button
                className={`btn btn-sm px-3 ${viewMode === "list" ? "btn-primary" : "bg-white text-dark"
                  }`}
                onClick={() => setViewMode("list")}
              >
                <span className="d-none d-sm-inline">List</span>
                <span className="d-sm-none">L</span>
              </button>
            </div>

            {/* Filter Toggle - Mobile */}
            <Button
              variant="outline-primary"
              className="d-lg-none rounded-pill"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon width={20} height={20} />
              <span className="ms-2 d-none d-sm-inline">Filters</span>
            </Button>
          </div>
        </div>

        <Row>
          {/* Filters Sidebar - Desktop */}
          <Col lg={3} className="d-none d-lg-block">
            <div className="filters-sidebar sticky-top" style={{ top: "100px", zIndex: 1 }}>
              <ProductFilters filters={filters} setFilters={setFilters} />
            </div>
          </Col>

          {/* Products */}
          <Col lg={9}>
            {/* Sort Bar */}
            <div className="d-flex justify-content-end align-items-center mb-4">
              <div className="d-flex align-items-center gap-2 bg-white p-2 rounded-pill shadow-sm border px-3">
                <AdjustmentsHorizontalIcon width={20} height={20} className="text-muted" />
                <span className="text-muted small text-nowrap">Sort by:</span>
                <Form.Select
                  className="border-0 bg-transparent py-0 ps-1 pe-4 text-dark fw-medium focus-ring-0"
                  style={{ width: "auto", minWidth: "140px", boxShadow: "none", cursor: "pointer" }}
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value })
                  }
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="name">Name: A to Z</option>
                </Form.Select>
              </div>
            </div>

            {/* Mobile Filters Modal */}
            <Modal
              show={showFilters}
              onHide={() => setShowFilters(false)}
              size="lg"
              centered
            >
              <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">Filters</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ProductFilters filters={filters} setFilters={setFilters} />
              </Modal.Body>
              <Modal.Footer className="border-0 pt-0">
                <Button variant="primary" className="w-100 rounded-pill" onClick={() => setShowFilters(false)}>
                  Show Results
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-premium mx-auto mb-3"></div>
                <p className="text-muted">Loading collection...</p>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "" : ""}>
                <Row className="g-4">
                  {filteredProducts.map((product, index) => (
                    <Col
                      key={product.id}
                      xs={12}
                      sm={6}
                      lg={viewMode === "grid" ? 3 : 12}
                      xl={viewMode === "grid" ? 3 : 12}
                      className="stagger-animation"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <Card
                        className={`card-premium h-100 border-0 ${viewMode === "list" ? "flex-row align-items-center p-3" : ""
                          }`}
                      >
                        <div className={`position-relative overflow-hidden ${viewMode === "list" ? "w-25 rounded-3" : ""}`}>
                          <Link to={`/product/${product.id}`}>
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="product-image card-img-top"
                              style={{
                                height: viewMode === "list" ? "150px" : "320px",
                              }}
                              onError={(e) => {
                                e.target.src = "https://placehold.co/300x200?text=No+Image";
                              }}
                            />
                          </Link>

                          {/* Badges */}
                          <div className="position-absolute top-0 start-0 p-3 w-100 d-flex justify-content-between align-items-start pointer-events-none">
                            <div className="d-flex flex-column gap-2">
                              {product.isNew && (
                                <span className="badge-premium badge-new shadow-sm">
                                  New
                                </span>
                              )}
                              {product.isSale && <span className="badge-premium badge-sale shadow-sm">Sale</span>}
                              {!product.inStock && (
                                <span className="badge bg-secondary shadow-sm rounded-pill px-3 py-2">Out of Stock</span>
                              )}
                            </div>

                            {/* Wishlist */}
                            <button
                              className="product-wishlist pointer-events-auto"
                              onClick={(e) => handleWishlistClick(e, product)}
                            >
                              {isInWishlist(product.id) ? (
                                <HeartSolidIcon width={20} height={20} className="text-danger" />
                              ) : (
                                <HeartIcon width={20} height={20} />
                              )}
                            </button>
                          </div>

                          {/* Quick View Overlay (Grid Mode) */}
                          {viewMode === "grid" && (
                            <div className="position-absolute top-50 start-50 translate-middle hover-reveal" style={{ zIndex: 10 }}>
                              <Button
                                className="btn-light rounded-pill shadow fw-medium d-flex align-items-center justify-content-center gap-2 px-4 py-2"
                                onClick={() => handleQuickView(product)}
                              >
                                <MagnifyingGlassIcon width={18} height={18} />
                                Quick View
                              </Button>
                            </div>
                          )}
                        </div>

                        <Card.Body
                          className={`d-flex flex-column ${viewMode === "list" ? "w-75 ps-4 py-0" : "pt-4 px-3 pb-4"
                            }`}
                        >
                          <div className="mb-1">
                            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
                              {product.category}
                            </small>
                          </div>

                          <Card.Title className="product-name h6 mb-2 fw-bold text-dark">
                            <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                              {product.name}
                            </Link>
                          </Card.Title>

                          <div className="d-flex justify-content-between align-items-end mt-auto">
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="fw-bold text-dark fs-5">
                                  ${product.price}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-muted text-decoration-line-through small">
                                    ${product.originalPrice}
                                  </span>
                                )}
                              </div>
                              <div className="d-flex align-items-center">
                                <StarIcon width={14} height={14} className="text-warning fill-current me-1" />
                                <small className="text-muted fw-medium" style={{ fontSize: "0.8rem" }}>
                                  {product.rating}
                                </small>
                              </div>
                            </div>

                            {viewMode === "list" ? (
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="rounded-pill px-3"
                                  onClick={() => handleQuickView(product)}
                                >
                                  Quick View
                                </Button>
                                <Button
                                  className="btn-product rounded-pill px-3"
                                  disabled={!product.inStock}
                                  as={Link}
                                  to={`/product/${product.id}`}
                                >
                                  View Details
                                </Button>
                              </div>
                            ) : (
                              <button
                                className="btn btn-link p-0 text-primary"
                                onClick={() => handleAddToCart(product)}
                                disabled={!product.inStock}
                              >
                                <ShoppingBagIcon width={24} height={24} />
                              </button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* No Products */}
            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-5 bg-light rounded-3 mt-4">
                <div className="mb-3 text-muted opacity-50">
                  <MagnifyingGlassIcon width={48} height={48} className="mx-auto" />
                </div>
                <h3 className="fw-bold text-dark">
                  {searchQuery ? "No products found" : "No products found"}
                </h3>
                <p className="text-muted mb-4">
                  {searchQuery
                    ? `No products match "${searchQuery}". Try a different search term.`
                    : "Try adjusting your filters to see more results."}
                </p>
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-4"
                  onClick={() =>
                    setFilters({
                      category: "",
                      minPrice: 0,
                      maxPrice: 500,
                      size: "",
                      color: "",
                      heel: "",
                      sort: "newest",
                    })
                  }
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* Quick View Modal */}
      <Modal
        show={!!quickViewProduct}
        onHide={() => setQuickViewProduct(null)}
        size="lg"
        centered
        className="quick-view-modal"
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        <Modal.Header closeButton className="border-0 absolute-top-right z-10">
        </Modal.Header>
        {quickViewProduct && (
          <Modal.Body className="p-0">
            <Row className="g-0">
              <Col md={6}>
                <div className="h-100 bg-light d-flex align-items-center justify-content-center p-4">
                  <img
                    src={quickViewProduct.image_url}
                    alt={quickViewProduct.name}
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: "400px", objectFit: "contain" }}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="p-4 p-lg-5 d-flex flex-column h-100">
                  <div className="mb-2">
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-2">
                      {quickViewProduct.category}
                    </span>
                  </div>
                  <h3 className="fw-bold mb-2">{quickViewProduct.name}</h3>

                  <div className="product-rating mb-4">
                    <div className="d-flex align-items-center">
                      <div className="d-flex text-warning me-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            width={18}
                            height={18}
                            className={
                              i < Math.floor(quickViewProduct.rating)
                                ? "fill-current"
                                : "text-muted opacity-25"
                            }
                            fill={i < Math.floor(quickViewProduct.rating) ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="text-muted small">
                        ({quickViewProduct.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <h2 className="text-primary fw-bold mb-4">
                    ${quickViewProduct.price}
                    {quickViewProduct.originalPrice && (
                      <span className="text-muted text-decoration-line-through ms-3 fs-5 fw-normal">
                        ${quickViewProduct.originalPrice}
                      </span>
                    )}
                  </h2>

                  <p className="text-muted mb-4">
                    {quickViewProduct.description || "Elegant and comfortable, these shoes are perfect for any occasion. Made with high-quality materials to ensure durability and style."}
                  </p>

                  {/* Size Selection */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="fw-semibold">Select Size</label>
                      <button className="btn btn-link p-0 text-muted text-decoration-none small">Size Guide</button>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {quickViewProduct.sizes &&
                        quickViewProduct.sizes.map((size) => (
                          <button
                            key={size}
                            className={`btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 ${selectedSize === size ? "active bg-dark text-white border-dark" : ""
                              }`}
                            style={{ width: "40px", height: "40px" }}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div className="mb-4">
                    <label className="fw-semibold mb-2">Select Color</label>
                    <div className="d-flex gap-2">
                      {quickViewProduct.colors &&
                        quickViewProduct.colors.map((color) => (
                          <button
                            key={color}
                            className={`rounded-circle border-0 position-relative ${selectedColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                              }`}
                            style={{
                              backgroundColor: color,
                              width: "32px",
                              height: "32px",
                              boxShadow: selectedColor === color ? "0 0 0 2px white, 0 0 0 4px var(--primary-color)" : "inset 0 0 0 1px rgba(0,0,0,0.1)"
                            }}
                            onClick={() => setSelectedColor(color)}
                            title={color}
                          />
                        ))}
                    </div>
                  </div>

                  <div className="mt-auto d-grid gap-3">
                    <Button
                      className="btn-premium py-3 rounded-pill"
                      disabled={!quickViewProduct.inStock}
                      onClick={() => handleAddToCart(quickViewProduct)}
                    >
                      <ShoppingBagIcon width={20} height={20} className="me-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline-dark"
                      className="py-2 rounded-pill border-2"
                      onClick={(e) => handleWishlistClick(e, quickViewProduct)}
                    >
                      {isInWishlist(quickViewProduct.id) ? (
                        <>
                          <HeartSolidIcon width={20} height={20} className="me-2 text-danger" />
                          Remove from Wishlist
                        </>
                      ) : (
                        <>
                          <HeartIcon width={20} height={20} className="me-2" />
                          Add to Wishlist
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Modal.Body>
        )}
      </Modal>

      {/* Toast Notification */}
      <ToastNotification
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
};

export default Shop;
