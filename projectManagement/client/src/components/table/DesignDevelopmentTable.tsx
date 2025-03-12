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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

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
    design?: { stepName: string; stepType: string; startDate: string; endDate: string; completed: string; id: string; }[];
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
interface DesignStep {
    completed: string; // Assuming 'completed' is a string that represents a percentage
}
interface Access {
    id: number;
    employee_id: number;
    permission_id: number;
    createdAt: string;
    updatedAt: string;
}

export default function DesignDevelopmentTable() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalProjects, setTotalProjects] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

    const [accessData, setAccessData] = useState<Access[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    // Memoize the fetchCompanyProfile to avoid recreating the function unnecessarily
    const fetchCompanyProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) {
                router.push('/notFound');

                toast.error('No permission to login. First allocation permission !');

                return; // Exit the function early
            }

            if (data.success) {
                setEmployeeDetails(data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, [router]);

    // Memoize the fetchProjects function to avoid unnecessary re-renders
    const fetchProjects = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (!employeeDetails) return;
            const controller = new AbortController();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}projects/view-all-projects/${employeeDetails.sisterConcernId}?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`,
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
    }, [currentPage, searchQuery, employeeDetails]);
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
    // Trigger fetch functions when necessary
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            fetchCompanyProfile();

        }
    }, [router, fetchCompanyProfile]);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            fetchAccess();

        }
    }, [router, fetchAccess]);



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


    const okay = (design: { stepName: string; stepType: string; completed: string }[]): [string, string] => {
        if (!design || design.length === 0) return ['2D,3D,Rendering,Animation,Working', ''];

        // Get unique step types that are not fully completed
        const remainingTasks = [...new Set(
            design.filter(step => step.completed !== '100').map(step => step.stepType)
        )].join(', ');

        // If all tasks are complete, return appropriate message
        return remainingTasks ? ['', remainingTasks] : ['All Stages Complete', ''];
    };




    const getCurrentStage = (design: { stepName: string; stepType: string; completed: string }[]): string => {
        if (!design || design.length === 0) return 'N/A';

        // Check if all 2D tasks are 100% complete
        const all2DComplete = design
            .filter(step => step.stepType === '2D')
            .every(step => step.completed === '100');

        if (!all2DComplete) {
            return '2D Layout in Progress';
        }

        // Check if all 3D tasks are 100% complete
        const all3DComplete = design
            .filter(step => step.stepType === '3D')
            .every(step => step.completed === '100');

        if (!all3DComplete) {
            return '3D Design  in Progress';
        }
        // Check if all 3D tasks are 100% complete
        const allRenderingComplete = design
            .filter(step => step.stepType === 'Rendering')
            .every(step => step.completed === '100');

        if (!allRenderingComplete) {
            return 'Rendering  in Progress';
        }
        // Check if all 3D tasks are 100% complete
        const allAnimationComplete = design
            .filter(step => step.stepType === 'Animation')
            .every(step => step.completed === '100');

        if (!allAnimationComplete) {
            return 'Animation  in Progress';
        }


        // Check if all Working tasks are 100% complete
        const allWorkinggComplete = design
            .filter(step => step.stepType === 'Working')
            .every(step => step.completed === '100');

        if (!allWorkinggComplete) {
            return 'Working Drawing   in Progress';
        }



        // If both 2D and 3D are complete, check for other tasks
        const otherTasks = design.filter(step => step.stepType !== '2D' && step.stepType !== '3D' && step.stepType !== 'Animation' && step.stepType !== 'Rendering' && step.stepType !== 'Working');
        if (otherTasks.length > 0) {
            const allOtherComplete = otherTasks.every(step => step.completed === '100');
            if (!allOtherComplete) {
                return 'Other Work in Progress';
            }
        }

        return 'All Stages Complete';
    };

    const calculateCompletionPercentage = (design: DesignStep[]): string => {
        if (!design || design.length === 0) return '0%';

        const totalCompletion = design.reduce((acc, step) => acc + parseFloat(step.completed), 0);
        const averageCompletion = totalCompletion / design.length;

        return `${averageCompletion.toFixed(2)}%`; // Returns the percentage as a string with two decimal places
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
                        <TableHead className='text-white text-center'>Assigned To</TableHead>
                        <TableHead className='text-white text-center'>Supervisor Name</TableHead>
                        <TableHead className='text-white text-center'>Current Stage</TableHead>
                        <TableHead className='text-white text-center'>Start Date</TableHead>
                        <TableHead className='text-white text-center'>Project Timeline</TableHead>
                        <TableHead className='text-white text-center'>Days Passed</TableHead>
                        <TableHead className='text-white text-center'>Days Remaining</TableHead>
                        <TableHead className='text-white text-center'>Remaining Tasks</TableHead>
                        <TableHead className='text-white text-center'>Completion (%)</TableHead>
                        {accessData.some(access => access.permission_id === 3) && (
                            <TableHead className="text-white text-center">View Details</TableHead>
                        )}

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={12} className="text-center">No projects found</TableCell>
                        </TableRow>
                    ) : (
                        projects.map((project, index) => (


                            <TableRow key={project.id} className='text-center'>
                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.projectName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.assigned && project.assigned.length > 0 ? project.assigned.map(a => a.eName).join(', ') : 'N/A'}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.supervisorName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>    {project.design ? getCurrentStage(project.design) : 'N/A'}
                                </TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.startDate}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.projectDeadline}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.daysPassed || 'N/A'}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.daysRemaining}</TableCell>


                                <TableCell className='border border-[#e5e7eb]'>{project.design ? okay(project.design) : 'N/A'}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.design ? calculateCompletionPercentage(project.design) : '0%'}</TableCell>


                                {accessData.some(access => access.permission_id === 3) && (
                                    <TableCell className='border border-[#e5e7eb]'>
                                        <Link href={`/projects/${project.id}`} >
                                            <p className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-300">View</p>
                                        </Link>
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
