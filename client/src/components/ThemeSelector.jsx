import { Dropdown } from "react-bootstrap";
import { useTheme } from "../context/ThemeContext";
import { PaintBrushIcon } from "@heroicons/react/24/outline";

const ThemeSelector = () => {
  const { currentTheme, changeTheme, themes } = useTheme();

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="ghost"
        id="theme-dropdown"
        className="d-flex align-items-center gap-2 rounded-pill px-3"
        style={{
          border: "1px solid rgba(255,255,255,0.2)",
          transition: "all 0.3s ease",
        }}
      >
        <PaintBrushIcon width={18} height={18} />
        <span className="d-none d-md-inline fs-5">
          {themes[currentTheme].icon}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu
        align="end"
        className="theme-selector-menu border-0 shadow-lg"
        style={{
          borderRadius: "16px",
          padding: "8px",
          minWidth: "320px",
        }}
      >
        <Dropdown.Header className="px-3 py-2">
          <div className="d-flex align-items-center gap-2">
            <PaintBrushIcon width={20} height={20} />
            <span className="fw-bold">Choose Theme</span>
          </div>
        </Dropdown.Header>

        {Object.entries(themes).map(([key, theme]) => (
          <Dropdown.Item
            key={key}
            active={currentTheme === key}
            onClick={() => changeTheme(key)}
            className={`d-flex align-items-center gap-3 p-3 rounded-3 mb-1 transition-all ${
              currentTheme === key ? "active" : ""
            }`}
            style={{
              transition: "all 0.2s ease",
            }}
          >
            {/* Theme Preview */}
            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle mb-2"
                style={{
                  width: "32px",
                  height: "32px",
                  background: theme.gradient,
                  border:
                    currentTheme === key
                      ? "3px solid var(--primary-color)"
                      : "2px solid #e0e0e0",
                  transition: "all 0.3s ease",
                }}
              />
              <span style={{ fontSize: "1rem" }}>{theme.icon}</span>
            </div>

            {/* Theme Info */}
            <div className="flex-grow-1">
              <div className="fw-bold mb-1">{theme.name}</div>
              <small className="text-muted">{theme.description}</small>
            </div>

            {/* Color Palette */}
            <div className="d-flex gap-1">
              {theme.colors.map((color, index) => (
                <div
                  key={index}
                  className="rounded-circle"
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: color,
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                />
              ))}
            </div>

            {/* Active Indicator */}
            {currentTheme === key && (
              <div className="text-primary">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </Dropdown.Item>
        ))}

        {/* Footer */}
        <div className="px-3 py-2 border-top mt-2">
          <small className="text-muted">
            💡 Tip: Themes change the entire look and feel of the website
          </small>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ThemeSelector;
