'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import CompanyTable from './table/companyTable';

interface CompanyDetails {
    name: string;
    logo: File | null;
    password: string;
    email: string;
    phone: string;
    motherAccountEmail: string;
    motherAccountPassword: string;
    numberOfSister: string;
}

export default function CreateCompany() {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
        name: '',
        logo: null,
        password: '',
        email: '',
        phone: '',
        motherAccountEmail: '',
        motherAccountPassword: '',
        numberOfSister: '',
    });

    const [loading, setLoading] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('accessTokenCompany');
            if (!storedToken) {
                router.push('/');
            } else {
                setToken(storedToken);
            }
        }
    }, [router]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCompanyDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Check if files are not null and the length is greater than 0
        const files = e.target.files;
        if (files && files.length > 0) {
            setCompanyDetails((prevDetails) => ({
                ...prevDetails,
                logo: files[0],
            }));
        }
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validate required fields
        if (!companyDetails.name || !companyDetails.logo || !companyDetails.password || !companyDetails.email || !companyDetails.phone || !companyDetails.motherAccountEmail || !companyDetails.motherAccountPassword) {
            toast.error('Please fill in all the required fields!');
            return;
        }

        try {
            setLoading(true);

            // Create a FormData object to send file data
            const formData = new FormData();
            formData.append('name', companyDetails.name);
            formData.append('logo', companyDetails.logo);
            formData.append('password', companyDetails.password);
            formData.append('email', companyDetails.email);
            formData.append('phone', companyDetails.phone);
            formData.append('motherAccountEmail', companyDetails.motherAccountEmail);
            formData.append('motherAccountPassword', companyDetails.motherAccountPassword);
            formData.append('numberOfSister', companyDetails.numberOfSister);


            // Simulate API call to create company
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}company//auth/company/signup`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Failed to create company');
            }

            toast.success('Company created successfully!');
            setReloadTable((prev) => !prev); // Reload the table after form submission
            // Reset form fields
            setCompanyDetails({
                name: '',
                logo: null,
                password: '',
                email: '',
                phone: '',
                motherAccountEmail: '',
                motherAccountPassword: '',
                numberOfSister: '',
            });

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to create company');
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <div>
            <div className="mx-auto max-w-6xl mt-8 pt-12">
                <div className="bg-[#433878] p-8 rounded-xl">
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-white mb-2">Company Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={companyDetails.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter Company Name"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Logo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={companyDetails.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter Password"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={companyDetails.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter Email"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={companyDetails.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter Phone Number"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>

                            <div>
                                <label className="text-white mb-2">Number Of Sister</label>
                                <input
                                    type="number"
                                    name="numberOfSister"
                                    value={companyDetails.numberOfSister}
                                    onChange={handleInputChange}
                                    placeholder="Enter Number Of Sister"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>


                            <div>
                                <label className="text-white mb-2">Mother Account Email</label>
                                <input
                                    type="email"
                                    name="motherAccountEmail"
                                    value={companyDetails.motherAccountEmail}
                                    onChange={handleInputChange}
                                    placeholder="Enter Mother Account Email"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Mother Account Password</label>
                                <input
                                    type="password"
                                    name="motherAccountPassword"
                                    value={companyDetails.motherAccountPassword}
                                    onChange={handleInputChange}
                                    placeholder="Enter Mother Account Password"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'Adding Company...' : 'Add Company'}
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-12">
                <CompanyTable reload={reloadTable} />
            </div>
        </div>
    );
}
