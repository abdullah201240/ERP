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

import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
interface Feedback {
    id: number;
    feedback: string;
    drawingId: string;
    createdAt: string;
    workingDrawing: {
        id: number;
        projectId: string;
        itemName: string;
        brandModel: string;
        itemQuantity: string;
        itemDescription: string;
        unit: string;
        category: string;
        clientName: string;
        clientContact: string;
        projectAddress: string;
        projectName: string;
        sisterConcernId: number;
        status: string;
        createdAt: string;
        updatedAt: string;
    };
}


export default function ReviewWorkingDrawingBoqTable() {
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    const router = useRouter();

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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawingSisterConcernId/${employeeDetails.sisterConcernId}`, {
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to fetch drawings");
            const data = await response.json();
            setDrawings(data.data || []);
        } catch (error) {
            console.error("Error fetching drawings:", error);
            setDrawings([]);
        }
    }, [router, employeeDetails]);

    useEffect(() => {
        fetchDrawings();
    }, [fetchDrawings]);
    const fetchFeedbacks = useCallback(async () => {
        try {
            if (!employeeDetails) return;
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/feedback/${employeeDetails.sisterConcernId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }); 

            const data = await response.json();
            if (data.success) {
                setFeedbacks(data.data);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    }, [router,employeeDetails]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
            if (token) {
                fetchFeedbacks();
            }
       
    }, [fetchFeedbacks]);



    const updateStatus = async (id: number, newStatus: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/updateDrawingStatus/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            setDrawings(prevDrawings =>
                prevDrawings.map(drawing =>
                    drawing.id === id ? { ...drawing, status: newStatus } : drawing
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div>
            <Table>
                <TableHeader className='bg-[#2A515B] text-white'>
                    <TableRow className='text-center'>
                        <TableHead className='text-white text-center'>SI. No.</TableHead>
                        <TableHead className='text-white text-center'>Date</TableHead>
                        <TableHead className='text-white text-center'>Project Name</TableHead>
                        <TableHead className='text-white text-center'>Client Name</TableHead>
                        <TableHead className='text-white text-center'>Client Contact</TableHead>
                        <TableHead className='text-white text-center'>Item Name</TableHead>
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
                                    <select
                                        className='p-2 border rounded'
                                        value={drawing.status}
                                        onChange={(e) => updateStatus(drawing.id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </TableCell>
                                <TableCell className='border border-[#e5e7eb]'>
                                    <Link href={`/reviewBoq/${drawing.id}`}>
                                        <p className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">Review</p>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <div className='mt-28'>
                <h1 className='mb-8'>Update Request by Production Team</h1>
                <Table>
                    <TableHeader className='bg-[#2A515B] text-white'>
                        <TableRow className='text-center'>
                            <TableHead className='text-white text-center'>SI. No.</TableHead>
                            <TableHead className='text-white text-center'>Project Name</TableHead>
                            <TableHead className='text-white text-center'>Client Name</TableHead>
                            <TableHead className='text-white text-center'>Client Contact</TableHead>
                            <TableHead className='text-white text-center'>Feedback</TableHead>
                            <TableHead className='text-white text-center'>Item Name</TableHead>
                            <TableHead className='text-white text-center'>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feedbacks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className='text-center border border-[#e5e7eb]'>
                                    No Feedbacks Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            feedbacks.map((feedback, index) => (
                                <TableRow key={feedback.id} className='text-center'>
                                    <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]'>{feedback.workingDrawing.projectName}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]'>{feedback.workingDrawing.clientName}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]'>{feedback.workingDrawing.clientContact}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]'>{feedback.feedback}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]'>{feedback.workingDrawing.itemName}</TableCell>

                                    <TableCell className='border border-[#e5e7eb]'>{feedback.workingDrawing.status}</TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

            </div>

        </div>
    );
}