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

import { FaArrowLeft, FaArrowRight, FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from 'next/link';
interface PreProjectPlanTableProps {
    reload: boolean;
    projectId: number;
}

interface PreProjectSiteVisitPlan {
    id: number;
    projectName: string;
    projectId: string;
    ProjectAddress: string;
    clientName: string;
    clientNumber: string;
    visitDateTime: string;
    assigned: { eName: string; eid: string; id: string }[];
}
interface Access {
    id: number;
    employee_id: number;
    permission_id: number;
    createdAt: string;
    updatedAt: string;
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

const PreProjectPlanTable: React.FC<PreProjectPlanTableProps> = ({ reload, projectId }) => {
    const router = useRouter();
    const [projects, setProjects] = useState<PreProjectSiteVisitPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalProjects, setTotalProjects] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const [deleteId, setDeleteId] = useState<number | null>(null); // State to hold the project ID to delete
    const [accessData, setAccessData] = useState<Access[]>([]);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    const fetchCompanyProfile = useCallback(async () => {
        const storedToken = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                headers: { Authorization: `Bearer ${storedToken}` },
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
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            fetchCompanyProfile();
        }
    }, [router, token, fetchCompanyProfile]);
    const fetchProjects = useCallback(async () => {
        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        }
        else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}siteVisit/view-all-pre-project-site-visit-plan/${projectId}?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();

                if (data.success && Array.isArray(data.data.preProjectSiteVisitPlan)) {
                    setProjects(data.data.preProjectSiteVisitPlan);
                    setTotalProjects(data.data.totalPreSiteVisitPlan);
                } else {
                    throw new Error('Fetched data is not in expected format');
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
    }, [token, currentPage, itemsPerPage, searchQuery, router, projectId]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects, reload]); // Add searchQuery to dependencies
    const fetchAccess = useCallback(async () => {
        try {
            if (!employeeDetails) {
                return
            }
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL_ADMIN}access/view-all/${employeeDetails?.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await response.json(); // Extract JSON data
            setAccessData(data.data || []); // Store API response in state

        } catch (error) {
            console.error('Error fetching access:', error);
        }
    }, [router, employeeDetails]);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            fetchAccess();

        }
    }, [router, fetchAccess]);

    const totalPages = Math.ceil(totalProjects / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

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
                setTotalProjects(prevTotal => prevTotal - 1); // Decrease total projects count
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
            <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border p-2 mb-4"
            />
            <Table>
                <TableHeader className='bg-[#2A515B] text-white'>
                    <TableRow className='text-center'>
                        <TableHead className='text-white text-center'>SI. No.</TableHead>

                        <TableHead className='text-white text-center'>Project Name</TableHead>
                        <TableHead className='text-white text-center'>Project Address</TableHead>
                        <TableHead className='text-white text-center'>Assigned To</TableHead>
                        <TableHead className='text-white text-center'>Visit Date & Time</TableHead>
                        <TableHead className='text-white text-center'>Client Name</TableHead>
                        <TableHead className='text-white text-center'>Client Pnone</TableHead>
                        {accessData.some(access => access.permission_id === 6 || access.permission_id === 7) && (
                            <TableHead className='text-white text-center'>Action</TableHead>

                        )}
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
                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.projectName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.ProjectAddress}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>
                                    {project.assigned.map((assignee) => (
                                        <div key={assignee.id}>{assignee.eName}</div>
                                    ))}
                                </TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.visitDateTime}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.clientName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.clientNumber}</TableCell>
                                {accessData.some(access => access.permission_id === 6 || access.permission_id === 7) && (

                                <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>

                                    {accessData.some(access => access.permission_id === 6) && (
                                        <Link href={`/editPreProjectPlan/${project.id}`}>
                                            <FaEdit className='mr-8 opacity-50' />

                                        </Link>
                                    )}

                                    {accessData.some(access => access.permission_id === 7) && (
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
                                    )}









                                </TableCell>
                                 )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
                <p className="mx-4 mt-2 text-lg font-semibold text-gray-700"> <span className='font-normal'> Page </span> {currentPage} <span className='font-normal'> of </span> {totalPages}</p>
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="bg-[#2A515B] text-white p-2 rounded-lg shadow hover:bg-[#2A515B] transition duration-200 ease-in-out disabled:opacity-50 flex items-center mr-4"
                >
                    <FaArrowLeft className="mr-2" />
                </button>

                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-[#2A515B] text-white p-2 rounded-lg shadow hover:bg-[#2A515B] transition duration-200 ease-in-out disabled:opacity-50 flex items-center"
                >
                    <FaArrowRight className="ml-2" />
                </button>
            </div>


        </div>
    );
}
export default PreProjectPlanTable;













