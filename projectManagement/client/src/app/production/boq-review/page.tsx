"use client"
import React, { useEffect } from 'react'
import ProductionReviewWorkingDrawingBoqTable from '@/components/table/ProductionReviewWorkingDrawingBoqTable'
import { useRouter } from 'next/navigation';
export default function Page() {

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
      <div className="mt-12">
                    <ProductionReviewWorkingDrawingBoqTable  />
                </div>
    </div>
  )
}
