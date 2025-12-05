// Mock data service for fallback when API is not available

export const mockProducts = [
  {
    id: 1,
    name: "Elegant Red Heels",
    price: 89.99,
    originalPrice: 129.99,
    image_url:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 124,
    category: "Heels",
    isNew: true,
    isSale: true,
    inStock: true,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["#E91E63", "#000000", "#8B4513"],
    description: "Elegant red heels perfect for special occasions",
    tags: ["heels", "red", "elegant", "formal"],
  },
  {
    id: 2,
    name: "Comfy White Sneakers",
    price: 65.0,
    originalPrice: 75.0,
    image_url:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    reviews: 89,
    category: "Sneakers",
    isNew: false,
    isSale: true,
    inStock: true,
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["#FFFFFF", "#F5F5F5", "#FFD700"],
    description: "Comfortable white sneakers for everyday wear",
    tags: ["sneakers", "white", "comfortable", "casual"],
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
    category: "Sandals",
    isNew: true,
    isSale: false,
    inStock: true,
    sizes: ["36", "37", "38", "39"],
    colors: ["#D2691E", "#000000", "#FAEBD7"],
    description: "Light and airy summer sandals",
    tags: ["sandals", "summer", "light", "casual"],
  },
  {
    id: 4,
    name: "Classic Black Boots",
    price: 120.0,
    image_url:
      "https://images.unsplash.com/photo-1608256255256-411200dde1ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fENsYXNzaWMlMjBCbGFjayUyMEJvb3RzfGVufDB8fDB8fHww",
    rating: 4.9,
    reviews: 203,
    category: "Boots",
    isNew: false,
    isSale: false,
    inStock: true,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["#000000", "#8B4513", "#2F4F4F"],
    description: "Timeless black boots for any season",
    tags: ["boots", "black", "classic", "versatile"],
  },
  {
    id: 5,
    name: "Pink Ballet Flats",
    price: 55.0,
    image_url:
      "https://plus.unsplash.com/premium_photo-1673716788773-4a8964fa26b9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UGluayUyMEJhbGxldCUyMEZsYXRzfGVufDB8fDB8fHww",
    rating: 4.5,
    reviews: 78,
    category: "Flats",
    isNew: true,
    isSale: false,
    inStock: true,
    sizes: ["35", "36", "37", "38", "39"],
    colors: ["#FFC0CB", "#FFB6C1", "#FF69B4"],
    description: "Soft and comfortable pink ballet flats",
    tags: ["flats", "pink", "ballet", "comfortable"],
  },
  {
    id: 6,
    name: "Leather Loafers",
    price: 95.0,
    originalPrice: 110.0,
    image_url:
      "https://images.unsplash.com/photo-1632690642793-a270624dd20d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fExlYXRoZXIlMjBMb2FmZXJzfGVufDB8fDB8fHww",
    rating: 4.7,
    reviews: 145,
    category: "Loafers",
    isNew: false,
    isSale: true,
    inStock: true,
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["#8B4513", "#000000", "#654321"],
    description: "Premium leather loafers for professional wear",
    tags: ["loafers", "leather", "professional", "formal"],
  },
  {
    id: 7,
    name: "Rain Boots",
    price: 45.0,
    image_url:
      "https://plus.unsplash.com/premium_photo-1728158949989-8118f68cc693?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fEJvb3RzJTIwUmFpbiUyMEJvb3RzfGVufDB8fDB8fHww",
    rating: 4.3,
    reviews: 92,
    category: "Boots",
    isNew: false,
    isSale: false,
    inStock: true,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["#4169E1", "#228B22", "#8B0000"],
    description: "Waterproof rain boots for all weather",
    tags: ["boots", "rain", "waterproof", "weather"],
  },
  {
    id: 8,
    name: "Evening Pumps",
    price: 110.0,
    image_url:
      "https://images.unsplash.com/photo-1704273944825-b9bcf7f85c59?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fCUyNDc1JTIwJTI0ODUlMjA0LjQlMjBFdmVuaW5nJTIwUHVtcHMlMjBOZXclMjAlMjBIZWVscyUyMEV2ZW5pbmclMjBQdW1wc3xlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.9,
    reviews: 67,
    category: "Heels",
    isNew: true,
    isSale: false,
    inStock: true,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["#000000", "#C0C0C0", "#8B0000"],
    description: "Elegant evening pumps for special occasions",
    tags: ["heels", "evening", "elegant", "formal"],
  },
  {
    id: 9,
    name: "Platform Sneakers",
    price: 75.0,
    originalPrice: 85.0,
    image_url:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.4,
    reviews: 134,
    category: "Sneakers",
    isNew: false,
    isSale: true,
    inStock: true,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["#FFFFFF", "#000000", "#FFD700"],
    description: "Trendy platform sneakers for a bold look",
    tags: ["sneakers", "platform", "trendy", "bold"],
  },
  {
    id: 10,
    name: "Designer Wedges",
    price: 85.0,
    image_url:
      "https://media.istockphoto.com/id/1437843386/photo/closeup-shot-of-female-feet-wearing-cork-wedge-sandals.webp?a=1&b=1&s=612x612&w=0&k=20&c=I9uvAn-TVxOpptQ9NkhAS_cDdLKAruRWm2KBqV9MM4k=",
    rating: 4.6,
    reviews: 88,
    category: "Wedges",
    isNew: true,
    isSale: false,
    inStock: true,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["#D2691E", "#8B4513", "#000000"],
    description: "Stylish wedges with designer details",
    tags: ["wedges", "designer", "stylish", "summer"],
  },
];

