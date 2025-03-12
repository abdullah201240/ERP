'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

interface Project {
    id: number;
    projectType: string;
    projectName: string;
    totalArea: string;
    projectAddress: string;
    clientName: string;
    clientAddress: string;
    clientContact: string;
    clientEmail: string;
    creatorName: string;
    creatorEmail: string;
    requirementDetails: string;
    supervisorName: string;
    startDate: string;
    endDate: string;
    projectDeadline: string;
    estimatedBudget: string;
    assigned: { eName: string; eid: string; id: string }[];
    createdAt: string;
    updatedAt: string;
    daysRemaining?: number;
    daysPassed?: number;
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

export default function ClientTable() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalProjects, setTotalProjects] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
    const [deleteId, setDeleteId] = useState<number | null>(null); // State to store the ID of the project to be deleted

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    // Memoize the fetchCompanyProfile to avoid recreating the function unnecessarily
    const fetchCompanyProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessTokenCompany');
            if (!token) {
                router.push('/');
                return;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}sisterConcern/auth/sisterConcern/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            console.table(data.data)
            if (data.success) {
                setEmployeeDetails(data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, [router]);

    // Memoize the fetchProjects function to avoid unnecessary re-renders
    const fetchProjects = useCallback(async () => {
        const token = localStorage.getItem('accessTokenCompany');

        try {
            if (!employeeDetails) return;
            const controller = new AbortController();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL_PROJECTMANAGEMENT}projects/view-all-projects/${employeeDetails.id}?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal, // Move this inside the options object
                }
            );


            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            console.log(data.data);

            if (data.success && Array.isArray(data.data.projects)) {
                const updatedProjects = data.data.projects.map((project: Project) => {
                    const startDate = new Date(project.startDate);
                    const endDate = new Date(project.endDate);
                    const currentDate = new Date();

                    const remainingTime = endDate.getTime() - currentDate.getTime();
                    const daysRemaining = Math.max(0, Math.floor(remainingTime / (1000 * 60 * 60 * 24)));

                    const passedTime = currentDate.getTime() - startDate.getTime();
                    const daysPassed = Math.max(0, Math.floor(passedTime / (1000 * 60 * 60 * 24)));

                    return {
                        ...project,
                        daysRemaining,
                        daysPassed,
                    };
                });
                setProjects(updatedProjects);
                setTotalProjects(data.data.totalProjects);
            } else {
                throw new Error('Fetched data is not in expected format');
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [ currentPage, searchQuery, employeeDetails]);

    // Trigger fetch functions when necessary
    useEffect(() => {
        const token = localStorage.getItem('accessTokenCompany');

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            fetchCompanyProfile();
        }
    }, [router, fetchCompanyProfile]);

    useEffect(() => {
        if (employeeDetails) {
            fetchProjects();
        }
    }, [employeeDetails, currentPage, searchQuery, fetchProjects]);

    const totalPages = useMemo(() => Math.ceil(totalProjects / itemsPerPage), [totalProjects]);

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
        if (!deleteId) return;
        const token = localStorage.getItem('accessTokenCompany');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROJECTMANAGEMENT}projects/delete-project/${deleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            const data = await response.json();
            if (data.success) {
                // Remove the deleted project from the state
                setProjects(projects.filter(project => project.id !== deleteId));
                setTotalProjects(totalProjects - 1);
                setDeleteId(null); // Reset deleteId
            } else {
                throw new Error('Failed to delete project');
            }
        } catch (err) {
            setError((err as Error).message);
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
                        <TableHead className='text-white text-center'>Client Name</TableHead>
                        <TableHead className='text-white text-center'>Address</TableHead>
                        <TableHead className='text-white text-center'>Contact</TableHead>
                        <TableHead className='text-white text-center'>Email</TableHead>
                        <TableHead className='text-white text-center'>Project Name</TableHead>
                        <TableHead className='text-white text-center'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">No projects found</TableCell>
                        </TableRow>
                    ) : (
                        projects.map((project, index) => (
                            <TableRow key={project.id} className='text-center'>
                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.clientName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.clientAddress}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.clientContact}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.clientEmail}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.projectName}</TableCell>
                                <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <RiDeleteBin6Line
                                                className='opacity-50 cursor-pointer'
                                                onClick={() => setDeleteId(project.id)}
                                            />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Project Deletion</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this Project? This action cannot be undone, and the project will be permanently removed from the system.
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