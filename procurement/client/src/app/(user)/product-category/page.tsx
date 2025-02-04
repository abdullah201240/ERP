'use client'
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import ProductCategoryTable from '@/components/table/ProductCategoryTable'
export default function ProductCategoryPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setCategoryName(''); // Reset input field on close
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      // Replace with your API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (response.ok) {
        closePopup(); // Close the popup
        window.location.reload(); // Reload the page to refresh the table
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div>
      <div className="bg-white mt-8 p-4 rounded-xl">
        <div className="w-[98vw] md:w-full">
          {/* Flex container for button and heading */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl">All Product Category</h1>
            <button
              onClick={openPopup}
              className="bg-[#FF8319] text-white px-4 py-2 rounded"
            >
              + Add Category
            </button>
          </div>

          <div className="w-[98vw] md:w-full">
            <ProductCategoryTable />
          </div>
        </div>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Category</h3>
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
                    Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
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

