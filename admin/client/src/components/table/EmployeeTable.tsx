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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { FaArrowLeft, FaArrowRight, FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation'; // Corrected import
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from 'next/image';

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

interface EmployeeTableProps {
    reload: boolean;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ reload }) => {
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editCompany, setEditCompany] = useState<Employee | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [sisterConcernId, setSisterConcernId] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sisterConcern/employee/${sisterConcernId}?page=${currentPage}&limit=${pageSize}`, {
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
    }, [token, router, sisterConcernId, currentPage, pageSize]); // Include companyId in the dependency array

    useEffect(() => {
        if (sisterConcernId) { // Only run fetchCompanies if companyId is available
            fetchCompanies();
        }
    }, [fetchCompanies, reload, sisterConcernId]); // Include companyId in the dependency array

    const handleDelete = async () => {
        if (deleteId === null || !token) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}sisterConcern/auth/sisterConcern/delete/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete company');
            }

            setEmployees(prevCompanies => prevCompanies.filter(company => company.id !== deleteId));
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleEdit = async () => {
        if (!editCompany || !token) return;

        const formData = new FormData();
        formData.append('name', editCompany.name);
        formData.append('phone', editCompany.phone);
        formData.append('dob', editCompany.dob);
        formData.append('employeeId', editCompany.employeeId);
        formData.append('gender', editCompany.gender);


        if (editCompany.photo) {
            formData.append('photo', editCompany.photo);
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sisterConcern/auth/sisterConcern/edit/${editCompany.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data' // This is not needed, as the browser will set it correctly with the boundary
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update company');
            }

            fetchCompanies();
            setIsDialogOpen(false);
        } catch (err) {
            setError((err as Error).message);
        }
    };


    const handleCancel = () => {
        setEditCompany(null);
        setIsDialogOpen(false);
    };
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='mt-12'>
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



                        <TableHead className='text-white text-center'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className='text-center border border-[#e5e7eb]'>
                                No companies found
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


                                <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <FaEdit className='mr-8 opacity-50 cursor-pointer' onClick={() => setEditCompany(employee)} />
                                        </DialogTrigger>
                                        <DialogContent className="p-6">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl font-semibold text-gray-800">Edit Employee</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700"> Name</label>
                                                    <input
                                                        type="text"
                                                        value={editCompany?.name || ''}
                                                        onChange={e => setEditCompany({ ...editCompany!, name: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                    <input
                                                        type="text"
                                                        value={editCompany?.phone || ''}
                                                        onChange={e => setEditCompany({ ...editCompany!, phone: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Employee ID
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editCompany?.employeeId || ''}
                                                        onChange={e => setEditCompany({ ...editCompany!, employeeId: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Dob</label>
                                                    <input
                                                        type="date"
                                                        value={editCompany?.dob || ''}
                                                        onChange={e => setEditCompany({ ...editCompany!, dob: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                                    <select id="gender" name="gender" value={editCompany?.gender || ''}
                                                        onChange={e => setEditCompany({ ...editCompany!, gender: e.target.value })}

                                                        className="block w-full rounded-md border-gray-300 p-2 bg-gray-100">
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>

                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Photo</label>
                                                    <input
                                                        type="file"
                                                        onChange={e => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                setEditCompany(prev => {
                                                                    if (!prev) return prev; // Prevent errors if prev is null

                                                                    return {
                                                                        ...prev, // Preserve existing properties
                                                                        photo: file
                                                                    };
                                                                });
                                                            }
                                                        }}
                                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter className="flex justify-end space-x-3 mt-6">
                                                <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">Save</button>
                                                <button onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition">Cancel</button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <RiDeleteBin6Line
                                                className='opacity-50 cursor-pointer'
                                                onClick={() => setDeleteId(employee.id)}
                                            />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Sister Concern  Deletion</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this Sister Concern? This action cannot be undone, and the Sister Concern will be permanently removed from the system.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
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

export default EmployeeTable;