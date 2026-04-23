import { useState, useRef, useEffect } from "react";
import styles from "./FilterBar.module.css";

const STATUSES = ["draft", "pending", "paid"];

function FilterBar({ selectedFilters, setSelectedFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleFilter(status) {
    setSelectedFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  }

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        className={styles.toggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.toggleTextFull}>Filter by status</span>
        <span className={styles.toggleTextShort}>Filter</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}>
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {STATUSES.map((status) => (
            <label key={status} className={styles.option}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedFilters.includes(status)}
                onChange={() => toggleFilter(status)}
              />
              <span className={styles.customCheck}>
                {selectedFilters.includes(status) && "✓"}
              </span>
              <span className={styles.optionLabel}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterBar;
