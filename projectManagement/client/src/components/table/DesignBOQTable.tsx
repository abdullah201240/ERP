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
import { MdOutlinePreview } from "react-icons/md";
import Link from 'next/link';

// Interface as provided by you
interface DegineBOQ {
    id: number;
    projectName: string;
    clientName: string;
    clientContact: string;
    projectAddress: string;
    totalArea: string;
    inputPerSftFees: string;
    totalFees: string;
    termsCondition: string;
    signName: string;
    designation: string
}

interface DesignBOQTableProps {
    reload: boolean;
}

const DesignBOQTable: React.FC<DesignBOQTableProps> = ({ reload }) => {
    const router = useRouter();
    const [projects, setProjects] = useState<DegineBOQ[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [user, setUser] = useState({ name: '', email: '', id: '', sisterConcernId: '' });

    const fetchCompanyProfile = useCallback(async () => {
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            console.table(data.data)
            if (data.success) {
                setUser({ name: data.data.name, email: data.data.email, id: data.data.id, sisterConcernId: data.data.sisterConcernId });

            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, []);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            fetchCompanyProfile();
        }
    }, [router, fetchCompanyProfile]);


    // Fetch projects
    const fetchProjects = useCallback(async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/');
        } else {
            if(!user.sisterConcernId){
                return
            }
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQ?sisterConcernId=${user.sisterConcernId}`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();

                if (data.success && Array.isArray(data.data)) {
                    setProjects(data.data);
                } else {
                    throw new Error('Fetched data is not in expected format');
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
    }, [router,user]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects, reload]);

    // Handle delete
    const handleDelete = async () => {
        if (deleteId === null) return;
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQ/${deleteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete project');
                }

                setProjects(prevProjects => prevProjects.filter(project => project.id !== deleteId));
            } catch (err) {
                setError((err as Error).message);
            }
        }
    };








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
                        <TableHead className='text-white text-center'>SI. No.</TableHead>
                        <TableHead className='text-white text-center'>Project Name</TableHead>
                        <TableHead className='text-white text-center'>Client Name</TableHead>
                        <TableHead className='text-white text-center'>Client Contact</TableHead>
                        <TableHead className='text-white text-center'>Input Per Sft Fees</TableHead>

                        <TableHead className='text-white text-center'>Total Area</TableHead>
                        <TableHead className='text-white text-center'>Total Fees</TableHead>
                        <TableHead className='text-white text-center'>Sign Name</TableHead>
                        <TableHead className='text-white text-center'>Designation</TableHead>


                        <TableHead className='text-white text-center'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className='text-center border border-[#e5e7eb]'>
                                No Boq found
                            </TableCell>
                        </TableRow>
                    ) : (
                        projects.map((project, index) => (
                            <TableRow key={project.id} className='text-center'>
                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.projectName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.clientName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.clientContact}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.inputPerSftFees}</TableCell>

                                <TableCell className='border border-[#e5e7eb]'>{project.totalArea}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.totalFees}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.signName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.designation}</TableCell>



                                <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>
                                    <Link href={`/viewDesignBOQ/${project.id}`} >


                                        <MdOutlinePreview

                                            className='mr-8 opacity-50 cursor-pointer'
                                        />
                                    </Link>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <RiDeleteBin6Line
                                                className='opacity-50 cursor-pointer'
                                                onClick={() => setDeleteId(project.id)}
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
                        ))
                    )}
                </TableBody>
            </Table>








        </div >
    );
};

export default DesignBOQTable;
