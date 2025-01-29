'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SupervisionForm from '@/components/SupervisionForm'; // Ensure correct path for the component

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const checkTokenAndFetchProfile = async () => {
      // Ensure we're in the browser before accessing localStorage
      if (typeof window === 'undefined') return;

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
          // If the response is not ok, redirect to login
          router.push('/'); // Adjust the path to your login page
          return;
        }

        // If successful, handle the response data here if needed
        const data = await response.json();
        console.log(data); // For debugging or processing the profile data

      } catch (error) {
        console.error("Error fetching profile:", error);
        // Optionally show a user-friendly error message or handle errors differently
        router.push('/'); // Redirect to login if there's an error
      }
    };

    checkTokenAndFetchProfile();
  }, [router]);

  return (
    <div className="bg-[#F1F2F3] pl-0 mt-2">
      <h1 className="text-2xl text-black">Create Supervision Site Visit Plan</h1>
      <SupervisionForm />
    </div>
  );
}
