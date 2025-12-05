import {
  Navbar,
  Nav,
  Container,
  Badge,
  Button,
  Dropdown,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ThemeSelector from "./ThemeSelector";
import SearchModal from "./SearchModal";
import CartDropdown from "./CartDropdown";
import { mockProducts } from "../services/mockData";
import apiRequest from "../services/api";
import {
  HeartIcon,
  MagnifyingGlassIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const AnnouncementBar = () => (
  <div className="announcement-bar-luxe text-center py-2 fw-bold">
    <Container className="d-flex justify-content-between align-items-center">
      <span className="d-none d-md-inline">
        Free Shipping on Orders Over $150
      </span>
      <span className="mx-auto">
        New Collection Released!{" "}
        <Link to="/shop" className="text-white text-decoration-underline ms-1">
          Shop Now
        </Link>
      </span>
      <span className="d-none d-md-inline">Easy Returns & Exchange</span>
    </Container>
  </div>
);

const MegaMenu = ({ show, onMouseEnter, onMouseLeave }) => (
  <div
    className={`mega-menu mega-menu-luxe ${show ? "show" : ""}`}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <Container>
      <div className="row py-4">
        <div className="col-md-3">
          <h6 className="text-uppercase fw-bold mb-3 text-primary">
            New Arrivals
          </h6>
          <ul className="list-unstyled">
            <li>
              <Link to="/shop?sort=newest" className="mega-link">
                Just In
              </Link>
            </li>
            <li>
              <Link to="/shop?category=featured" className="mega-link">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link to="/shop?collection=summer" className="mega-link">
                Summer Collection
              </Link>
            </li>
            <li>
              <Link to="/shop?collection=winter" className="mega-link">
                Winter Essentials
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-3">
          <h6 className="text-uppercase fw-bold mb-3 text-primary">Shoes</h6>
          <ul className="list-unstyled">
            <li>
              <Link to="/shop?category=heels" className="mega-link">
                Heels
              </Link>
            </li>
            <li>
              <Link to="/shop?category=sneakers" className="mega-link">
                Sneakers
              </Link>
            </li>
            <li>
              <Link to="/shop?category=boots" className="mega-link">
                Boots
              </Link>
            </li>
            <li>
              <Link to="/shop?category=sandals" className="mega-link">
                Sandals
              </Link>
            </li>
            <li>
              <Link to="/shop?category=flats" className="mega-link">
                Flats
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-3">
          <h6 className="text-uppercase fw-bold mb-3 text-primary">
            Collections
          </h6>
          <ul className="list-unstyled">
            <li>
              <Link to="/shop?collection=work" className="mega-link">
                Work Edit
              </Link>
            </li>
            <li>
              <Link to="/shop?collection=wedding" className="mega-link">
                Wedding Guest
              </Link>
            </li>
            <li>
              <Link to="/shop?collection=party" className="mega-link">
                Party Wear
              </Link>
            </li>
            <li>
              <Link to="/shop?collection=vacation" className="mega-link">
                Vacation Shop
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-3">
          <div className="mega-menu-promo rounded-3 overflow-hidden position-relative h-100">
            <img
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="New Collection"
              className="w-100 h-100 object-fit-cover"
            />
            <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-to-t from-black-50">
              <h6 className="text-white mb-1">New Season</h6>
              <Link
                to="/shop"
                className="text-white small fw-bold text-decoration-none"
              >
                Shop Now <ArrowRightIcon width={14} className="ms-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
);

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch products for search functionality
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest("/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setProducts(mockProducts);
        }
      } catch (error) {
        console.log("API not available, using mock data for search");
        setProducts(mockProducts);
      }
    };
    fetchProducts();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "light" : "dark"
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar
        className={`navbar-luxe ${scrolled ? "scrolled" : ""}`}
        expand="lg"
        fixed="top"
        style={{ top: scrolled ? 0 : "36px", transition: "top 0.3s ease" }}
      >
        <Container fluid>
          {/* Logo */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center me-5"
          >
            <img
              src="/logo.svg"
              alt="ShoesFeminine"
              style={{ height: "40px", width: "auto" }}
              className="me-2"
            />
            <span
              className={`brand-luxe fs-3 ${scrolled ? "text-gradient" : ""}`}
            >
              LuxeStep
            </span>
          </Navbar.Brand>

          {/* Mobile Toggle */}
          <div className="d-lg-none d-flex align-items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setShowSearch(true)}
            >
              <MagnifyingGlassIcon width={20} height={20} />
            </Button>

            <CartDropdown />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
            >
              {isMenuOpen ? (
                <XMarkIcon width={24} height={24} />
              ) : (
                <Bars3Icon width={24} height={24} />
              )}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-block">
            <Nav className="mx-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={`nav-link-luxe ${location.pathname === "/" ? "active" : ""
                  }`}
              >
                Home
              </Nav.Link>

              <div
                className="nav-item-custom"
                onMouseEnter={() => setShowMegaMenu(true)}
                onMouseLeave={() => setShowMegaMenu(false)}
              >
                <Nav.Link
                  as={Link}
                  to="/shop"
                  className={`nav-link-luxe ${location.pathname.includes("/shop") ? "active" : ""
                    }`}
                >
                  Shop <ChevronDownIcon width={12} className="ms-1" />
                </Nav.Link>
                <MegaMenu
                  show={showMegaMenu}
                  onMouseEnter={() => setShowMegaMenu(true)}
                  onMouseLeave={() => setShowMegaMenu(false)}
                />
              </div>

              <Nav.Link
                as={Link}
                to="/virtual-try-on"
                className={`nav-link-luxe ${location.pathname === "/virtual-try-on" ? "active" : ""
                  }`}
              >
                Virtual Try-On
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/customizer"
                className={`nav-link-luxe ${location.pathname === "/customizer" ? "active" : ""
                  }`}
              >
                Customize
              </Nav.Link>

              <div className="nav-item-custom">
                <Nav.Link
                  as={Link}
                  to="#"
                  className={`nav-link-luxe ${["/help", "/size-guide", "/faq", "/contact", "/shipping", "/returns"].includes(location.pathname)
                      ? "active"
                      : ""
                    }`}
                >
                  Support <ChevronDownIcon width={12} className="ms-1" />
                </Nav.Link>
                <div className="mega-menu mega-menu-luxe" style={{ width: "200px", left: "auto" }}>
                  <Container className="p-0">
                    <ul className="list-unstyled m-0 p-3">
                      <li className="mb-2">
                        <Link to="/help" className="mega-link">
                          Help Center
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link to="/size-guide" className="mega-link">
                          Size Guide
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link to="/faq" className="mega-link">
                          FAQ
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link to="/contact" className="mega-link">
                          Contact Us
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link to="/shipping" className="mega-link">
                          Shipping Info
                        </Link>
                      </li>
                      <li>
                        <Link to="/returns" className="mega-link">
                          Returns
                        </Link>
                      </li>
                    </ul>
                  </Container>
                </div>
              </div>
            </Nav>

            {/* Desktop Actions */}
            <Nav className="d-flex align-items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-circle icon-luxe"
                onClick={() => setShowSearch(true)}
              >
                <MagnifyingGlassIcon width={20} height={20} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-circle position-relative icon-luxe overflow-visible"
                as={Link}
                to="/wishlist"
              >
                <HeartIcon width={20} height={20} />
                {wishlistCount > 0 && (
                  <span className="cart-badge position-absolute">
                    {wishlistCount}
                  </span>
                )}
              </Button>

              <CartDropdown />

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2 rounded-circle icon-luxe"
              >
                {isDarkMode ? (
                  <SunIcon width={20} height={20} />
                ) : (
                  <MoonIcon width={20} height={20} />
                )}
              </Button>

              {/* User Account */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="ghost"
                  className="p-2 rounded-pill d-flex align-items-center gap-2 border-0"
                  id="userDropdown"
                >
                  <div
                    className="d-flex align-items-center justify-content-center bg-light rounded-circle"
                    style={{ width: "32px", height: "32px" }}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User"
                        className="rounded-circle w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <UserIcon width={18} height={18} />
                    )}
                  </div>
                  {isAuthenticated && (
                    <span className="small fw-bold d-none d-xl-block">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-2 mt-2"
                  style={{ minWidth: "200px" }}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 border-bottom mb-2">
                        <p className="mb-0 fw-bold">{user?.name}</p>
                        <p className="mb-0 small text-muted">{user?.email}</p>
                      </div>
                      <Dropdown.Item
                        as={Link}
                        to="/profile"
                        className="rounded-2"
                      >
                        My Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/orders"
                        className="rounded-2"
                      >
                        My Orders
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/wishlist"
                        className="rounded-2"
                      >
                        Wishlist
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={handleLogout}
                        className="text-danger rounded-2"
                      >
                        Logout
                      </Dropdown.Item>
                    </>
                  ) : (
                    <>
                      <Dropdown.Item
                        as={Link}
                        to="/login"
                        className="rounded-2 fw-bold"
                      >
                        Login
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/register"
                        className="rounded-2"
                      >
                        Register
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/help" className="rounded-2">
                        Help Center
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              <ThemeSelector />
            </Nav>
          </Navbar.Collapse>

          {/* Mobile Menu */}
          <div
            className={`d-lg-none mobile-menu-overlay ${isMenuOpen ? "show" : ""
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className={`mobile-menu-content ${isMenuOpen ? "show" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                <h5 className="mb-0 fw-bold">Menu</h5>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <XMarkIcon width={24} height={24} />
                </Button>
              </div>

              <Nav className="flex-column p-4">
                <Nav.Link
                  as={Link}
                  to="/"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/shop"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/virtual-try-on"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Virtual Try-On
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/customizer"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Customize
                </Nav.Link>

                <hr className="my-3" />

                <div className="d-flex flex-column gap-3">
                  <Link
                    to="/wishlist"
                    className="btn btn-outline w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HeartIcon width={20} height={20} />
                    <span>Wishlist ({wishlistCount})</span>
                  </Link>
                  {!isAuthenticated ? (
                    <Link
                      to="/login"
                      className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserIcon width={20} height={20} />
                      <span>Login / Register</span>
                    </Link>
                  ) : (
                    <Button
                      variant="outline-danger"
                      className="w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <UserIcon width={20} height={20} />
                      <span>Logout</span>
                    </Button>
                  )}
                </div>
              </Nav>
            </div>
          </div>
        </Container>

        {/* Search Modal */}
        <SearchModal
          show={showSearch}
          onHide={() => setShowSearch(false)}
          products={products}
        />
      </Navbar>
    </>
  );
};

export default Navigation;
