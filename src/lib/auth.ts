// // List of admin emails
// const ADMIN_EMAILS = [
//   "admin@cghs.com",
//   "admin@example.com",
// ]

// /**
//  * Check if an email is in the admin list
//  * @param email The email to check
//  * @returns True if the email is in the admin list, false otherwise
//  */
// export function isAdmin(email: string | null | undefined): boolean {
//   if (!email) return false
//   return ADMIN_EMAILS.includes(email.toLowerCase())
// }

// Get admin emails from environment variables
// Format: ADMIN_EMAILS=email1@example.com,email2@example.com,email3@example.com
const getAdminEmails = (): string[] => {
  const adminEmailsString = process.env.ADMIN_EMAILS || ""
  if (!adminEmailsString) {
    console.warn("No admin emails configured in environment variables")
    return []
  }

  // Split by comma and trim whitespace
  return adminEmailsString.split(",").map((email) => email.trim().toLowerCase())
}

// Get the admin emails list
const ADMIN_EMAILS = getAdminEmails()

/**
 * Check if an email is in the admin list
 * @param email The email to check
 * @returns True if the email is in the admin list, false otherwise
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

