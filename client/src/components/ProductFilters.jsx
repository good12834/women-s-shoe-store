import React from "react";
import { Form, Button, Accordion } from "react-bootstrap";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ProductFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFilters((prev) => ({ ...prev, [name]: checked ? value : "" }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSizeChange = (size) => {
    setFilters((prev) => ({ ...prev, size: prev.size === size ? "" : size }));
  };

  const handleColorChange = (color) => {
    setFilters((prev) => ({
      ...prev,
      color: prev.color === color ? "" : color,
    }));
  };

  const handleBrandChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFilters((prev) => {
        const brands = prev.brands
          ? prev.brands.split(",").filter(Boolean)
          : [];
        const newBrands = checked
          ? [...brands, value]
          : brands.filter((b) => b !== value);
        return { ...prev, [name]: newBrands.join(",") };
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: 0,
      maxPrice: 500,
      size: "",
      color: "",
      brand: "",
      brands: "",
      sort: "newest",
    });
  };

  const sizes = ["35", "36", "37", "38", "39", "40", "41", "42"];
  const colors = [
    { name: "Black", value: "black" },
    { name: "White", value: "white" },
    { name: "Red", value: "red" },
    { name: "Blue", value: "blue" },
    { name: "Pink", value: "pink" },
    { name: "Brown", value: "brown" },
    { name: "Gray", value: "gray" },
    { name: "Gold", value: "gold" },
  ];
  const brands = [
    "Nike",
    "Adidas",
    "Jimmy Choo",
    "Christian Louboutin",
    "Manolo Blahnik",
  ];
  const categories = [
    "Heels",
    "Sneakers",
    "Sandals",
    "Boots",
    "Flats",
    "Wedges",
  ];
  const heelHeights = [
    'Flat (0-1")',
    'Low (1-2")',
    'Medium (2-3")',
    'High (3-4")',
    'Very High (4"+ )',
  ];

  return (
    <div className="filters-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">Filters</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-danger p-1 icon-hover"
        >
          <XMarkIcon width={18} height={18} />
          Clear All
        </Button>
      </div>

      <Accordion defaultActiveKey={["0", "1", "2", "3", "4", "5"]} flush>
        {/* Category Filter */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span className="fw-semibold">Category</span>
          </Accordion.Header>
          <Accordion.Body>
            <div className="filter-options">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip ${
                    filters.category === cat ? "active" : ""
                  } icon-hover`}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      category: prev.category === cat ? "" : cat,
                    }))
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Size Filter */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <span className="fw-semibold">Size</span>
          </Accordion.Header>
          <Accordion.Body>
            <div className="size-grid">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${
                    filters.size === size ? "active" : ""
                  } icon-hover`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Color Filter */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <span className="fw-semibold">Color</span>
          </Accordion.Header>
          <Accordion.Body>
            <div className="color-grid">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className="color-btn icon-hover"
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorChange(color.value)}
                  title={color.name}
                >
                  <span
                    className={`sr-only ${
                      filters.color === color.value ? "d-block" : "d-none"
                    }`}
                  >
                    ✓
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-2">
              <small className="text-muted">
                Selected: {filters.color || "None"}
              </small>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Price Range */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <span className="fw-semibold">Price Range</span>
          </Accordion.Header>
          <Accordion.Body>
            <div className="mb-3">
              <Form.Range
                name="minPrice"
                min={0}
                max={500}
                value={filters.minPrice || 0}
                onChange={handleChange}
                className="price-slider"
              />
              <div className="price-range">
                <span>${filters.minPrice || 0}</span>
                <span>${filters.maxPrice || 500}</span>
              </div>
            </div>
            <div className="mb-3">
              <Form.Range
                name="maxPrice"
                min={0}
                max={500}
                value={filters.maxPrice || 500}
                onChange={handleChange}
                className="price-slider"
              />
            </div>
            <div className="d-flex gap-2">
              <Form.Control
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: parseInt(e.target.value) || 0,
                  }))
                }
                className="text-center"
                min="0"
                max="500"
              />
              <span className="align-self-center">-</span>
              <Form.Control
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: parseInt(e.target.value) || 500,
                  }))
                }
                className="text-center"
                min="0"
                max="500"
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Heel Height */}
        <Accordion.Item eventKey="4">
          <Accordion.Header>
            <span className="fw-semibold">Heel Height</span>
          </Accordion.Header>
          <Accordion.Body>
            {heelHeights.map((height) => (
              <Form.Check
                key={height}
                type="radio"
                name="heelHeight"
                label={height}
                value={height.toLowerCase().replace(/[^a-z]/g, "")}
                checked={
                  filters.heelHeight ===
                  height.toLowerCase().replace(/[^a-z]/g, "")
                }
                onChange={handleChange}
                className="mb-2"
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Brand */}
        <Accordion.Item eventKey="5">
          <Accordion.Header>
            <span className="fw-semibold">Brand</span>
          </Accordion.Header>
          <Accordion.Body>
            {brands.map((brand) => (
              <Form.Check
                key={brand}
                type="checkbox"
                name="brands"
                label={brand}
                value={brand}
                checked={
                  filters.brands
                    ? filters.brands.split(",").includes(brand)
                    : false
                }
                onChange={handleBrandChange}
                className="mb-2"
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Rating */}
        <Accordion.Item eventKey="6">
          <Accordion.Header>
            <span className="fw-semibold">Customer Rating</span>
          </Accordion.Header>
          <Accordion.Body>
            {[4, 3, 2, 1].map((rating) => (
              <Form.Check
                key={rating}
                type="radio"
                name="minRating"
                label={
                  <div className="d-flex align-items-center">
                    <span className="me-2">
                      {Array(rating).fill("★").join("")}
                    </span>
                    <small className="text-muted">& up</small>
                  </div>
                }
                value={rating}
                checked={filters.minRating === rating.toString()}
                onChange={handleChange}
                className="mb-2"
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Availability */}
        <Accordion.Item eventKey="7">
          <Accordion.Header>
            <span className="fw-semibold">Availability</span>
          </Accordion.Header>
          <Accordion.Body>
            <Form.Check
              type="checkbox"
              name="inStock"
              label="In Stock Only"
              checked={filters.inStock || false}
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="onSale"
              label="On Sale"
              checked={filters.onSale || false}
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              name="newArrivals"
              label="New Arrivals"
              checked={filters.newArrivals || false}
              onChange={handleChange}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="mt-4 pt-4 border-top">
        <Button
          variant="outline-secondary"
          className="w-100 btn-premium"
          onClick={clearFilters}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;
