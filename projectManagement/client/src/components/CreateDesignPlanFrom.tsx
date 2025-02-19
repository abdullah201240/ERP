'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import Select from 'react-select';
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import AnimationTable from './table/AnimationTable';
import Design3DTable from './table/Design3DTable';
import Layout2DTable from './table/Layout2DTable';
import WorkingDrawingTable from './table/WorkingDrawingTable';
import RenderingTable from './table/RenderingTable';
interface Project {
    id: number;
    projectName: string;
    projectAddress: string;
    clientName: string;
    clientAddress: string;
    clientContact: string;
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

export default function CreateDesignPlanFrom() {
    const [token, setToken] = useState<string | null>(null); // State to store token
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selected, setSelected] = useState('2D');
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [loading1, setLoading1] = useState(false);
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
    const [searchQuery1, setSearchQuery1] = useState('');
    const [page1, setPage1] = useState(1);
    const [totalPages1, setTotalPages1] = useState(1);

    // State variables for the modal form
    const [stepType, setStepType] = useState('');
    const [stepName, setStepName] = useState('');
    const [assignee, setAssignee] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [reloadTable, setReloadTable] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

    useEffect(() => {
        // Check if we are running on the client-side (to access localStorage)
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('accessToken');
            if (!storedToken) {
                router.push('/'); // Redirect if no token is found
            } else {
                setToken(storedToken); // Set the token to state
            }
        }
    }, [router]);

    const renderTable = (projectId: number | null) => {
        switch (selected) {
            case '2D': return <Layout2DTable projectId={projectId} reload={reloadTable} />;
            case '3D': return <Design3DTable projectId={projectId} reload={reloadTable} />;
            case 'Rendering': return <RenderingTable projectId={projectId} reload={reloadTable} />;
            case 'Animation': return <AnimationTable projectId={projectId} reload={reloadTable} />;
            case 'Working Drawing': return <WorkingDrawingTable projectId={projectId} reload={reloadTable} />;
            default: return null;
        }
    };


    const fetchCompanyProfile = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
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
    }, [token]);



    const fetchProjects = useCallback(
        async (pageNumber = 1, query = '') => {
            setLoading(true);
            try {
                if (!employeeDetails) return;
                const token = localStorage.getItem('accessToken');

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}projects/view-all-projects/${employeeDetails.sisterConcernId}?page=${pageNumber}&limit=10&search=${query}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();

                // If it's the first page, reset the projects; otherwise, append the new projects
                if (pageNumber === 1) {
                    setProjects(data.data.projects);
                } else {
                    setProjects((prevProjects) => [...prevProjects, ...data.data.projects]);
                }

                setTotalPages(data.data.totalPages);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        },
        [employeeDetails] // Adding token as a dependency
    );

    const fetchEmployee = useCallback(
        async (pageNumber = 1, query = '') => {
            setLoading1(true);
            try {
                if (!employeeDetails) return;

                const response = await fetch(
                 `${process.env.NEXT_PUBLIC_API_URL_ADMIN}sisterConcern/employee/${employeeDetails.sisterConcernId}?page=${pageNumber}&limit=10&search=${query}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();
                // If it's the first page, reset the projects; otherwise, append the new projects
                if (pageNumber === 1) {
                    setEmployees(data.data.employees);
                } else {
                    setEmployees((prev) => [...prev, ...data.data.employees]);
                }

                setTotalPages1(data.data.totalPages);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading1(false);
            }
        },
        [token,employeeDetails] // Adding token as a dependency
    );
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            fetchCompanyProfile();
        }
    }, [router, token, fetchCompanyProfile]);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/');
        } else {
            fetchProjects(1, searchQuery);
            fetchEmployee(1, searchQuery1)
        }
    }, [token, searchQuery, router, searchQuery1, fetchProjects, fetchEmployee]);

    const handleInputChange = (inputValue: string) => {
        setSearchQuery(inputValue);
        setPage(1);
    };
    const handleInputChange1 = (inputValue: string) => {
        setSearchQuery1(inputValue);
        setPage1(1);
    };

    const handleMenuScrollToBottom1 = () => {
        if (page1 < totalPages1) {
            const nextPage = page + 1;
            setPage1(nextPage);
            fetchEmployee(nextPage, searchQuery1);
        }
    };


    const handleMenuScrollToBottom = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProjects(nextPage, searchQuery);
        }
    };

    const handleProjectChange = (newValue: { value: number; label: string } | null) => {
        setSelectedProject(newValue ? newValue.value : null);

    };

    const handleEmployeeChange = (newValue: { value: string; label: string } | null) => {
        if (newValue) {
            const selected = employees.find((employee) => employee.id === newValue.value);
            if (selected) {
                // Handle the selected employee data
                setAssignee(selected.id); // Store the selected employee's ID

            }
        }
    };




    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/');
        } else {
            fetchProjects(1, searchQuery);
            fetchEmployee(1, searchQuery1)
        }
    }, [token, searchQuery, searchQuery1, router, fetchProjects, fetchEmployee,]);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the default form submission
        const stepData = {
            projectId: selectedProject,
            stepType,
            stepName,
            assignee,
            startDate,
            endDate,
            remarks,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/designPlan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include the token for authorization
                },
                body: JSON.stringify(stepData), // Convert the data to JSON
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            const result = await response.json();
            toast.success('Design plan added successfully!'); // Show success message
            console.log(result); // Optionally log the result

            // Optionally, you can reset the form fields after submission
            setStepType('');
            setStepName('');
            setAssignee(null);
            setStartDate('');
            setEndDate('');
            setRemarks('');
            setIsModalOpen(false); // Close the modal after submission
            // Trigger table reload
            setReloadTable((prev) => !prev);
        } catch (error) {
            console.error('Error submitting data:', error);
            toast.error('Failed to add design plan'); // Show error message
        }
    };


    return (
        <div className='mt-8'>


            <div className="container max-w-8xl">
                <div className='bg-[#433878] p-8 rounded-xl'>
                    <div>
                        <label className="text-white mb-2">Select Project</label>
                        <Select
                            options={projects.map((project) => ({
                                value: project.id,
                                label: project.projectName,
                            }))}
                            onInputChange={handleInputChange}
                            onMenuScrollToBottom={handleMenuScrollToBottom}
                            onChange={handleProjectChange}
                            isClearable
                            className="mt-2"
                            placeholder="Search and select a project"
                            isLoading={loading}
                        />
                    </div>







                </div>



            </div>
            {selectedProject && (

                <div className='mt-12'>
                    <Button
                        className={`mr-4 mt-8 ${selected === '2D' ? 'bg-[#2A5158] hover:bg-[#2A5158] hover:text-white' : 'bg-white text-black hover:bg-[#2A5158] hover:text-white'}`}
                        onClick={() => setSelected('2D')}
                    >
                        2D Layout
                    </Button>
                    <Button
                        className={`mr-4 mt-8 ${selected === '3D' ? 'bg-[#2A5158] hover:bg-[#2A5158] hover:text-white' : 'bg-white text-black hover:bg-[#2A5158] hover:text-white'}`}
                        onClick={() => setSelected('3D')}
                    >
                        3D Design
                    </Button>
                    <Button
                        className={`mr-4 mt-8 ${selected === 'Rendering' ? 'bg-[#2A5158] hover:bg-[#2A5158] hover:text-white' : 'bg-white text-black hover:bg-[#2A5158] hover:text-white'}`}
                        onClick={() => setSelected('Rendering')}
                    >
                        Rendering
                    </Button>
                    <Button
                        className={`mr-4 mt-8 ${selected === 'Animation' ? 'bg-[#2A5158] hover:bg-[#2A5158] hover:text-white' : 'bg-white text-black hover:bg-[#2A5158] hover:text-white'}`}
                        onClick={() => setSelected('Animation')}
                    >
                        Animation
                    </Button>
                    <Button
                        className={`mr-4 mt-8 ${selected === 'Working Drawing' ? 'bg-[#2A5158] hover:bg-[#2A5158] hover:text-white' : 'bg-white text-black hover:bg-[#2A5158] hover:text-white'}`}
                        onClick={() => setSelected('Working Drawing')}
                    >
                        Working Drawing
                    </Button>

                    <div className='mt-8'>
                        {renderTable(selectedProject)}
                    </div>


                    <div className='text-right mt-8'>



                        <Button
                            data-modal-target="default-modal" data-modal-toggle="default-modal"
                            className='bg-[#F99641] text-black hover:bg-[#2A5158] hover:text-white'
                            onClick={() => setIsModalOpen(true)} // Open modal on click


                        >
                            + Add steps
                        </Button>


                    </div>



                </div>
            )}
            {isModalOpen && (
                <div
                    id="default-modal"
                    tabIndex={isModalOpen ? 0 : -1}
                    aria-hidden={!isModalOpen}
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isModalOpen ? "block" : "hidden"}`}
                >
                    <div className="relative w-full max-w-lg p-4 mx-2 bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-16">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Steps</h3>
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

                        {/* Modal Content */}
                        <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
                            {/* Step Type and Step Name */}
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

                            {/* Assignee */}
                            <div>
                                <label htmlFor="assignee" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Assignee
                                </label>
                                <Select
                                    options={employees.map((employee) => ({
                                        value: employee.id,
                                        label: employee.name,
                                    }))}
                                    onInputChange={handleInputChange1}
                                    onMenuScrollToBottom={handleMenuScrollToBottom1}
                                    onChange={handleEmployeeChange}
                                    isClearable
                                    className="mt-2"
                                    placeholder="Search and select an employee"
                                    isLoading={loading1}
                                    required
                                />
                            </div>

                            {/* Start Date and End Date */}
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

                            {/* Remarks */}
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

                            {/* Buttons */}
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
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



        </div>
    )
}
