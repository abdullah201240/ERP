
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { RiFileDownloadFill } from "react-icons/ri";

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
import { toWords } from 'number-to-words';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/assets/img/Logo.webp'

// Interface as provided by you
interface DegineBOQPart {
    id: number;
    serviceName: string;
    serviceDescription: string;
    serviceAmount: string;
}
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

    designation: string;
    projectId: string;
    subject: string;
    firstPera: string;
    secondPera: string;
    feesProposal: string;

    feesProposalNote1: string;
    feesProposalNote2: string;
    date: string;

}

interface Task {
    id: number;
    projectId: string;
    stepType: string;
    startDate: string;
    endDate: string;

}

interface DesignFinalGenerateQutationTableProps {
    reload: boolean;
    boqId: number | null;
}

const DesignFinalGenerateQutationTable: React.FC<DesignFinalGenerateQutationTableProps> = ({ reload, boqId }) => {
    const router = useRouter();
    const [projects, setProjects] = useState<DegineBOQPart[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [boq, setBoq] = useState<DegineBOQ | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [loading1, setLoading1] = useState<boolean>(true);


    const [error, setError] = useState<string | null>(null);
    const [error1, setError1] = useState<string | null>(null);
    const [error2, setError2] = useState<string | null>(null);


    const [deleteId, setDeleteId] = useState<number | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    // Handle drag start
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    // Handle drag over
    const handleDragOver = (event: React.DragEvent<HTMLTableRowElement>, index: number) => {
        if (draggedIndex === null) return;

        // Prevent default to allow drop
        event.preventDefault();

        // Reorder the projects array
        const newProjects = [...projects];
        const draggedItem = newProjects[draggedIndex];

        // Remove the dragged item from its original position
        newProjects.splice(draggedIndex, 1);
        // Insert the dragged item at the new position
        newProjects.splice(index, 0, draggedItem);

        // Update the state with the new order
        setProjects(newProjects);
        localStorage.setItem('updatedProjects', JSON.stringify(newProjects));


        setDraggedIndex(index);
    };

    // Handle drop
    const handleDrop = () => {
        setDraggedIndex(null);
    };
    // Fetch projects
    const fetchProjects = useCallback(async () => {
        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQPart/${boqId}`, {
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
    }, [token, router, boqId]);


    const fetchDegineBOQ = useCallback(async () => {
        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQ/${boqId}`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();


                setBoq(data.data);

            } catch (err) {
                setError1((err as Error).message);
            } finally {
                setLoading1(false);
            }
        }
    }, [token, router, boqId]);
    // Fetch projects
    const fetchTask = useCallback(async () => { 
        if (!token) {
            router.push('/');
        } else if (boq?.projectId) { // Ensure boq and projectId are available
            try {
                const projectId = boq.projectId;
                console.log(projectId);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/designPlanProject?projectId=${projectId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }

                const data = await response.json();

                if (data.success && Array.isArray(data.data)) {
                    setTasks(data.data);
                } else {
                    throw new Error('Fetched data is not in expected format');
                }
            } catch (err) {
                setError2((err as Error).message);
            }
        }
    }, [token, router, boq]); // Add boq as a dependency



    useEffect(() => {
        fetchProjects();
        fetchDegineBOQ();

    }, [fetchProjects, fetchDegineBOQ, reload]);
    useEffect(() => {
        if (boq?.projectId) { // Only fetch tasks if boq and projectId are available
            fetchTask();
        }
    }, [boq, fetchTask]); // Trigger fetchTask when boq changes

    useEffect(() => {
        if (projects.length > 0) {
            localStorage.setItem('updatedProjects', JSON.stringify(projects));
        }
    }, [projects]);

    // Handle delete
    const handleDelete = async () => {
        if (deleteId === null) return;

        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/designBoqPart/${deleteId}`, {
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
    if (loading1) {
        return <div>Loading...</div>;
    }

    if (error1) {
        return <div>Error: {error}</div>;
    }


    if (error2) {
        return <div>Error2: {error}</div>;
    }




    // Calculate final total amount
    const finalTotalAmount = projects.reduce((total, project) => {
        return total + parseFloat(project.serviceAmount || '0');
    }, 0);
    // Add final amount below the table
    const finalAmount = finalTotalAmount; // You can modify this if you have some additional calculation for the final amount
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };
        const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
        return formattedDate;
    };

    return (
        <div>
            <Table>
                <TableHeader className='bg-[#2A515B] text-white'>
                    <TableRow className='text-center'>
                        <TableHead className='text-white text-center'>SI. No.</TableHead>
                        <TableHead className='text-white text-center'>Service</TableHead>
                        <TableHead className='text-white text-center'>Description</TableHead>

                        <TableHead className='text-white text-center'>Total Amount
                            (Tk)</TableHead>




                        <TableHead className='text-white text-center'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className='text-center border border-[#e5e7eb]'>
                                No Boq found
                            </TableCell>
                        </TableRow>
                    ) : (
                        projects.map((project, index) => (
                            <TableRow key={project.id} className='text-center'
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(event) => handleDragOver(event, index)}
                                onDrop={handleDrop}
                            >
                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.serviceName}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.serviceDescription}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{project.serviceAmount}</TableCell>

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

                    <TableRow>
                        <TableCell colSpan={3} className="text-right border border-[#e5e7eb]">
                            <strong className='text-center'>Total Amount in Tk.</strong>
                        </TableCell>
                        <TableCell className="border border-[#e5e7eb]">
                            <strong className='text-center'>{finalAmount.toFixed(2)} Tk</strong>
                        </TableCell>
                        <TableCell className="border border-[#e5e7eb]"></TableCell>
                    </TableRow>
                </TableBody>
            </Table>


            <div className="bg-[#0A53A817] mt-8 mx-auto max-w-6xl flex justify-center items-center py-6 rounded-lg shadow-md">
                <Link href={`/boq/designboq/${boqId}`} passHref target="_blank">
                    <button className="flex flex-col items-center text-[#0A53A8] hover:text-[#083a7a] transition-all duration-300">
                        <RiFileDownloadFill className="text-4xl mb-2" />
                        <span className="text-lg font-medium">Download BOQ</span>
                    </button>
                </Link>
            </div>


            <div className='mt-12'>
                <div className="mt-12">
                    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
                        {/* Sender's Address */}
                        <div className="text-gray-800 mb-6">
                            {boq ? (
                                <div key={boq.id} className="mb-4">
                                    <div className="flex justify-between items-start">
                                        {/* Left Side: Text Content */}
                                        <div className="w-2/3">
                                            <p>{boq ? formatDate(boq.date) : 'N/A'}</p>
                                            <p>To</p>
                                            <p>{boq.clientName}</p>
                                            <p>{boq.projectAddress}</p>
                                            <p><strong className='font-semibold'>Subject:</strong> {boq.subject}</p>
                                            <p className='mt-8'>Dear Sir,</p>
                                            <p className='mt-4'>{boq.firstPera}</p>
                                            <p className='mt-4'>{boq.secondPera}</p>
                                            <p className='font-semibold mt-4'><u>SCOPE OF WORKS:</u></p>
                                        </div>

                                        {/* Right Side: Logo Image */}
                                        <div className="w-1/3 flex justify-end">
                                            <Image
                                                src={Logo} // Replace with the actual path to your logo
                                                alt="Logo"
                                                className="w-32 h-32 object-contain" // Adjust size as needed
                                            />
                                        </div>
                                    </div>

                                    {projects && projects.length > 0 ? (
                                        projects.map((project, index) => (
                                            <p key={index}>PHASE-{index + 1}: <span>{project.serviceName}</span></p>
                                        ))
                                    ) : (
                                        <p>No projects available</p>
                                    )}

                                    <p className='mt-8 font-semibold'>FEES PROPOSAL:</p>
                                    <p className='mt-2'>{boq.feesProposal}</p>
                                    <Table className='mt-8'>
                                        <TableHeader className='bg-[#2A515B] text-white'>
                                            <TableRow className='text-center'>
                                                <TableHead className='text-white text-center'>Item No.</TableHead>
                                                <TableHead className='text-white text-center'>Description</TableHead>
                                                <TableHead className='text-white text-center'>Total Built-up Area in sft.</TableHead>

                                                <TableHead className='text-white text-center'>Total Fees in Tk. </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>

                                            <TableRow>
                                                <TableCell className='text-center border border-[#e5e7eb]'>1</TableCell>

                                                <TableCell className='text-center border border-[#e5e7eb]'>
                                                    <p className='font-semibold mt-4 text-left'>Service Package:</p>
                                                    {projects && projects.length > 0 ? (
                                                        projects.map((project, index) => (
                                                            <p className='text-left' key={index}>PHASE-{index + 1}: <span>{project.serviceName}</span></p>
                                                        ))
                                                    ) : (
                                                        <p>No projects available</p>
                                                    )}


                                                </TableCell>
                                                <TableCell className='text-center border border-[#e5e7eb]'>{boq.totalArea}</TableCell>



                                                <TableCell className='text-center border border-[#e5e7eb]'>{boq.totalFees}</TableCell>
                                            </TableRow>


                                        </TableBody>


                                    </Table>

                                    <p className='text-sm mt-4 '> <span className='font-semibold'> In-words :</span>  {boq.totalFees ? toWords(boq.totalFees) : 'N/A'}
                                    </p>
                                    <p className='text-xm font-semibold mt-4'>Mode of Payment:</p>

                                    <Table className='mt-4'>
                                        <TableHeader className='bg-[#2A515B] text-white'>
                                            <TableRow className='text-center'>
                                                <TableHead className='text-white text-center'>SI. No.</TableHead>
                                                <TableHead className='text-white text-center'>Service</TableHead>
                                                <TableHead className='text-white text-center'>Description</TableHead>

                                                <TableHead className='text-white text-center'>Total Amount
                                                    (Tk)</TableHead>

                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {projects.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>
                                                        No Boq found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                projects.map((project, index) => (
                                                    <TableRow key={project.id} className='text-center'>
                                                        <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                                        <TableCell className='border border-[#e5e7eb]'>{project.serviceName}</TableCell>
                                                        <TableCell className='border border-[#e5e7eb]'>{project.serviceDescription}</TableCell>
                                                        <TableCell className='border border-[#e5e7eb]'>{project.serviceAmount}</TableCell>


                                                    </TableRow>
                                                ))
                                            )}

                                            <TableRow>
                                                <TableCell colSpan={4} className="text-right border border-[#e5e7eb]">
                                                    <strong >Total Amount in Tk.</strong>
                                                    <strong >{finalAmount.toFixed(2)} Tk</strong>
                                                </TableCell>


                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <p className='text-sm mt-4 '> <span className='font-semibold'> In-words :</span>  {finalAmount.toFixed(2) ? toWords(finalAmount.toFixed(2)) : 'N/A'}
                                    </p>

                                    <p className='font-semibold mt-4 mb-4'>REQUIRED TIME SCHEDULE FOR THE DESIGN WORKS</p>


                                    <Table className='mt-4'>
                                        <TableHeader className='bg-[#2A515B] text-white'>
                                            <TableRow className='text-center'>
                                                <TableHead className='text-white text-center'>Task</TableHead>
                                                <TableHead className='text-white text-center'>Working Days</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {tasks.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>
                                                        No tasks found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                // Group tasks by stepType
                                                Object.entries(
                                                    tasks.reduce((acc, task) => {
                                                        if (!acc[task.stepType]) {
                                                            acc[task.stepType] = [];
                                                        }
                                                        acc[task.stepType].push(task);
                                                        return acc;
                                                    }, {} as Record<string, Task[]>)
                                                ).map(([stepType, tasksForType]) => {
                                                    // Calculate total time excluding Fridays
                                                    const totalDays = tasksForType.reduce((total, task) => {
                                                        const startDate = new Date(task.startDate);
                                                        const endDate = new Date(task.endDate);

                                                        const currentDate = new Date(startDate); // Use const here
                                                        let days = 0;

                                                        // Iterate through each day between startDate and endDate
                                                        while (currentDate <= endDate) {
                                                            // Exclude Fridays (day 5 in JavaScript's Date object)
                                                            if (currentDate.getDay() !== 5) {
                                                                days++;
                                                            }
                                                            currentDate.setDate(currentDate.getDate() + 1); // Modify the date
                                                        }

                                                        return total + days;
                                                    }, 0);

                                                    return (
                                                        <TableRow key={stepType} className='text-center'>
                                                            <TableCell className='border border-[#e5e7eb]'>{stepType}</TableCell>
                                                            <TableCell className='border border-[#e5e7eb]'>{totalDays} days</TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>




                                    <p className='font-semibold mt-4 mb-4'>Note 01</p>
                                    <p className=' mt-4 mb-4'>{boq.feesProposalNote1}</p>
                                    <p className='font-semibold mt-4 mb-4'>Note 02</p>

                                    <p className=' mt-4 mb-4'>{boq.feesProposalNote2}</p>

                                    <p className='font-semibold mt-4 mb-4'>Terms & Condition:</p>

                                    <p className='ml-4' > <div dangerouslySetInnerHTML={{ __html: boq.termsCondition }} /></p>



                                    <p className='font-semibold mt-4 mb-36'>Thanking You </p>

                                    <div className="flex justify-between items-start w-full ">
                                        <div className="text-left">
                                            <hr className="w-32 border-t border-gray-400 mb-2" />
                                            <p className="font-bold">{boq.signName}</p>
                                            <p className="text-sm">{boq.designation}</p>
                                            <p className="text-sm">IQ Architects Ltd.</p>
                                        </div>

                                        <div className="text-right">
                                            <hr className="w-32 border-t border-gray-400 mb-2 ml-auto" />
                                            <p className="font-bold">{boq.clientName}</p>
                                            <p className="text-sm">{boq.projectAddress}</p>

                                        </div>
                                    </div>






                                </div>
                            ) : (
                                <p>No Data Found</p>
                            )}
                        </div>








                    </div>
                </div>


            </div>







        </div >
    );
};

export default DesignFinalGenerateQutationTable;


