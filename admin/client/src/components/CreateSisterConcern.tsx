'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import  SisterConcernTable from './table/SisterConcernTable';

interface SisterConcernDetails {
    name: string;
    logo: File | null;
    password: string;
    email: string;
    phone: string;
    companyId: string; // Add company ID field
    companyEmail: string;
}

export default function CreateSisterConcern() {
    const [token, setToken] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);

    const router = useRouter();

    const [sisterConcernDetails, setSisterConcernDetails] = useState<SisterConcernDetails>({
        name: '',
        logo: null,
        password: '',
        email: '',
        phone: '',
        companyId: '', // Initialize as empty
        companyEmail: '',

    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('accessTokenCompany');
            if (!storedToken) {
                router.push('/');
            } else {
                setToken(storedToken);
                fetchCompanyProfile(storedToken);
            }
        }
    }, [router]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const fetchCompanyProfile = async (accessToken: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}company/auth/company/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const data = await response.json();

            if (data.success) {
                setSisterConcernDetails((prev) => ({
                    ...prev,
                    companyEmail: data.data.email, // Autofill email
                    companyId: data.data.id, // Store company ID
                    
                }));
                
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSisterConcernDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Check if files are not null and the length is greater than 0
        const files = e.target.files;
        if (files && files.length > 0) {
            setSisterConcernDetails((prevDetails) => ({
                ...prevDetails,
                logo: files[0],
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!sisterConcernDetails.name || !sisterConcernDetails.logo || !sisterConcernDetails.password || !sisterConcernDetails.email || !sisterConcernDetails.phone || !sisterConcernDetails.companyId) {
            toast.error('Please fill in all the required fields!');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', sisterConcernDetails.name);
            formData.append('logo', sisterConcernDetails.logo);
            formData.append('password', sisterConcernDetails.password);
            formData.append('email', sisterConcernDetails.email);
            formData.append('phone', sisterConcernDetails.phone);
            formData.append('companyId', sisterConcernDetails.companyId || '');
            formData.append('companyEmail', sisterConcernDetails.companyEmail);


            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}sisterConcern/auth/sisterConcern/signup`,
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
            setReloadTable((prev) => !prev);

            setSisterConcernDetails({
                name: '',
                logo: null,
                password: '',
                email: '',
                phone: '',
                companyId: '',
                companyEmail: '',
            });

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to create company');
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) return null;

    return (
        <div>
            <div className="mx-auto max-w-6xl mt-8">
                <div className="bg-[#433878] p-8 rounded-xl">
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-white mb-2">Sister Concern Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={sisterConcernDetails.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter Sister Concern Name"
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
                                    value={sisterConcernDetails.password}
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
                                    value={sisterConcernDetails.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter Email"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2 "
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={sisterConcernDetails.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter Phone Number"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Adding Sister Concern...' : 'Add Sister Concern'}
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-12">
                <SisterConcernTable reload={reloadTable} />
            </div>
        </div>
    );
}
