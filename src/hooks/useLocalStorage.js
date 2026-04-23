import { useState } from "react";

// This custom hook works exactly like useState,
// but it also saves the value to LocalStorage automatically.
// So when the user refreshes the page, their data is still there.

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // If something exists in localStorage, use it.
      // Otherwise use the initialValue we passed in.
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("LocalStorage read error:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("LocalStorage write error:", error);
    }
  };

  return [storedValue, setValue];
}
