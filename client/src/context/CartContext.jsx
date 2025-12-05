import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import apiRequest from "../services/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart from server when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      loadCartFromServer();
    }
  }, [isAuthenticated]);

  const loadCartFromServer = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiRequest("/cart", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.ok) {
        const serverCart = await response.json();
        setCartItems(serverCart);
        localStorage.setItem("cart", JSON.stringify(serverCart));
      }
    } catch (err) {
      console.error("Error loading cart from server:", err);
    }
  };

  const saveCartToServer = async (items) => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem("token");
      // For now, we'll add items one by one to the server
      for (const item of items) {
        await apiRequest("/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            productId: item.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          }),
        });
      }
    } catch (err) {
      console.error("Error saving cart to server:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    // Save to server when cart changes and user is authenticated
    if (isAuthenticated && cartItems.length > 0) {
      saveCartToServer(cartItems);
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = (product, quantity, size, color) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, { ...product, quantity, size, color }];
      }
    });
  };

  const removeFromCart = (id, size, color) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color)
      )
    );
  };

  // Alias for removeFromCart to match CartDropdown usage
  const removeItem = removeFromCart;

  const updateQuantity = (id, size, color, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Alias for cartTotal to match CartDropdown usage
  const subtotal = cartTotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        subtotal,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
