
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
} from "@/components/ui/alert-dialog"

import { useRouter } from 'next/navigation';
import { RiDeleteBin6Line } from "react-icons/ri";
interface MaterialsTableProps {
    reload: boolean;
    projectId: number;
}

interface MaterialsTable {
    id: number;
    ourProductCode: string;
    productName: string;
    product_category: string;
    itemNeed: string;
    itemQuantity: string;
    unit: string;
}

const MaterialsTable: React.FC<MaterialsTableProps> = ({ reload ,projectId }) => {
    const router = useRouter();
    const [materials, setMaterials] = useState<MaterialsTable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null); // State to hold the project ID to delete

    // Pagination state


    const fetchProjects = useCallback(async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        }
        else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/material/${projectId}`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();

                
                setMaterials(data.data || []);
                
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
    }, [  router,projectId]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects, reload]); // Add searchQuery to dependencies


   

   

    const handleDelete = async () => {
        if (deleteId === null) return; // No project to delete
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/material/${deleteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete project');
                }

                // Update the state to remove the deleted project
                setMaterials(prevProjects => prevProjects.filter(project => project.id !== deleteId));
            } catch (err) {
                setError((err as Error).message);
            }
        }
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

                        <TableHead className='text-white text-center'>Project Code</TableHead>
                        <TableHead className='text-white text-center'>Project Name</TableHead>
                        <TableHead className='text-white text-center'>Project Category</TableHead>
                        <TableHead className='text-white text-center'>Quantity</TableHead>
                        <TableHead className='text-white text-center'>Total Quantity</TableHead>
                        <TableHead className='text-white text-center'>Unit</TableHead>
                        <TableHead className='text-white text-center'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {materials.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className='text-center border border-[#e5e7eb]'>
                                No  Product found
                            </TableCell>
                        </TableRow>
                    ) : (
                        materials.map((material, index) => (
                            <TableRow key={material.id} className='text-center'>
                                <TableCell className='text-center border border-[#e5e7eb]'>{index+1}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{material.ourProductCode}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{material.productName}</TableCell>
                               
                                <TableCell className='border border-[#e5e7eb]'>{material.product_category}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{material.itemNeed}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{Number(material.itemNeed) * Number(material.itemQuantity)}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{material.unit}</TableCell>

                                <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>
                               
                                    
                                    
                                   

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <RiDeleteBin6Line
                                                className='opacity-50 cursor-pointer'
                                                onClick={() => setDeleteId(material.id)} // Set the project ID to delete
                                            />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm  Product Deletion</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this  Product? This action cannot be undone, and the Product will be permanently removed from the system.
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
export default MaterialsTable;













