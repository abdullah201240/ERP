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
import { useRouter } from 'next/navigation';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFileInvoice } from "react-icons/fa";
import Link from 'next/link';

// Interface for DegineBOQ
interface DegineBOQ {
    id: number;
    boqId: string;
    boqName: string;
    clientContact: string;
    clientName: string;
    nowPayAmount: string;
    projectAddress: string;
    subject: string;
    totalFees: string;
    totalArea: string;
    date: string;
}

interface CreateDesignInvoiceTableProps {
    reload: boolean;
    boqId: number | null;
}

const CreateDesignInvoiceTable: React.FC<CreateDesignInvoiceTableProps> = ({ reload, boqId }) => {
    const router = useRouter();
    const [boqs, setBoqs] = useState<DegineBOQ[]>([]); // Changed to array
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchDegineBOQ = useCallback(async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineInvoice/${boqId}`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();
                setBoqs(data.data); // Set the array of BOQs
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
    }, [ router, boqId]);

    useEffect(() => {
        fetchDegineBOQ();
    }, [fetchDegineBOQ, reload]);

    // Handle delete
    const handleDelete = async () => {
        if (deleteId === null) return;
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/designBoqPart/${deleteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete project');
                }

                setBoqs(prevBoqs => prevBoqs.filter(boq => boq.id !== deleteId)); // Update the state
            } catch (err) {
                setError((err as Error).message);
            }
        }
    };

    // Calculate totals
    const totalPayAmount = boqs.reduce((total, boq) => total + parseFloat(boq.nowPayAmount), 0);

    // Loading and error handling
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
                        <TableHead className='text-white text-center'>Invoice </TableHead>

                        <TableHead className='text-white text-center'>SI. No.</TableHead>
                        <TableHead className='text-white text-center'>Boq Name</TableHead>
                        <TableHead className='text-white text-center'>Client Contact</TableHead>
                        <TableHead className='text-white text-center'>Client Name</TableHead>
                        <TableHead className='text-white text-center'>Project Address</TableHead>
                        <TableHead className='text-white text-center'>Subject</TableHead>
                        <TableHead className='text-white text-center'>Date</TableHead>
                        <TableHead className='text-white text-center'>Pay Amount</TableHead>

                        <TableHead className='text-white text-center'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {boqs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className='text-center border border-[#e5e7eb]'>
                                No Invoice found
                            </TableCell>
                        </TableRow>
                    ) : (
                        boqs.map((boq, index) => {
                            return (
                                <TableRow key={boq.id} className='text-center'>
                                    <TableCell className="border border-[#e5e7eb] text-3xl flex justify-center items-center">
                                        <Link  href={`/invoice/designInvoice/${boq.id}`}>
                                        <FaFileInvoice className="opacity-50 cursor-pointer" />
                                        </Link>
                                    </TableCell>

                                    <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]'>{boq.boqName}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]'>{boq.clientContact}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]'>{boq.clientName}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]'>{boq.projectAddress}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]'>{boq.subject}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]'>
                                        {new Date(boq.date).toLocaleDateString('en-CA')}
                                    </TableCell>

                                    <TableCell className='border border-[#e5e7eb]'>  {Number(boq.nowPayAmount)?.toLocaleString('en-IN')}</TableCell>



                                    <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <RiDeleteBin6Line
                                                    className='opacity-50 cursor-pointer'
                                                    onClick={() => setDeleteId(boq.id)}
                                                />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this BOQ? This action cannot be undone.
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

                            );

                        })
                    )}


                </TableBody>
            </Table>

            <div className="mt-16 text-left">
                <div className="flex justify-start">
                    <strong className="font-semibold">
                        Total Amount in Tk. {Number(boqs[0]?.totalFees)?.toLocaleString('en-IN')} Tk
                    </strong>
                </div>

                <div className="flex justify-start mt-2">
                    <p className='font-semibold'>
                        Total Pay Amount in Tk. {Number(totalPayAmount)?.toLocaleString('en-IN')} Tk
                    </p>
                </div>

                <div className="flex justify-start mt-2">
                    <p className='font-semibold'>
                        Total Due Amount in Tk. {Number(Number(boqs[0]?.totalFees) - Number(totalPayAmount))?.toLocaleString('en-IN')} Tk
                    </p>
                </div>
            </div>















        </div>
    );
};

export default CreateDesignInvoiceTable;