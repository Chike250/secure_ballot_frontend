// Utility functions to handle API rate limiting

interface RateLimitOptions {
  maxRetries?: number;
  baseDelay?: number; // in milliseconds
  backoffMultiplier?: number;
}

/**
 * Wrapper function that adds retry logic for rate-limited API calls
 */
export async function withRateLimit<T>(
  apiCall: () => Promise<T>,
  options: RateLimitOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, backoffMultiplier = 2 } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      const isRateLimit = 
        error.message?.includes('TOO_MANY_REQUESTS') ||
        error.code === 'TOO_MANY_REQUESTS' ||
        error.status === 429;

      if (isRateLimit && attempt < maxRetries) {
        // Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(backoffMultiplier, attempt);
        console.log(`Rate limit hit, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // If it's not a rate limit error or we've exhausted retries, throw the error
      throw error;
    }
  }

  // This should never be reached, but TypeScript needs it
  throw new Error('Max retries exceeded');
}

/**
 * Adds a delay between sequential API calls to prevent rate limiting
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Processes an array of items with delays between each API call
 */
export async function processWithDelay<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  delayMs: number = 500
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      const result = await processor(items[i], i);
      results.push(result);

      // Add delay between calls (except for the last one)
      if (i < items.length - 1) {
        await delay(delayMs);
      }
    } catch (error) {
      console.error(`Failed to process item at index ${i}:`, error);
      
      // For rate limiting, we might want to stop processing
      if (error instanceof Error && error.message?.includes('TOO_MANY_REQUESTS')) {
        console.warn('Rate limit reached, stopping batch processing');
        break;
      }
      
      // For other errors, continue processing but add the error to results
      throw error;
    }
  }

  return results;
}

/**
 * Creates a queue that processes API calls with rate limiting
 */
export class RateLimitQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private delayMs: number;

  constructor(delayMs: number = 500) {
    this.delayMs = delayMs;
  }

  async add<T>(apiCall: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await apiCall();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const apiCall = this.queue.shift();
      if (apiCall) {
        try {
          await apiCall();
        } catch (error) {
          console.error('Queue processing error:', error);
        }

        // Add delay between calls
        if (this.queue.length > 0) {
          await delay(this.delayMs);
        }
      }
    }

    this.processing = false;
  }
} 