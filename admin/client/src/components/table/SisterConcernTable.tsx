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
import { FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation'; // Corrected import
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from 'next/image';

// Define the type for SisterConcern
interface SisterConcern {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    logo: string;
}

interface SisterConcernTableProps {
    reload: boolean;
}

const SisterConcernTable: React.FC<SisterConcernTableProps> = ({ reload }) => {
    const router = useRouter();
    const [companies, setCompanies] = useState<SisterConcern[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editCompany, setEditCompany] = useState<SisterConcern | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [companyId, setCompanyId] = useState<string>('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessTokenCompany') : null;

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            if (typeof window !== 'undefined') {
                const storedToken = localStorage.getItem('accessTokenCompany');
                if (!storedToken) {
                    router.push('/');
                } else {
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/auth/company/profile`, {
                            headers: {
                                Authorization: `Bearer ${storedToken}`,
                            },
                        });
                        const data = await response.json();

                        if (data.success) {
                            setCompanyId(data.data.id);
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
    if (!token || !companyId) { // Check if companyId is not null or empty
        router.push('/');
        return;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sisterConcern/sisterConcern/${companyId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch companies');
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
            setCompanies(data.data);
        } else {
            throw new Error('Fetched data is not in expected format');
        }
    } catch (err) {
        setError((err as Error).message);
    } finally {
        setLoading(false);
    }
}, [token, router, companyId]); // Include companyId in the dependency array

useEffect(() => {
    if (companyId) { // Only run fetchCompanies if companyId is available
        fetchCompanies();
    }
}, [fetchCompanies, reload, companyId]); // Include companyId in the dependency array

    const handleDelete = async () => {
        if (deleteId === null || !token) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/auth/company/delete/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete company');
            }

            setCompanies(prevCompanies => prevCompanies.filter(company => company.id !== deleteId));
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleEdit = async () => {
        if (!editCompany || !token) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/auth/company/edit/${editCompany.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editCompany)
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Table>
                <TableHeader className='bg-[#2A515B] text-white'>
                    <TableRow className='text-center'>
                        <TableHead className='text-white text-center'>SI. No.</TableHead>
                        <TableHead className='text-white text-center'>Name</TableHead>
                        <TableHead className='text-white text-center'>Email</TableHead>
                        <TableHead className='text-white text-center'>Logo</TableHead>
                        <TableHead className='text-white text-center'>Phone</TableHead>
                        <TableHead className='text-white text-center'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companies.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className='text-center border border-[#e5e7eb]'>
                                No companies found
                            </TableCell>
                        </TableRow>
                    ) : (
                        companies.map((company, index) => (
                            <TableRow key={company.id} className='text-center'>
                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{company.name}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{company.email}</TableCell>
                                <TableCell className='border border-[#e5e7eb] flex items-center justify-center'>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${company.logo}`}
                                        width={50}
                                        height={50}
                                        alt={'logo'}
                                    />
                                </TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{company.phone}</TableCell>
                                <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <FaEdit className='mr-8 opacity-50 cursor-pointer' onClick={() => setEditCompany(company)} />
                                        </DialogTrigger>
                                        <DialogContent className="p-6">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl font-semibold text-gray-800">Edit Company</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                                    <input
                                                        type="text"
                                                        value={editCompany?.name || ''}
                                                        onChange={e => setEditCompany({ ...editCompany!, name: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                                    <input
                                                        type="email"
                                                        value={editCompany?.email || ''}
                                                        onChange={e => setEditCompany({ ...editCompany!, email: e.target.value })}
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
                                                onClick={() => setDeleteId(company.id)}
                                            />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Company Deletion</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this company? This action cannot be undone, and the company will be permanently removed from the system.
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
        </div>
    );
}

export default SisterConcernTable;