// Mock API service with fallback
export const fetchProducts = async (filters = {}) => {
  // Return filtered mock data as primary source for demo
  let filteredData = [...mockProducts];

  if (filters.category) {
    filteredData = filteredData.filter(
      (product) =>
        product.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  if (filters.minPrice) {
    filteredData = filteredData.filter(
      (product) => product.price >= parseFloat(filters.minPrice)
    );
  }

  if (filters.maxPrice) {
    filteredData = filteredData.filter(
      (product) => product.price <= parseFloat(filters.maxPrice)
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredData = filteredData.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Sort results
  if (filters.sort) {
    switch (filters.sort) {
      case "price_asc":
        filteredData.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filteredData.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredData.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        // Newest first (simulated by id in this case)
        filteredData.sort((a, b) => b.id - a.id);
        break;
    }
  }

  return filteredData;

  // Original API code commented out - uncomment when database is set up
  /*
  try {
    // Try to fetch from API first
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
    if (filters.size) queryParams.append("size", filters.size);
    if (filters.color) queryParams.append("color", filters.color);
    if (filters.heel) queryParams.append("heel", filters.heel);
    if (filters.sort) queryParams.append("sort", filters.sort);

    const response = await fetch(`/api/products?${queryParams.toString()}`);

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log("API not available, using mock data");
  }
  */
};

// Search function with better matching
export const searchProducts = (query, products = mockProducts) => {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  );
};

// Get individual product by ID
export const getProductById = async (id) => {
  const productId = parseInt(id);
  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Transform to match expected format from API
  return {
    ...product,
    images: [
      product.image_url,
      product.image_url,
      product.image_url,
      product.image_url,
    ],
    stock: 15, // Default stock
    shortDescription: product.description,
    specifications: {
      Material: "Leather",
      "Heel Height": product.category === "Heels" ? "High" : "Low",
      Occasion: "Casual",
      Brand: "Designer Collection",
    },
    care: ["Clean with a soft, dry cloth", "Store in a cool, dry place"],
    variants: [
      // Mock variants data
      { size: "36", color_name: "Black", hex_code: "#000000", stock: 5 },
      { size: "37", color_name: "Black", hex_code: "#000000", stock: 8 },
      { size: "38", color_name: "Black", hex_code: "#000000", stock: 12 },
      { size: "39", color_name: "Black", hex_code: "#000000", stock: 7 },
      { size: "40", color_name: "Black", hex_code: "#000000", stock: 3 },
    ],
  };
};

export default {
  mockProducts,
  fetchProducts,
  searchProducts,
};
