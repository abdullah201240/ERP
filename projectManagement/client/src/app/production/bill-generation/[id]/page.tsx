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

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Drawing {
    id: number;
    projectId: string;
    itemName: string;
    brandModel: string;
    category: string;
    clientName: string;
    clientContact: string;
    projectAddress: string;
    projectName: string;
    createdAt: string;
    status: string;
    handOverAccounts: number;
}

interface EmployeeDetails {
    id: number;
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    companyId: string;
    sisterConcernId: string;
    photo: string;
    employeeId: string;
}


export default function Page() {
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const [error, setError] = useState<string | null>(null);
    const [updateId, setUpdateId] = useState<number | null>(null);
    const fetchCompanyProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setEmployeeDetails(data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/');
        } else {
            fetchCompanyProfile();
        }
    }, [router, fetchCompanyProfile]);

    const fetchDrawings = useCallback(async () => {
        try {
            if (!employeeDetails) return;
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawingSisterConcernId/${employeeDetails.sisterConcernId}/${id}`, {
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to fetch drawings");
            const data = await response.json();
            // Filter only approved drawings
            const approvedDrawings = (data.data || []).filter((drawing: Drawing) => drawing.status === 'Approved');

            setDrawings(approvedDrawings);
        } catch (error) {
            console.error("Error fetching drawings:", error);
            setDrawings([]);
        }
    }, [router, employeeDetails, id]);

    useEffect(() => {
        fetchDrawings();
    }, [fetchDrawings]);
    const handleUpdate = async () => {
        if (updateId === null) return;
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/update-hand-over/${updateId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete project');
                }

            } catch (err) {
                setError((err as Error).message);
            }
        }
    };
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1 className='mt-4 mb-4'>All BOQ</h1>
            <Table>
                <TableHeader className='bg-[#2A515B] text-white'>
                    <TableRow className='text-center'>
                        <TableHead className='text-white text-center'>SI. No.</TableHead>
                        <TableHead className='text-white text-center'>Date</TableHead>
                        <TableHead className='text-white text-center'>Project Name</TableHead>
                        <TableHead className='text-white text-center'>Client Name</TableHead>
                        <TableHead className='text-white text-center'>Client Contact</TableHead>
                        <TableHead className='text-white text-center'>Item Name</TableHead>
                        <TableHead className='text-white text-center'>Hand Over Accounts</TableHead>


                        <TableHead className='text-white text-center'>Status</TableHead>
                        <TableHead className='text-white text-center'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {drawings.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className='text-center border border-[#e5e7eb]'>
                                No Drawings Found
                            </TableCell>
                        </TableRow>
                    ) : (
                        drawings.map((drawing, index) => (
                            <TableRow key={drawing.id} className='text-center'>
                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>
                                    {new Date(drawing.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{drawing.projectName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{drawing.clientName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{drawing.clientContact}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{drawing.itemName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>
                                    {drawing.handOverAccounts === 1 ? "Sent to Accounts" : "Not Sent Yet"}
                                </TableCell>


                                <TableCell className='border border-[#e5e7eb]'>
                                    {drawing.status}
                                </TableCell>
                                <TableCell className='border border-[#e5e7eb]  flex items-center justify-center'>
                                    <Link href={`/production/bill-generation/${id}/${drawing.id}`}>
                                        <p className="mr-8 bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">View Bill</p>
                                    </Link>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button onClick={() => setUpdateId(drawing.id)} className="mr-8 bg-gradient-to-r from-green-500 to-teal-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                                                Sent Bill
                                            </Button>


                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm hand over to accounts?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to hand over to accounts? This action cannot be undone, and the project will be permanently update from the system.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleUpdate}>Sent</AlertDialogAction>
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