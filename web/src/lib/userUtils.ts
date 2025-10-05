/**
 * Utility functions for managing user identification and cookies
 */

/**
 * Get user ID from cookies
 */
export function getUserIdFromCookie(): string | null {
  if (typeof document === 'undefined') {
    return null; // Server-side rendering
  }

  const userIdFromCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('userId='))
    ?.split('=')[1];

  return userIdFromCookie || null;
}

/**
 * Set user ID in cookies
 */
export function setUserIdInCookie(userId: string, days: number = 30): void {
  if (typeof document === 'undefined') {
    return; // Server-side rendering
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `userId=${userId};expires=${expires.toUTCString()};path=/`;
}

/**
 * Remove user ID from cookies
 */
export function removeUserIdFromCookie(): void {
  if (typeof document === 'undefined') {
    return; // Server-side rendering
  }

  document.cookie = 'userId=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
}

/**
 * Generate a unique user ID (if needed as fallback)
 */
export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create user ID
 * First tries to get from cookie, then generates new one if not found
 */
export function getOrCreateUserId(): string {
  let userId = getUserIdFromCookie();
  
  if (!userId) {
    userId = generateUserId();
    setUserIdInCookie(userId);
  }
  
  return userId;
}