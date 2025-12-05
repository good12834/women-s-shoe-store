import { createContext, useContext, useState, useEffect } from "react";
const ThemeContext = createContext();
export const themes = {
  feminine: {
    name: "Soft Feminine",
    icon: "🌸",
    description: "Baby pink, cream, peach tones",
    colors: ["#e91e63", "#f8bbd9", "#fce4ec"],
    gradient: "linear-gradient(135deg, #e91e63, #f8bbd9)",
  },
  luxury: {
    name: "Luxury Minimal",
    icon: "✨",
    description: "White, grey, black, gold accents",
    colors: ["#d4af37", "#f5f5f5", "#1a1a1a"],
    gradient: "linear-gradient(135deg, #d4af37, #f5f5f5)",
  },
  magazine: {
    name: "Fashion Magazine",
    icon: "💄",
    description: "Bold pink, dark rose, charcoal",
    colors: ["#ff1493", "#8b4789", "#2f2f2f"],
    gradient: "linear-gradient(135deg, #ff1493, #8b4789)",
  },
  dark: {
    name: "Elegant Dark",
    icon: "🌙",
    description: "Deep black, gold, white highlights",
    colors: ["#1a1a1a", "#d4af37", "#ffffff"],
    gradient: "linear-gradient(135deg, #1a1a1a, #d4af37)",
  },
  ocean: {
    name: "Ocean Breeze",
    icon: "🌊",
    description: "Blue teals, aqua, coral accents",
    colors: ["#00838f", "#4dd0e1", "#ffab91"],
    gradient: "linear-gradient(135deg, #00838f, #4dd0e1)",
  },
  forest: {
    name: "Forest Nature",
    icon: "🌿",
    description: "Forest greens, earth tones",
    colors: ["#2e7d32", "#66bb6a", "#a1887f"],
    gradient: "linear-gradient(135deg, #2e7d32, #66bb6a)",
  },
  sunset: {
    name: "Sunset Glow",
    icon: "🌅",
    description: "Orange, pink, purple gradients",
    colors: ["#ff7043", "#f06292", "#7e57c2"],
    gradient: "linear-gradient(135deg, #ff7043, #f06292)",
  },
};
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("theme") || "feminine";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };
  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
export default ThemeContext;
