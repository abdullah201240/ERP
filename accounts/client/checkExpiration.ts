import { parse } from "date-fns"; // Import date-fns for parsing

const expirationString = "February 24, 2025 13:07:59";

// Convert human-readable string to a Date object
const expiryDateTime = parse(expirationString, "MMMM d, yyyy HH:mm:ss", new Date());
const currentDateTime = new Date();

console.log(`🕒 Current Time: ${currentDateTime.toLocaleString()}`);
console.log(`⏳ Expiration Time: ${expiryDateTime.toLocaleString()}`);

if (currentDateTime > expiryDateTime) {
  console.error("⚠️ This build has expired. Please rebuild the application.");
  process.exit(1);
} else {
  console.log("✅ Build is valid. Starting the application...");
}
