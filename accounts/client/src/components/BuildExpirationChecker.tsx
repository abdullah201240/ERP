"use client";

import { useEffect } from "react";
import { parse } from "date-fns";
import { useRouter } from "next/navigation"; // Import the useRouter hook

const BuildExpirationChecker = () => {
  const router = useRouter(); // Initialize the useRouter hook

  useEffect(() => {
    const expirationString = "February 24, 2026 13:07:59";
    const expiryDateTime = parse(expirationString, "MMMM d, yyyy HH:mm:ss", new Date());
    const currentDateTime = new Date();

    console.log(`🕒 Current Time: ${currentDateTime.toLocaleString()}`);
    console.log(`⏳ Expiration Time: ${expiryDateTime.toLocaleString()}`);

    if (currentDateTime > expiryDateTime) {
      // Redirect to the main page if the build has expired
      alert("⚠️ This build has expired. Please rebuild the application.");
      console.error("⚠️ This build has expired. Please rebuild the application.");

      // Redirect the user to the home page or any other page
      router.push("/"); // Redirects to the main page (home)
    }
  }, [router]);

  return null; // This component does not render anything
};

export default BuildExpirationChecker;
