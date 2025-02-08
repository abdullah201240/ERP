'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import EmployeeTable from './table/EmployeeTable';  // Assuming this is the table for employees

interface EmployeeDetails {
    name: string;
    email: string;
    password: string;
    phone: string;
    companyId: string;
    gender: string;
    dob: string;
    employeeId: string;
}

export default function CreateEmployee() {
    const [token, setToken] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);

    const router = useRouter();

    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails>({
        name: '',
        email: '',
        password: '',
        phone: '',
        companyId: '',
        gender: '',
        dob: '',
        employeeId: '',
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
                `${process.env.NEXT_PUBLIC_API_URL}company/auth/profile`,  // Adjusted for company profile endpoint
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const data = await response.json();

            if (data.success) {
                setEmployeeDetails((prev) => ({
                    ...prev,
                    companyId: data.data.companyId,
                }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEmployeeDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!employeeDetails.name || !employeeDetails.password || !employeeDetails.email || !employeeDetails.phone || !employeeDetails.companyId || !employeeDetails.employeeId || !employeeDetails.gender || !employeeDetails.dob) {
            toast.error('Please fill in all the required fields!');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}company/auth/employee/signup`,  // Adjusted for employee signup endpoint
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',  // Assuming you are sending JSON data
                    },
                    body: JSON.stringify(employeeDetails),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to create employee');
            }

            toast.success('Employee created successfully!');
            setReloadTable((prev) => !prev);

            setEmployeeDetails({
                name: '',
                email: '',
                password: '',
                phone: '',
                companyId: '',
                gender: '',
                dob: '',
                employeeId: '',
            });

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to create employee');
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
                                <label className="text-white mb-2">Employee Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={employeeDetails.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter Employee Name"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={employeeDetails.employeeId}
                                    onChange={handleInputChange}
                                    placeholder="Enter Employee ID"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={employeeDetails.password}
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
                                    value={employeeDetails.email}
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
                                    value={employeeDetails.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter Phone Number"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Gender</label>
                                <select
                                    name="gender"
                                    value={employeeDetails.gender}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-white mb-2">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={employeeDetails.dob}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Adding Employee...' : 'Add Employee'}
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-12">
                <EmployeeTable reload={reloadTable} />  {/* Assuming EmployeeTable handles the employee list */}
            </div>
        </div>
    );
}
