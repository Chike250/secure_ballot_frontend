/**
 * Utility function to fetch data with error handling
 */
export async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Fetch error:", error)
    return null
  }
}

/**
 * Simulates an API call with optional delay and failure
 */
export async function simulateApiCall<T>(data: T, delay = 500, shouldFail = false): Promise<T | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        console.warn("Simulated API failure")
        resolve(null)
      } else {
        resolve(data)
      }
    }, delay)
  })
}
