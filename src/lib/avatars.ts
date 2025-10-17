/**
 * Avatar utility functions
 * Manages profile pictures with custom uploads and DiceBear fallback
 */

// Map of user names to their custom profile picture filenames
// Add entries here when you upload new profile pictures
const CUSTOM_AVATARS: Record<string, string> = {
  "Sarah Chen": "/avatars/sarah.jpeg",
  "Marcus Johnson": "/avatars/marcus.jpeg",
  "Emma Williams": "/avatars/emma.jpeg",
  "David Park": "/avatars/david.jpeg",
  "Lisa Anderson": "/avatars/lisa.jpeg",
  "Ryan Thompson": "/avatars/ryan.jpeg",
  // Add more users as needed
  // Format: "Full Name": "/avatars/filename.jpg"
};

/**
 * Get the avatar URL for a user
 * Returns custom avatar if available, otherwise falls back to DiceBear
 */
export const getAvatarUrl = (userName: string): string => {
  // Check if user has a custom avatar
  if (CUSTOM_AVATARS[userName]) {
    return CUSTOM_AVATARS[userName];
  }

  // Fallback to DiceBear generated avatar
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    userName
  )}`;
};

/**
 * Check if a user has a custom avatar
 */
export const hasCustomAvatar = (userName: string): boolean => {
  return userName in CUSTOM_AVATARS;
};

/**
 * Get initials from a name for fallback display
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
      0
    )}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};
