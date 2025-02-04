'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Loading state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    countryOfOrigin: '',
    sizeAndDimension: '',
    category: '', // Category will now be a dropdown
    supplierProductCode: '',
    ourProductCode: '',
    mrpPrice: '',
    discountPercentage: '',
    discountAmount: '',
    sourcePrice: '',
    unit: '',
    product_category: '',
  });
  const [categories, setCategories] = useState([]); // Categories state
  const [units, setUnits] = useState([]); // Categories state

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        router.push('/'); // Adjust the path to your login page
        return; // Exit the function early
    }
    
}, [ router]);
  const fetchCategories = useCallback(async () => {

    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/'); // Adjust the path to your login page
            return; // Exit the function early
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/category`, {
            headers: {
                'Authorization': token,

            },
        }); // Replace with your actual API endpoint
        if (!response.ok) throw new Error("Failed to fetch categories");
        const result = await response.json(); // Parse the response JSON

        // Check if the response has a `data` field and it is an array
        if (result.data && Array.isArray(result.data)) {
            setCategories(result.data); // Set the categories from the `data` field
        } else {
            console.error("Expected an array of categories inside 'data', but got:", result);
            setCategories([]); // Default to an empty array if the structure is incorrect
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Default to an empty array in case of error
    }
}, [router]);


const fetchUnit = useCallback(async () => {

    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/'); // Adjust the path to your login page
            return; // Exit the function early
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/unit`, {
            headers: {
                'Authorization': token,

            },
        }); // Replace with your actual API endpoint
        if (!response.ok) throw new Error("Failed to fetch unitd");
        const result = await response.json(); // Parse the response JSON

        // Check if the response has a `data` field and it is an array
        if (result.data && Array.isArray(result.data)) {
            setUnits(result.data); // Set the categories from the `data` field
        } else {
            console.error("Expected an array of categories inside 'data', but got:", result);
            setUnits([]); // Default to an empty array if the structure is incorrect
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        setUnits([]); // Default to an empty array in case of error
    }
}, [router]);
useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        router.push('/'); // Adjust the path to your login page
        return; // Exit the function early
    }
    fetchCategories();
    fetchUnit();
}, [ router,fetchCategories,fetchUnit]);
  // Fetch categories from your API
 

  

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Set loading to true

    const token = localStorage.getItem('accessToken');

    if (token) {
        console.log(JSON.stringify(formData))
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products/create-product`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          await response.json();
          toast.success('Product added successfully!');

          setFormData({ // Clear form fields
            name: '',
            brand: '',
            countryOfOrigin: '',
            sizeAndDimension: '',
            category: '',
            supplierProductCode: '',
            ourProductCode: '',
            mrpPrice: '',
            discountPercentage: '',
            discountAmount: '',
            sourcePrice: '',
            unit:'',
            product_category: '',
          });

          router.push('/dashboard');
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to add product.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false); // Reset loading state
      }
    } else {
      router.push('/'); // Redirect to login if token is not available
    }
  };

  return (
    <div>
      <div className="container mx-auto max-w-6xl mb-12">
        <h1 className="text-2xl text-black mb-6">Add a Product</h1>
        <div className='bg-[#433878] p-8 rounded-xl'>
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <p className='text-white'>Fill-up all Information and create a new product successfully!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
                <label className='text-white mb-2'>Product Category</label>
                <select
                  required
                  id="product_category"
                  name="product_category"
                  value={formData.product_category}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                >
                  <option value="">Select a product category</option>
                  
                    <option value="Low">
                      Low
                    </option>
                    <option value="Standard">
                    Standard 
                    </option>
                    <option value="Premium">
                    Premium
                    </option>
            
                </select>

              
            </div>
              <div>
                <label className='text-white mb-2'>Name</label>
                <input
                  type="text"
                  required
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

              <div>
                <label className='text-white mb-2'>Units</label>
                <select
                  required
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                >
                  <option value="">Select a unit</option>
                  {units.map((unit: { id: string, name: string }) => (
                    <option key={unit.id} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>

              
            </div>
              

              <div>
                <label className='text-white mb-2'>Brand</label>
                <input
                  type="text"
                  required
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Brand"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>


              <div>
                <label className='text-white mb-2'>Country of Origin</label>
                <input
                  type="text"
                  required
                  id="countryOfOrigin"
                  name="countryOfOrigin"
                  value={formData.countryOfOrigin}
                  onChange={handleChange}
                  placeholder="Country of Origin"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>
              
              <div>
                <label className='text-white mb-2'>Category</label>
                <select
                  required
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((category: { id: string, name: string }) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='text-white mb-2'>Supplier Product Code</label>
                <input
                  type="text"
                  required
                  id="supplierProductCode"
                  name="supplierProductCode"
                  value={formData.supplierProductCode}
                  onChange={handleChange}
                  placeholder="Supplier Product Code"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

              <div>
                <label className='text-white mb-2'>Our Product Code</label>
                <input
                  type="text"
                  required
                  id="ourProductCode"
                  name="ourProductCode"
                  value={formData.ourProductCode}
                  onChange={handleChange}
                  placeholder="Our Product Code"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

              <div>
                <label className='text-white mb-2'>MRP Price</label>
                <input
                  type="number"
                  required
                  id="mrpPrice"
                  name="mrpPrice"
                  value={formData.mrpPrice}
                  onChange={handleChange}
                  placeholder="MRP Price"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>
              <div>
                <label className='text-white mb-2'>Discount (%)</label>
                <input
                  type="number"
                  required
                  id="discountPercentage"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  placeholder="Discount (%)"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

              <div>
                <label className='text-white mb-2'>Discount Amount</label>
                <input
                  type="number"
                  required
                  id="discountAmount"
                  name="discountAmount"
                  value={formData.discountAmount}
                  onChange={handleChange}
                  placeholder="Discount Amount"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>
              <div>
                <label className='text-white mb-2'>Source Price</label>
                <input
                  type="number"
                  required
                  id="sourcePrice"
                  name="sourcePrice"
                  value={formData.sourcePrice}
                  onChange={handleChange}
                  placeholder="Source Price"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

              


            </div>
            <div>
                <label className='text-white mb-2'>Size and Dimension</label>
                <textarea
                 
                  required
                  rows={4}
                  id="sizeAndDimension"
                  name="sizeAndDimension"
                  value={formData.sizeAndDimension}
                  onChange={handleChange}
                  placeholder="Size and Dimension"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

        

            <div className="col-span-full mt-6 p-2">
              <button
                type="submit"
                disabled={loading} // Disable button while loading
                className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
