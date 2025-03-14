'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DesignFinalGenerateQutationFrom from '@/components/DesignFinalGenerateQutationFrom';
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const checkTokenAndFetchProfile = async () => {
      // Ensure we're in the browser before accessing localStorage

      // Check if the access token exists in localStorage
      const token = localStorage.getItem('accessToken');

      // If the token does not exist, redirect to the login page
      if (!token) {
        router.push('/'); // Adjust the path to your login page
        return; // Exit the function early
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // You can optionally handle different response statuses here
          router.push('/'); // Adjust the path to your login page
          return;
        }

       

      } catch (error) {
        console.error("Error fetching profile:", error);
        // Optionally show a user-friendly error message
        router.push('/'); // Redirect to login if there's an error
      }
    };

    checkTokenAndFetchProfile();
  }, [router]);

  return (
    <div className="bg-[#F1F2F3] pl-0 mt-2">
      <h1 className="text-2xl text-black">Generate Quotation</h1>
      <DesignFinalGenerateQutationFrom />
    </div>
  );
}



