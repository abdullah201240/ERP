'use client'


import React, { useCallback, useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toWords } from 'number-to-words';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '@/app/assets/img/IQlogo.jpg'
import Footer from '@/app/assets/img/iqpv.jpg'
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



export default function Home() {
    const router = useRouter();

    const [projects, setProjects] = useState<DegineBOQPart[]>([]);
    const [boq, setBoq] = useState<DegineBOQ | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [loading1, setLoading1] = useState<boolean>(true);
    const [loading2, setLoading2] = useState<boolean>(true);


    const [error, setError] = useState<string | null>(null);
    const [error1, setError1] = useState<string | null>(null);
    const [error2, setError2] = useState<string | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const params = useParams();
    const boqId = params?.id;

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
            finally {
                setLoading2(false);
            }
        }
    }, [token, router, boq]); // Add boq as a dependency

    // CSS for printing
    const printStyles = `
@media print {
    .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 10px;
        background-color: #f17b21;
        border-bottom: 1px solid #f17b21;
        z-index: 1000;
    }
    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        z-index: 1000;
    }
    .page-content {
        margin-top: 20px; /* Adjust based on header height */
        margin-bottom: 50px; /* Adjust based on footer height */
    }
}
`;

    useEffect(() => {
        if (boq?.projectId) { // Only fetch tasks if boq and projectId are available
            fetchTask();
        }
    }, [boq, fetchTask]); // Trigger fetchTask when boq changes

    useEffect(() => {
        fetchProjects();
        fetchDegineBOQ();

    }, [fetchProjects, fetchDegineBOQ]);


    // useEffect(() => {
    //     if (!loading && !loading2 && !loading1 && boq && projects.length > 0) {
    //         window.print();
    //     }
    // }, [loading, loading1, boq, projects, loading2]);

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
    if (loading2) {
        return <div>Loading...</div>;
    }

    if (error2) {
        return <div>Error2: {error}</div>;
    }
    if (error1) {
        return <div>Error: {error}</div>;
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
        <div id="pdf-content">
            <style>{printStyles}</style>
            <div className="header"></div>


            <div className='mt-4 page-content'>

                <div className="max-w-7xl mx-auto p-8 bg-white ">




                    <div className="text-gray-800 mb-6">



                        {boq ? (
                            <div key={boq.id} className="mb-4">

                                <div className='print:break-after-page' >
                                    <div className="flex justify-between items-start">

                                        <div className="w-2/3">

                                            <p>{boq ? formatDate(boq.date) : 'N/A'}</p>
                                            <p>To</p>
                                            <p>{boq.clientName}</p>
                                            <p>{boq.projectAddress}</p>
                                            <p><strong className='font-semibold'>Subject:</strong> {boq.subject}</p>

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
                                    

                                        <p className='mt-8'>Dear Sir,</p>
                                        <p className='mt-4'>{boq.firstPera}</p>
                                        <p className='mt-4'>{boq.secondPera}</p>
                                        <p className='font-semibold mt-8 mb-4'><u>SCOPE OF WORKS:</u></p>
                                        {projects && projects.length > 0 ? (
                                            projects.map((project, index) => (
                                                <p key={index}>PHASE-{index + 1}: <span>{project.serviceName}</span></p>
                                            ))
                                        ) : (
                                            <p>No projects available</p>
                                        )}
                                        <p className='mt-4 font-semibold'>FEES PROPOSAL:</p>
                                        <p className='mt-2 mb-4'>{boq.feesProposal}</p>
                                    

                                </div>






                                <div className='print:break-after-page'>





                                    <Table className='mt-4'>
                                        <TableHeader className='bg-[#2A515B] text-white text-xs'>
                                            <TableRow className='text-center'>
                                                <TableHead className='text-white text-center '>Item No.</TableHead>
                                                <TableHead className='text-white text-center'>Description</TableHead>
                                                <TableHead className='text-white text-center'>Total Built-up Area in sft.</TableHead>

                                                <TableHead className='text-white text-center'>Total Fees in Tk. </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>

                                            <TableRow>
                                                <TableCell className='text-center border border-[#e5e7eb] text-xs'>1</TableCell>

                                                <TableCell className='text-center border border-[#e5e7eb] text-xs'>
                                                    <p className='font-semibold mt-4 text-left text-xs'>Service Package:</p>
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
                                            <TableRow className='text-center text-xs'>
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
                                                    <TableRow key={project.id} className='text-center text-xs'>
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



                                </div>
                                <div className='print:break-after-page'>



                                    <p className='font-semibold mt-4 mb-4 text-xm'>REQUIRED TIME SCHEDULE FOR THE DESIGN WORKS</p>

                                    <Table className='mt-4'>
                                        <TableHeader className='bg-[#2A515B] text-white text-xs'>
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
                                                        <TableRow key={stepType} className='text-center text-xs'>
                                                            <TableCell className='border border-[#e5e7eb]'>{stepType}</TableCell>
                                                            <TableCell className='border border-[#e5e7eb]'>{totalDays} days</TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>






                                    <p className='font-semibold mt-4 mb-2'>Note 01</p>
                                    <p className='mb-2'>{boq.feesProposalNote1}</p>
                                    <p className='font-semibold mb-4'>Note 02</p>

                                    <p className='mb-4'>{boq.feesProposalNote2}</p>





                                </div>

                                <div className='print:break-after-page'>



                                    <p className='font-semibold mb-4 mt-8'>Terms & Condition:</p>

                                    <p className='ml-4' > <div dangerouslySetInnerHTML={{ __html: boq.termsCondition }} /></p>



                                    <p className='font-semibold mt-4 mb-36'>Thanking You </p>


                                    <div className="flex justify-between items-start w-full  ">
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
                            </div>

                        ) : (
                            <p>No Data Found</p>
                        )}
                    </div>








                </div>
            </div>
            <div className="footer h-[100px] flex justify-center items-center">
                <Image src={Footer} alt="Footer" className="max-w-7xl w-full h-full   object-contain" />
            </div>


        </div>


    )
}
