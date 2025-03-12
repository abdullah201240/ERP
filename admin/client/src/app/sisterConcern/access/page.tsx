'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRouter } from 'next/navigation'; // Corrected import
import Image from 'next/image';
import Link from 'next/link';

// Define the type for SisterConcern
interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo: string | File; // Allow both string (URL) and File
    employeeId: string,
    dob: string,
    gender: string,
}


export default function Page() {
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sisterConcernId, setSisterConcernId] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessTokenCompany') : null;

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            if (typeof window !== 'undefined') {
                const storedToken = localStorage.getItem('accessTokenCompany');
                if (!storedToken) {
                    router.push('/');
                } else {
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}sisterConcern/auth/sisterConcern/profile`, {
                            headers: {
                                Authorization: `Bearer ${storedToken}`,
                            },
                        });
                        const data = await response.json();

                        if (data.success) {
                            setSisterConcernId(data.data.id);
                        }
                    } catch (error) {
                        console.error('Error fetching profile:', error);
                    }
                }
            }
        };
        fetchCompanyProfile();
    }, [router]);

    const fetchCompanies = useCallback(async () => {
        if (!token || !sisterConcernId) { // Check if companyId is not null or empty
            router.push('/');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}sisterConcern/employee/${sisterConcernId}?page=${currentPage}&limit=${pageSize}&search=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch companies');
            }

            const data = await response.json();
            setEmployees(data.data.employees);
            setTotalPages(Math.ceil(data.data.totalEmployees / pageSize));



        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [token, router, sisterConcernId, currentPage, pageSize,searchQuery]); // Include companyId in the dependency array

    useEffect(() => {
        if (sisterConcernId) { // Only run fetchCompanies if companyId is available
            fetchCompanies();
        }
    }, [fetchCompanies, sisterConcernId]); // Include companyId in the dependency array

  

  


   
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='mt-12 bg-white'>
            <h1 className='text-center text-xl pt-4'>All Employee</h1>


             <input
                type="text"
                placeholder="Search Employee..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border p-2 mb-4 ml-4"
            />
            <Table>
                <TableHeader className='bg-[#2A515B] text-white'>
                    <TableRow className='text-center'>
                        <TableHead className='text-white text-center'>SI. No.</TableHead>
                        <TableHead className='text-white text-center'>Name</TableHead>
                        <TableHead className='text-white text-center'>Email</TableHead>
                        <TableHead className='text-white text-center'>Photo</TableHead>
                        <TableHead className='text-white text-center'>Phone</TableHead>
                        <TableHead className='text-white text-center'>Employee Id</TableHead>

                        <TableHead className='text-white text-center'>Dob</TableHead>
                        <TableHead className='text-white text-center'>Gender</TableHead>



                        <TableHead className='text-white text-center'>View Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className='text-center border border-[#e5e7eb]'>
                                No Employee found
                            </TableCell>
                        </TableRow>
                    ) : (
                        employees.map((employee, index) => (
                            <TableRow key={employee.id} className='text-center'>
                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{employee.name}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{employee.email}</TableCell>
                                <TableCell className='border border-[#e5e7eb] flex items-center justify-center'>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${employee.photo}`}
                                        width={50}
                                        height={50}
                                        alt={'logo'}
                                    />
                                </TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{employee.phone}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{employee.employeeId}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{employee.dob}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{employee.gender}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>
                                    <Link href={`/sisterConcern/access/${employee.id}`} >
                                        <p className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-300">View</p>
                                    </Link>
                                </TableCell>

                               
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
                <p className="mx-4 mt-2 text-lg font-semibold text-gray-700">
                    <span className='font-normal'> Page </span> {currentPage} <span className='font-normal'> of </span> {totalPages}
                </p>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-[#2A515B] text-white p-2 rounded-lg shadow hover:bg-[#2A515B] transition duration-200 ease-in-out disabled:opacity-50 flex items-center mr-4"
                >
                    <FaArrowLeft className="mr-2" />
                </button>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-[#2A515B] text-white p-2 rounded-lg shadow hover:bg-[#2A515B] transition duration-200 ease-in-out disabled:opacity-50 flex items-center"
                >
                    <FaArrowRight className="ml-2" />
                </button>
            </div>


        </div>
    );
}
