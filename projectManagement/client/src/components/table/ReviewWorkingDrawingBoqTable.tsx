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
interface Drawing {
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

export default function ReviewWorkingDrawingBoqTable() {
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

    const router = useRouter();

    const fetchCompanyProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            console.table(data.data);
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
            if(!employeeDetails) return;
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/'); // Adjust the path to your login page
                return;
            }


            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawingSisterConcernId/${employeeDetails?.sisterConcernId}`, {
                headers: {
                    'Authorization': token,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch drawings");
            const data = await response.json();

                
            setDrawings(data.data || []);

        } catch (error) {
            console.error("Error fetching drawings:", error);
            setDrawings([]);
        }
    }, [router,employeeDetails]);
    useEffect(() => {
        fetchDrawings();
    }, [ fetchDrawings]);
  return (
    <div>
    <Table>
        <TableHeader className='bg-[#2A515B] text-white '>
            <TableRow className='text-center'>
                <TableHead className='text-white text-center'>SI. No.</TableHead>
                <TableHead className='text-white text-center'>Project Name</TableHead>
                <TableHead className='text-white text-center'>Project Address</TableHead>
                <TableHead className='text-white text-center'>Unit</TableHead>

                <TableHead className='text-white text-center'>Category</TableHead>

                <TableHead className='text-white text-center'>Item Name</TableHead>

                <TableHead className='text-white text-center'>Item Description</TableHead>

                <TableHead className='text-white text-center'>Brand Model</TableHead>

                <TableHead className='text-white text-center'>Item Quantity</TableHead>

                <TableHead className='text-white text-center'>Action</TableHead>

            </TableRow>
        </TableHeader>
        <TableBody>
            {drawings.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={11} className='text-center border border-[#e5e7eb]'>
                        No Drawings Found
                    </TableCell>
                </TableRow>
            ) : (
                drawings.map((drawing, index) => (
                    <TableRow key={drawing.id} className='text-center'>
                        <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                        <TableCell className='border border-[#e5e7eb]'>{drawing.projectName}</TableCell>
                        <TableCell className='border border-[#e5e7eb]'>{drawing.projectAddress}</TableCell>

                        <TableCell className='border border-[#e5e7eb]'>{drawing.unit}</TableCell>

                        <TableCell className='border border-[#e5e7eb]'>{drawing.category}</TableCell>

                        <TableCell className='border border-[#e5e7eb]'>{drawing.itemName}</TableCell>

                        <TableCell className='border border-[#e5e7eb]'>{drawing.itemDescription}</TableCell>

                        <TableCell className='border border-[#e5e7eb]'>{drawing.brandModel}</TableCell>

                        <TableCell className='border border-[#e5e7eb]'>{drawing.itemQuantity}</TableCell>
                        


                        
                    </TableRow>
                ))
            )}
        </TableBody>
    </Table>


</div>
  )
}
