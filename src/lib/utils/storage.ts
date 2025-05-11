/**
 * Safe localStorage access utility
 * Handles SSR and browser storage exceptions
 */
export const safeLocalStorage = {
  getItem: (key: string, defaultValue: any = null): any => {
    if (typeof window === "undefined") return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return defaultValue
    }
  },

  setItem: (key: string, value: any): boolean => {
    if (typeof window === "undefined") return false
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
      return false
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === "undefined") return false
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
      return false
    }
  },
}
