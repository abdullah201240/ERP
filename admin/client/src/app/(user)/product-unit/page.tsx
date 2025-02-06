'use client'
import { Button } from '@/components/ui/button';
import React, { useState ,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductUnitTable from '@/components/table/ProductUnitTable'
export default function ProductunitPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [unitName, setUnitName] = useState('');
  const [reloadTable, setReloadTable] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkTokenAndFetchProfile = async () => {
      // Check if the access token exists in localStorage
      const token = localStorage.getItem('accessTokenpq');

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
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setUnitName(''); // Reset input field on close
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessTokenpq');
      if (!token) {
        router.push('/'); // Adjust the path to your login page
        return; // Exit the function early
      }
      // Replace with your API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/unit`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: unitName }),
      });

      if (response.ok) {
        closePopup(); // Close the popup
        setReloadTable((prev) => !prev);
      } else {
        console.error('Failed to add unit');
      }
    } catch (error) {
      console.error('Error adding unit:', error);
    }
  };

  return (
    <div>
      <h1 className="text-lg">All Product unit</h1>
      <div className="bg-white mt-8 p-4 rounded-xl">
        
        
          {/* Flex container for button and heading */}
          <div className="flex items-center justify-between mb-4">
            
            <button
              onClick={openPopup}
              className="bg-[#FF8319] text-white px-4 py-2 rounded"
            >
              + Add unit
            </button>
          </div>

          
            <ProductUnitTable reload={reloadTable} />
         
       
      </div>



      {isPopupOpen && (
        <div
          id="default-modal"
          tabIndex={isPopupOpen ? 0 : -1}
          aria-hidden={!isPopupOpen}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isPopupOpen ? "block" : "hidden"}`}
        >
          <div className="relative w-full max-w-lg p-4 mx-2 bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-16">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add unit</h3>
              <button
                type="button"
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-400 rounded-lg hover:text-gray-900 hover:bg-gray-200 p-2 dark:hover:bg-gray-700 dark:hover:text-white"
                aria-label="Close Modal"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>



              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="start-date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    unit Name
                  </label>
                  <input
                    type="text"
                    placeholder="unit Name"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    className="border p-2 w-full mb-4"
                    required
                  />
                </div>

              </div>



              <div className="flex justify-end space-x-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                <Button
                  onClick={() => setIsPopupOpen(false)}
                  data-modal-hide="default-modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Decline
                </Button>
                <button
                  type="submit"
                  className="text-white bg-[#433878] hover:bg-[#433878] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#433878] dark:hover:bg-[#433878] dark:focus:ring-[#433878]"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}




    </div>
  );
}

