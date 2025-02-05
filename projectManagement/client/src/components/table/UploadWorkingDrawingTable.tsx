
'use client'

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
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// Define Interface for Drawing
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
    images: Array<{ id: number; imageName: string }>;
}
interface UploadWorkingDrawingTableProps {
    reload: boolean;
    projectId: string;
}

const UploadWorkingDrawingTable: React.FC<UploadWorkingDrawingTableProps> = ({ reload  , projectId}) => {
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const router = useRouter();

    // Fetch categories from API


    // Fetch drawings from API
    const fetchDrawings = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/'); // Adjust the path to your login page
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawingAll/${projectId}`, {
                headers: {
                    'Authorization': token,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch drawings");

            const result = await response.json();

            if (result.success && result.data?.drawings && Array.isArray(result.data.drawings)) {
                setDrawings(result.data.drawings); // Set the drawings from the response
            } else {
                console.error("Expected an array of drawings, but got:", result);
                setDrawings([]);
            }
        } catch (error) {
            console.error("Error fetching drawings:", error);
            setDrawings([]);
        }
    }, [router,projectId]);
    useEffect(() => {
        fetchDrawings();
    }, [reload, fetchDrawings]);

    // Handle delete
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/'); // Adjust the path to your login page
                return; // Exit the function early
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawing/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,

                },
            });

            if (!response.ok) throw new Error("Failed to delete drawing");

            setDrawings(drawings.filter(cat => cat.id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error("Error deleting drawing:", error);
        }
    };




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

                        <TableHead className='text-white text-center'>Images</TableHead>
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
                                <TableCell className='border border-[#e5e7eb]'>
                                    <div className="flex flex-wrap">
                                        {drawing.images.map((image) => (
                                            <a
                                                key={image.id}
                                                href={`${process.env.NEXT_PUBLIC_API_URL}uploads/${image.imageName}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="m-1"
                                            >
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${image.imageName}`}
                                                    alt={`Drawing Image ${image.id}`}
                                                    width={50}
                                                    height={50}
                                                    className="object-cover"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </TableCell>


                                <TableCell className='border border-[#e5e7eb] flex items-center justify-center gap-4'>
                                    
                                    <Link href={`/edit-upload-working-drawing/${drawing.id}`}> 
                                    <FaEdit

                                        className='opacity-50 cursor-pointer text-xl'
                                    />
                                    </Link>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <RiDeleteBin6Line
                                                className='opacity-50 cursor-pointer text-xl'
                                                onClick={() => setDeleteId(drawing.id)}
                                            />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this drawing? This action cannot be undone.
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
export default UploadWorkingDrawingTable;
