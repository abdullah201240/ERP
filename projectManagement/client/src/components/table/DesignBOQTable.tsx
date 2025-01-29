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
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import ReactEditor from 'react-text-editor-kit';

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
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // Modal form states for editing
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientContact, setClientContact] = useState('');
    const [projectAddress, setProjectAddress] = useState('');
    const [totalArea, setTotalArea] = useState('');
    const [inputPerSftFees, setInputPerSftFees] = useState('');
    const [totalFees, setTotalFees] = useState('');
    const [termsCondition, setTermsCondition] = useState('');
    const [signName, setSignName] = useState('');
    const [designation, setDesignation] = useState('');


    // Fetch projects
    const fetchProjects = useCallback(async () => {
        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQ`, {
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
    }, [token, router]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects, reload]);

    // Handle delete
    const handleDelete = async () => {
        if (deleteId === null) return;

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

    // Edit button to open the modal with selected project data
    const handleEdit = (project: DegineBOQ) => {
        setSelectedProjectId(project.id);
        setProjectName(project.projectName);
        setClientName(project.clientName);
        setClientContact(project.clientContact);
        setProjectAddress(project.projectAddress);
        setTotalArea(project.totalArea);
        setInputPerSftFees(project.inputPerSftFees);
        setTotalFees(project.totalFees);
        setTermsCondition(project.termsCondition);
        setSignName(project.signName);
        setDesignation(project.designation)
        setIsModalOpen(true);
    };

    // Handle form submit for updating project
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const updatedProject = {
            projectName,
            clientName,
            clientContact,
            projectAddress,
            totalArea,
            inputPerSftFees,
            totalFees,
            termsCondition,
            signName,
            designation
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQ/${selectedProjectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProject),
            });

            if (!response.ok) {
                throw new Error('Failed to update project');
            }

            toast.success('Project updated successfully!');
            fetchProjects(); // Refresh the project list after update
            setIsModalOpen(false); // Close the modal

        } catch (error) {
            console.error('Error updating project:', error);
            toast.error('Failed to update project');
        }
    };
    // Correcting the arithmetic operations by parsing strings to numbers
    const handleTotalFeesCalculation = (area: string, perSftFees: string) => {
        const areaNumber = parseFloat(area);
        const perSftFeesNumber = parseFloat(perSftFees);
        return areaNumber * perSftFeesNumber;
    };

    // Update the input handlers to use the correct calculation function
    const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newArea = e.target.value;
        setTotalArea(newArea);
        setTotalFees(handleTotalFeesCalculation(newArea, inputPerSftFees).toString());
    };

    const handlePerSftFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPerSftFees = e.target.value;
        setInputPerSftFees(newPerSftFees);
        setTotalFees(handleTotalFeesCalculation(totalArea, newPerSftFees).toString());
    };

    // Correcting the ReactEditor component usage
    const handleTermsConditionChange = (value: string) => {
        setTermsCondition(value);
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
                            <TableCell colSpan={7} className='text-center border border-[#e5e7eb]'>
                                No projects found
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
                                    <FaEdit
                                        onClick={() => handleEdit(project)}
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


            {isModalOpen && (
    <div
        id="default-modal"
        tabIndex={isModalOpen ? 0 : -1}
        aria-hidden={!isModalOpen}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isModalOpen ? "block" : "hidden"}`}
    >
        <div className="relative w-full max-w-3xl p-4 mx-2 bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-16 max-h-[90vh] overflow-y-auto sm:max-h-[80vh]">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Edit Project</h3>
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-400"
                >
                    X
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="space-y-3">

                    {/* Display 3 fields per row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex-1">
                            <label htmlFor="project-name" className="block text-xs font-medium text-gray-900">Project Name</label>
                            <input
                                type="text"
                                id="project-name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full p-2 border rounded"
                                disabled
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="client-name" className="block text-xs font-medium text-gray-900">Client Name</label>
                            <input
                                type="text"
                                id="client-name"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full p-2 border rounded"
                                disabled
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="client-contact" className="block text-xs font-medium text-gray-900">Client Contact</label>
                            <input
                                type="text"
                                id="client-contact"
                                value={clientContact}
                                onChange={(e) => setClientContact(e.target.value)}
                                className="w-full p-2 border rounded"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex-1">
                            <label htmlFor="sign-name" className="block text-xs font-medium text-gray-900">Sign Name</label>
                            <input
                                type="text"
                                id="sign-name"
                                value={signName}
                                onChange={(e) => setSignName(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="designation" className="block text-xs font-medium text-gray-900">Designation</label>
                            <input
                                type="text"
                                id="designation"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="project-address" className="block text-xs font-medium text-gray-900">Project Address</label>
                            <input
                                type="text"
                                id="project-address"
                                value={projectAddress}
                                onChange={(e) => setProjectAddress(e.target.value)}
                                className="w-full p-2 border rounded"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex-1">
                            <label htmlFor="total-area" className="block text-xs font-medium text-gray-900">Total Area</label>
                            <input
                                type="text"
                                id="total-area"
                                value={totalArea}
                                onChange={handleAreaChange}
                                className="w-full p-2 border rounded"
                                disabled
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="input-per-sft-fees" className="block text-xs font-medium text-gray-900">Input per Sqft Fees</label>
                            <input
                                type="text"
                                id="input-per-sft-fees"
                                value={inputPerSftFees}
                                onChange={handlePerSftFeesChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="total-fees" className="block text-xs font-medium text-gray-900">Total Fees</label>
                            <input
                                type="text"
                                id="total-fees"
                                value={totalFees}
                                readOnly
                                className="w-full p-2 border rounded"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <label htmlFor="terms-condition" className="block text-xs font-medium text-gray-900">Terms & Condition</label>
                        <ReactEditor
                            value={termsCondition}
                            onChange={handleTermsConditionChange}
                            mainProps={{ className: "black" }}
                            placeholder="Terms & Condition"
                            className="w-full"
                        />
                    </div>

                </div>

                <div className="flex justify-end space-x-4 mt-4">
                    <Button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="py-1 px-3 bg-gray-300 rounded"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="py-1 px-3 bg-blue-500 text-white rounded"
                    >
                        Update
                    </Button>
                </div>
            </form>
        </div>
    </div>
)}







        </div >
    );
};

export default DesignBOQTable;
