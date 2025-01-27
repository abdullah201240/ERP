'use client';
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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

export default function DesignDevelopmentTable() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalProjects, setTotalProjects] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            const fetchProjects = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/view-all-projects?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`, {
                        headers: {
                            'Authorization': token
                        }
                    });
                    
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
            };

            fetchProjects();
        }
    }, [router, token, currentPage, searchQuery]); // Add searchQuery to dependencies

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (projects.length === 0) {
        return <div>No projects found</div>;
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
                        <TableHead className='text-white text-center'>Assigned To</TableHead>
                        <TableHead className='text-white text-center'>Supervisor Name</TableHead>
                        <TableHead className='text-white text-center'>Current Stage</TableHead>
                        <TableHead className='text-white text-center'>Start Date</TableHead>
                        <TableHead className='text-white text-center'>Project Timeline</TableHead>
                        <TableHead className='text-white text-center'>Days Passed</TableHead>
                        <TableHead className='text-white text-center'>Days Remaining</TableHead>
                        <TableHead className='text-white text-center'>Current Work in Progress</TableHead>
                        <TableHead className='text-white text-center'>Remaining Tasks</TableHead>
                        <TableHead className='text-white text-center'>Completion (%)</TableHead>
                        <TableHead className='text-white text-center'>View Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project, index) => (
                        <TableRow key={project.id} className='text-center'>
                            <TableCell className='text-center border border-[#e5e7eb]'>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{project.projectName}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{project.assigned && project.assigned.length > 0 ? project.assigned.map(a => a.eName).join(', ') : 'N/A'}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{project.supervisorName}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{project.supervisorName}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{project.startDate}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{project.projectDeadline}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{project.daysPassed || 'N/A'}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{project.daysRemaining}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{project.supervisorName}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{project.supervisorName}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{project.supervisorName}%</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>
                                <Link href={`/projects/${project.id}`} >
                                    <p className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-300">View</p>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
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