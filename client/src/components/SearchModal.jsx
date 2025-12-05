import { useState, useEffect, useRef } from "react";
import { Modal, Form, InputGroup, Button, Badge, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SearchModal = ({ show, onHide, products = [] }) => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [show]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setFilteredProducts([]);
      return;
    }

    setIsLoading(true);
    const searchTimeout = setTimeout(() => {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category?.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      );
      setFilteredProducts(filtered.slice(0, 8)); // Limit to 8 results
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, products]);

  const handleClose = () => {
    setQuery("");
    setFilteredProducts([]);
    onHide();
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "$0.00";
    return `${numPrice.toFixed(2)}`;
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      className="search-modal"
    >
      <Modal.Body className="p-0">
        {/* Search Header */}
        <div className="p-4 border-bottom">
          <InputGroup>
            <InputGroup.Text className="bg-transparent border-0">
              <MagnifyingGlassIcon width={20} height={20} />
            </InputGroup.Text>
            <Form.Control
              ref={inputRef}
              type="text"
              placeholder="Search for shoes, brands, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent fs-5"
              style={{ boxShadow: "none" }}
            />
            <Button variant="ghost" onClick={handleClose} className="border-0">
              <XMarkIcon width={20} height={20} />
            </Button>
          </InputGroup>
        </div>

        {/* Search Results */}
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : query.trim().length === 0 ? (
            <div className="p-5 text-center">
              <MagnifyingGlassIcon
                width={48}
                height={48}
                className="text-muted mb-3"
              />
              <h5 className="text-muted">Start typing to search</h5>
              <p className="text-muted">Find your perfect pair of shoes</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-5 text-center">
              <h5 className="text-muted mb-2">No results found</h5>
              <p className="text-muted">
                Try searching for something else or check your spelling
              </p>
            </div>
          ) : (
            <div className="p-2">
              <div className="d-flex justify-content-between align-items-center px-3 py-2">
                <small className="text-muted">
                  {filteredProducts.length} result
                  {filteredProducts.length !== 1 ? "s" : ""} found
                </small>
                {query && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-decoration-none"
                    as={Link}
                    to={`/shop?search=${encodeURIComponent(query)}`}
                    onClick={handleClose}
                  >
                    View all results →
                  </Button>
                )}
              </div>

              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="text-decoration-none"
                  onClick={handleClose}
                >
                  <div className="d-flex align-items-center p-3 hover:bg-light rounded-2 mb-1">
                    <Image
                      src={product.image_url || product.image}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded me-3"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1 text-dark">{product.name}</h6>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg="secondary" className="small">
                          {product.category}
                        </Badge>
                        {product.isNew && (
                          <Badge bg="success" className="small">
                            New
                          </Badge>
                        )}
                        {product.isSale && (
                          <Badge bg="danger" className="small">
                            Sale
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-primary">
                        {formatPrice(product.price)}
                      </div>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <small className="text-muted text-decoration-line-through">
                            {formatPrice(product.originalPrice)}
                          </small>
                        )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Search Footer */}
        {query.trim().length > 0 && filteredProducts.length > 0 && (
          <div className="border-top p-3">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Press <kbd>Enter</kbd> to view all results
              </small>
              <Button
                variant="primary"
                size="sm"
                as={Link}
                to={`/shop?search=${encodeURIComponent(query)}`}
                onClick={handleClose}
              >
                View All Results (
                {filteredProducts.length +
                  (products.length - filteredProducts.length)}
                )
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SearchModal;
