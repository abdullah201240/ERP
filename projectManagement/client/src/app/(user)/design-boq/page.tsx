'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DesignGenerateQutationFrom from '@/components/DesignGenerateQutationFrom';


export default function Home() {
  const router = useRouter();
  

  useEffect(() => {
    const checkTokenAndFetchProfile = async () => {
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
            'Authorization': token
          }
        });

        if (!response.ok) {
          router.push('/'); // Adjust the path to your login page
          return; // Exit the function early
        }

        // Handle the response data here if needed
      } catch (error) {
        console.error(error);
        // Handle error (e.g., show a notification)
      }
    };

    checkTokenAndFetchProfile();
  }, [router]);

  return (
    <div>
      <div className="bg-[#F1F2F3] pl-0 mt-2">
        <h1 className="text-2xl text-black">BOQ</h1>

        <div className="bg-white mt-8  rounded-xl w-[98vw] md:w-full">
          <DesignGenerateQutationFrom/>


        </div>
      </div>
    </div>
  );
}