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
import { useRouter } from 'next/router';
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from 'next/image';

interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo: string | File;
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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sisterConcernId, setSisterConcernId] = useState<string>('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessTokenCompany') : null;

    useEffect(() => {
        const fetchProfile = async () => {
            // Fetch profile logic here...
        };
        fetchProfile();
    }, [router]);

    const fetchEmployees = useCallback(async () => {
        if (!token || !sisterConcernId) {
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
                throw new Error('Failed to fetch employees');
            }

            const data = await response.json();
            setEmployees(data.data.employees);
            setTotalPages(Math.ceil(data.data.totalEmployees / pageSize));
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [token, router, sisterConcernId, currentPage, pageSize]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees, reload]);

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
                <TableHead>
                    <TableRow>
                        <TableHeader>Photo</TableHeader>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Email</TableHeader>
                        <TableHeader>Phone</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={employee.id}>
                            <TableCell>
                                <Image src={employee.photo} alt={employee.name} width={50} height={50} />
                            </TableCell>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.phone}</TableCell>
                            <TableCell>
                                <FaEdit onClick={() => router.push(`/edit/${employee.id}`)} />
                                <RiDeleteBin6Line onClick={() => console.log('Delete', employee.id)} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
}

export default EmployeeTable;
