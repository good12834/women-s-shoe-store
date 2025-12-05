import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import apiRequest from "../services/api";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [loading, setLoading] = useState(false);
  const [apiErrorCount, setApiErrorCount] = useState(0);
  const [shouldSkipApi, setShouldSkipApi] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load wishlist from server when user logs in
  useEffect(() => {
    if (isAuthenticated && !shouldSkipApi) {
      loadWishlistFromServer();
    }
  }, [isAuthenticated, shouldSkipApi]);

  const loadWishlistFromServer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || shouldSkipApi) return;

      const response = await apiRequest("/wishlist", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.ok) {
        const serverWishlist = await response.json();
        setWishlistItems(serverWishlist);
        localStorage.setItem("wishlist", JSON.stringify(serverWishlist));
        setApiErrorCount(0); // Reset error count on success
        setShouldSkipApi(false); // Re-enable API calls
      } else if (response.status !== 401) {
        // Only log errors that aren't authentication related
        console.warn("Failed to load wishlist from server:", response.status);
        const newErrorCount = apiErrorCount + 1;
        setApiErrorCount(newErrorCount);
        if (newErrorCount >= 3) {
          setShouldSkipApi(true); // Skip future API calls
        }
      }
    } catch (err) {
      console.warn("Network error loading wishlist:", err.message);
      const newErrorCount = apiErrorCount + 1;
      setApiErrorCount(newErrorCount);
      if (newErrorCount >= 3) {
        setShouldSkipApi(true); // Skip future API calls
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.find((item) => item.id === product.id);
      if (exists) {
        return prevItems;
      }
      return [...prevItems, { ...product, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem("wishlist");
  };

  // Save wishlist to server when it changes and user is authenticated
  const saveWishlistToServer = async (items) => {
    if (!isAuthenticated || shouldSkipApi) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      console.log("Syncing wishlist to server:", items.length, "items");

      // Note: For a full implementation, you'd need a PUT endpoint to sync the entire wishlist
      // For now, we just log to avoid unnecessary API calls that could cause errors
      if (items.length > 0) {
        // Optionally sync individual items to server
        for (const item of items) {
          try {
            await apiRequest("/wishlist", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
              },
              body: JSON.stringify({ product_id: item.id }),
            });
          } catch (itemErr) {
            console.warn(
              "Failed to sync item to wishlist:",
              item.id,
              itemErr.message
            );
          }
        }
      }
    } catch (err) {
      console.error("Error saving wishlist to server:", err);
    }
  };

  // Save to server when wishlist changes
  useEffect(() => {
    if (isAuthenticated && wishlistItems.length > 0 && !shouldSkipApi) {
      saveWishlistToServer(wishlistItems);
    }
  }, [wishlistItems, isAuthenticated, shouldSkipApi]);

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
