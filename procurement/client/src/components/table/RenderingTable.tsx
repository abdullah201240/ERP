'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
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
import Select, { SingleValue } from 'react-select';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

// Define the types for Employee and Project
interface Employee {
    id: number
    name: string;
}
interface PreProjectSiteVisitPlan {
    id: number;
    projectId: string;
    assignee: string;
    stepName: string;
    stepType: string;
    startDate: string;
    endDate: string;
    remarks: string;
    project: [projectName: string];
    employee: Employee;
}
interface RenderingTableProps {
  projectId: number | null;
  reload: boolean;

}

const RenderingTable: React.FC<RenderingTableProps> = ({ projectId , reload}) => {
    const router = useRouter();
    const [projects, setProjects] = useState<PreProjectSiteVisitPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);

    // State variables for the modal form
    const [stepType, setStepType] = useState('');
    const [stepName, setStepName] = useState('');
    const [assignee, setAssignee] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null); // State to hold the selected project ID for editing

    const fetchProjects = useCallback(async () => {
        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/designPlan?projectId=${projectId}&stepType=Rendering`, {
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

    const fetchEmployee = useCallback(
        async (pageNumber = 1, query = '') => {
            setLoading1(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}employee/employee?page=${pageNumber}&limit=10&search=${query}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }

                const data = await response.json();
                if (pageNumber === 1) {
                    setEmployees(data.data.employees);
                } else {
                    setEmployees((prev) => [...prev, ...data.data.employees]);
                }

                setTotalPages(data.data.totalPages);
            } catch (error) {
                console.error('Error fetching employees:', error);
                toast.error('Failed to load employees');
            } finally {
                setLoading1(false);
            }
        },
        [token]
    );

    useEffect(() => {
        if (!token) {
            router.push('/');
        } else {
            fetchEmployee(1, searchQuery);
        }
    }, [token, searchQuery, router, fetchEmployee]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects, reload]);
  


    const handleDelete = async () => {
        if (deleteId === null) return;

        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/designPlan/${deleteId}`, {
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

    const handleInputChange1 = (inputValue: string) => {
        setSearchQuery(inputValue);
        setPage(1);
    };

    const handleMenuScrollToBottom1 = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchEmployee(nextPage, searchQuery);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleEmployeeChange = (newValue: SingleValue<{ value: string | null; label: string | undefined; }>) => {
        if (newValue) {
            setAssignee(newValue.value); // Assuming setAssignee expects a string
        } else {
            setAssignee(null); // Handle the case where no employee is selected
        }
    };

    

    const handleEdit = (project: PreProjectSiteVisitPlan) => {
        setSelectedProjectId(project.id);
        setStepType(project.stepType);
        setStepName(project.stepName);
        setAssignee(project.assignee);
        setStartDate(project.startDate);
        setEndDate(project.endDate);
        setRemarks(project.remarks);
        setIsModalOpen(true);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const stepData = {
            stepType,
            stepName,
            assignee,
            startDate,
            endDate,
            remarks,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/designPlan/${selectedProjectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(stepData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            const result = await response.json();
            toast.success('Rendering updated successfully!');
            console.log(result);

            // Reset form fields
            setStepType('');
            setStepName('');
            setAssignee(null);
            setStartDate('');
            setEndDate('');
            setRemarks('');
            setIsModalOpen(false);
            fetchProjects(); // Refresh the project list

        } catch (error) {
            console.error('Error submitting data:', error);
            toast.error('Failed to update design plan');
        }
    };

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
                                <TableCell className='border border-[#e5e7eb]'>{project.employee.name}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.remarks}</TableCell>
                                <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>
                                    <FaEdit
                                        onClick={() => handleEdit(project)} // Set the project data for editing
                                        className='mr-8 opacity-50 cursor-pointer'
                                    />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <RiDeleteBin6Line
                                                className='opacity-50 cursor-pointer'
                                                onClick={() => setDeleteId(project.id)}
                                            />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm 2D Design Deletion</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this 2D Design? This action cannot be undone, and the project will be permanently removed from the system.
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
            <div className='mt-4'>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={1} className='font-bold bg-[#433878] text-white'>
                            Total (Days):
                        </TableCell>
                        <TableCell className='font-bold bg-white'>
                            {projects.reduce((total, project) => {
                                const startDate = new Date(project.startDate);
                                const endDate = new Date(project.endDate);

                                let workingDays = 0;

                                // Iterate through each day in the date range
                                for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
                                    // If the day is not Friday (getDay() returns 5 for Friday)
                                    if (currentDate.getDay() !== 5) {
                                        console.log(currentDate.getDay())
                                        workingDays++;
                                    }
                                }

                                return total + workingDays;
                            }, 0)}{' '}
                            days
                        </TableCell>
                    </TableRow>
                    <TableRow className='mt-4'>
                        <TableCell colSpan={1} className='font-bold bg-[#433878] text-white'>
                            Delivery Date:
                        </TableCell>
                        <TableCell className='font-bold bg-white'>
                            {projects.length > 0
                                ? new Date(
                                    Math.max(...projects.map((project) => new Date(project.endDate).getTime()))
                                )
                                    .toISOString()
                                    .split('T')[0]
                                : 'N/A'}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </div>

            {isModalOpen && (
                <div
                    id="default-modal"
                    tabIndex={isModalOpen ? 0 : -1}
                    aria-hidden={!isModalOpen}
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isModalOpen ? "block" : "hidden"}`}
                >
                    <div className="relative w-full max-w-lg p-4 mx-2 bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-16">
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Steps</h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 rounded-lg hover:text-gray-900 hover:bg-gray-200 p-2 dark:hover:bg-gray-700 dark:hover:text-white"
                                aria-label="Close Modal"
                            >
                                <svg
                                    className="w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="step-type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Step Type
                                    </label>
                                    <select
                                        id="step-type"
                                        value={stepType}
                                        onChange={(e) => setStepType(e.target.value)}
                                        className="w-full p-2 text-sm bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Step Type</option>
                                        <option value="2D">2D Layout</option>
                                        <option value="3D">3D Design</option>
                                        <option value="Rendering">Rendering</option>
                                        <option value="Animation">Animation</option>
                                        <option value="Working">Working Drawing</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="step-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Step Name
                                    </label>
                                    <input
                                        type="text"
                                        id="step-name"
                                        value={stepName}
                                        onChange={(e) => setStepName(e.target.value)}
                                        placeholder="Enter the step name"
                                        className="w-full p-2 text-sm bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="assignee" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Assignee
                                </label>








                                <Select
                                    options={employees.map(employee => ({
                                        value: employee.id,
                                        label: employee.name,
                                    }))}
                                    onChange={handleEmployeeChange}
                                    onInputChange={handleInputChange1}
                                    onMenuScrollToBottom={handleMenuScrollToBottom1}
                                    isClearable
                                    className="mt-2"
                                    placeholder="Search and select an employee"
                                    isLoading={loading1}
                                    value={employees.find(employee => employee.id === assignee) ? { value: assignee, label: employees.find(employee => employee.id === assignee)?.name } : null}

                                />

                            </div>


                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="start-date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="start-date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full p-2 text-sm bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="end-date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="end-date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full p-2 text-sm bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="remarks" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Remarks
                                </label>
                                <textarea
                                    id="remarks"
                                    rows={3}
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Add any remarks..."
                                    className="w-full p-2 text-sm bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                                <Button
                                    onClick={() => setIsModalOpen(false)}
                                    data-modal-hide="default-modal"
                                    type="button"
                                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    Decline
                                </Button>
                                <button
                                    type="submit"
                                    className="text-white bg-[#433878] hover:bg-[#433878] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#433878] dark:hover:bg-[#433878] dark:focus:ring-[#433878]"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RenderingTable;