'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams(); // Get the product ID from the URL
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
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
        unit: '',
        product_category: '',
    });
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessTokenpq');
        if (!token) {
            router.push('/');
            return;
        }
    }, [router]);

    const fetchCategories = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessTokenpq');
            if (!token) {
                router.push('/');
                return;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/category`, {
                headers: {
                    Authorization: token,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch categories');
            const result = await response.json();

            if (result.data && Array.isArray(result.data)) {
                setCategories(result.data);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    }, [router]);

    const fetchUnit = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessTokenpq');
            if (!token) {
                router.push('/');
                return;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/unit`, {
                headers: {
                    Authorization: token,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch units');
            const result = await response.json();

            if (result.data && Array.isArray(result.data)) {
                setUnits(result.data);
            } else {
                setUnits([]);
            }
        } catch (error) {
            console.error('Error fetching units:', error);
            setUnits([]);
        }
    }, [router]);

    const fetchProduct = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessTokenpq');
            if (!token) {
                router.push('/');
                return;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/product/${id}`, {
                headers: {
                    Authorization: token,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch product');
            const result = await response.json();

            if (result.data) {
                setFormData(result.data);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product data.');
        }
    }, [id, router]);

    useEffect(() => {
        const token = localStorage.getItem('accessTokenpq');
        if (!token) {
            router.push('/');
            return;
        }
        fetchCategories();
        fetchUnit();
        fetchProduct();
    }, [router, fetchCategories, fetchUnit, fetchProduct]);

    const generateRandomNumber = () => Math.floor(10000 + Math.random() * 90000);

    const generateProductCode = useCallback((productCategory: string, category: string) => {
        if (!productCategory || !category) return '';
        const firstThreeLetters = category.slice(0, 3).toLowerCase();
        const randomNumber = generateRandomNumber();
        return `${productCategory}${firstThreeLetters}${randomNumber}`;
    }, []);

    useEffect(() => {
        const newOurProductCode = generateProductCode(formData.product_category, formData.category);
        setFormData((prevData) => ({
            ...prevData,
            ourProductCode: newOurProductCode,
        }));
    }, [formData.product_category, formData.category, generateProductCode]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };

            // Handle changes for discount fields
            if (name === 'discountPercentage' || name === 'discountAmount') {
                // Recalculate other field based on the updated one
                if (name === 'discountPercentage') {
                    const discountPercentage = parseFloat(value) || 0;
                    const mrpPrice = parseFloat(updatedData.mrpPrice) || 0;
                    updatedData.discountAmount = ((mrpPrice * discountPercentage) / 100).toFixed(2);
                } else if (name === 'discountAmount') {
                    const discountAmount = parseFloat(value) || 0;
                    const mrpPrice = parseFloat(updatedData.mrpPrice) || 0;
                    updatedData.discountPercentage = ((discountAmount / mrpPrice) * 100).toFixed(2);
                }
            }

            // Handle sourcePrice calculation
            if (name === 'mrpPrice' || name === 'discountAmount' || name === 'discountPercentage' ) {
                const mrpPrice = parseFloat(updatedData.mrpPrice) || 0;
                const discountAmount = parseFloat(updatedData.discountAmount) || 0;
                updatedData.sourcePrice = (mrpPrice - discountAmount).toFixed(2);
            }

            return updatedData;
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('accessTokenpq');
        if (token) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/product/${id}`, {
                    method: 'PUT', // Use PUT or PATCH for updating
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    await response.json();
                    toast.success('Product updated successfully!');
                    router.push('/product');
                } else {
                    const error = await response.json();
                    toast.error(error.message || 'Failed to update product.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                toast.error('An unexpected error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            router.push('/');
        }
    };

    return (
        <div>
            <div className="container mx-auto max-w-6xl mb-12">
                <h1 className="text-2xl text-black mb-6">Edit Product</h1>
                <div className="bg-[#433878] p-8 rounded-xl">
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                        <p className="text-white">Edit the product information below.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-white mb-2">Product Category</label>
                                <select
                                    required
                                    id="product_category"
                                    name="product_category"
                                    value={formData.product_category}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                                >
                                    <option value="">Select a product category</option>
                                    <option value="Low">Low</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-white mb-2">Name</label>
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
                                <label className="text-white mb-2">Units</label>
                                <select
                                    required
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                                >
                                    <option value="">Select a unit</option>
                                    {units.map((unit: { id: string; name: string }) => (
                                        <option key={unit.id} value={unit.name}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-white mb-2">Brand</label>
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
                                <label className="text-white mb-2">Country of Origin</label>
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
                                <label className="text-white mb-2">Category</label>
                                <select
                                    required
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category: { id: string; name: string }) => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-white mb-2">Supplier Product Code</label>
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
                                <label className="text-white mb-2">Our Product Code</label>
                                <input
                                    type="text"
                                    required
                                    id="ourProductCode"
                                    name="ourProductCode"
                                    value={formData.ourProductCode}
                                    onChange={handleChange}
                                    placeholder="Our Product Code"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="text-white mb-2">MRP Price</label>
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
                                <label className="text-white mb-2">Discount (%)</label>
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
                                <label className="text-white mb-2">Discount Amount</label>
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
                                <label className="text-white mb-2">Source Price</label>
                                <input
                                    type="number"
                                    required
                                    id="sourcePrice"
                                    name="sourcePrice"
                                    value={formData.sourcePrice}
                                    onChange={handleChange}
                                    placeholder="Source Price"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-white mb-2">Size and Dimension</label>
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
                                disabled={loading}
                                className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Updating Product...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}