import { useState, useEffect } from "react";

interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export function useCookie<T>(
  key: string,
  initialValue: T,
  options: CookieOptions = {}
) {
  // Get from cookie then
  // parse stored json or return initialValue
  const readValue = () => {
    // Prevent build error "window is undefined" but keep working
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const cookies = document.cookie.split(";");
      const cookie = cookies.find((c) => c.trim().startsWith(`${key}=`));
      if (!cookie) return initialValue;

      const value = cookie.split("=")[1];
      return value
        ? (JSON.parse(decodeURIComponent(value)) as T)
        : initialValue;
    } catch (error) {
      return initialValue;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to cookie.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save to state
      setStoredValue(valueToStore);

      // Save to cookie
      if (typeof window !== "undefined") {
        const cookieValue = encodeURIComponent(JSON.stringify(valueToStore));
        let cookieString = `${key}=${cookieValue}`;

        if (options.expires) {
          const expires =
            options.expires instanceof Date
              ? options.expires
              : new Date(Date.now() + options.expires * 1000);
          cookieString += `; expires=${expires.toUTCString()}`;
        }

        if (options.path) cookieString += `; path=${options.path}`;
        if (options.domain) cookieString += `; domain=${options.domain}`;
        if (options.secure) cookieString += "; secure";
        if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;

        document.cookie = cookieString;
      }
    } catch (error) {}
  };

  const removeValue = () => {
    try {
      // Remove from state
      setStoredValue(initialValue);

      // Remove from cookie
      if (typeof window !== "undefined") {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${
          options.path ? `; path=${options.path}` : ""
        }${options.domain ? `; domain=${options.domain}` : ""}`;
      }
    } catch (error) {}
  };

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  return [storedValue, setValue, removeValue] as const;
}
