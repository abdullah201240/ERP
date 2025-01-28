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

import { FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from 'next/link';

interface PreProjectSiteVisitPlan {
    id: number;
    projectId: string;
    assignee: string;
    stepName: string;
    stepType: string;
    startDate: string;
    endDate: string;
    remarks: string;
}

interface Design3DTableProps {
  projectId: number | null;
  reload: boolean;

}

const Design3DTable: React.FC<Design3DTableProps> = ({ projectId ,reload}) => {
  const router = useRouter();
    const [projects, setProjects] = useState<PreProjectSiteVisitPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null); // State to hold the project ID to delete
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const fetchProjects = useCallback(async () => {
        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        }
        else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/designPlan?projectId=${projectId}&stepType=3D`, {
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
    }, [token, router, projectId]);

    useEffect(() => {
      fetchProjects();
  }, [fetchProjects,reload]);

    const handleDelete = async () => {
        if (deleteId === null) return; // No project to delete

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}siteVisit/pre-site-visit-plan/${deleteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete project');
                }

                // Update the state to remove the deleted project
                setProjects(prevProjects => prevProjects.filter(project => project.id !== deleteId));
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
                        <TableHead className='text-white text-center'>Step Name</TableHead>
                        <TableHead className='text-white text-center'>Start Date</TableHead>
                        <TableHead className='text-white text-center'>End Date</TableHead>
                        <TableHead className='text-white text-center'>Assignee</TableHead>
                        <TableHead className='text-white text-center'>Remarks</TableHead>
                        <TableHead className='text-white text-center'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className='text-center border border-[#e5e7eb]'>
                                No Pre Project Site Visit Plan found
                            </TableCell>
                        </TableRow>
                    ) : (
                        projects.map((project, index) => (
                            <TableRow key={project.id} className='text-center'>
                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.stepName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.startDate}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.endDate}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.assignee}</TableCell> {/* Assignee (string) */}
                                <TableCell className='border border-[#e5e7eb]'>{project.remarks}</TableCell>
                                <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>
                                    <Link href={`/editPreProjectPlan/${project.id}`}>
                                        <FaEdit className='mr-8 opacity-50' />
                                    </Link>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <RiDeleteBin6Line
                                                className='opacity-50 cursor-pointer'
                                                onClick={() => setDeleteId(project.id)} // Set the project ID to delete
                                            />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Pre Project Site Visit Plan Deletion</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this Pre Project Site Visit Plan? This action cannot be undone, and the project will be permanently removed from the system.
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

export default Design3DTable;
