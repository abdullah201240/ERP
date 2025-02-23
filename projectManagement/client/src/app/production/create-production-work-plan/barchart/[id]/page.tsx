'use client';

import React, { useEffect, useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams, useRouter } from 'next/navigation';

// Define the interface for the task data
interface TaskData {
    startDate: string;
    endDate: string;
    workType: string;
    completed: number | null;
    id: number;
}

const Page: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    // Define the state type for tasks and loading
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkTokenAndFetchProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                    headers: { 'Authorization': token }
                });
                if (!response.ok) {
                    router.push('/');
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkTokenAndFetchProfile();
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/productionWorkPlan2/${id}`);
                const result = await response.json();
                if (result.success) {
                    // Map the result data to match the Task type for Gantt
                    const transformedTasks = result.data.map((item: TaskData) => ({
                        start: new Date(item.startDate), // Convert string to Date object
                        end: new Date(item.endDate), // Convert string to Date object
                        name: item.workType,
                        id: item.id.toString(),
                        type: 'task',
                        progress: item.completed || 0,
                        styles: { progressColor: '#4153A5', backgroundColor: '#B8C2CC' },
                    }));
                    setTasks(transformedTasks);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const generatePDF = () => {
        const input = document.getElementById('ganttChart')!;
        html2canvas(input, {
            scale: 2,
            windowWidth: document.body.scrollWidth,
            windowHeight: document.body.scrollHeight,
            scrollX: 0,
            scrollY: 0,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape');
            const pageWidth = pdf.internal.pageSize.width;
            const pageHeight = pdf.internal.pageSize.height;

            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (imgHeight > pageHeight) {
                const scaleFactor = pageHeight / imgHeight;
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth * scaleFactor, imgHeight * scaleFactor);
            } else {
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            }

            pdf.save('gantt-chart-full-page.pdf');
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <button onClick={generatePDF} className="mb-4 p-2 bg-blue-500 text-white rounded">
                Download PDF
            </button>

            <div id="ganttChart">
                <div className='mb-8 mt-4'>
                    <h1>BARCHART</h1>
                </div>

                {tasks.length > 0 ? (

                    <Gantt
                        tasks={tasks}
                        viewMode={ViewMode.Day}
                        columnWidth={100}
                        locale="en"
                        TaskListHeader={() => (
                            <div>
                                <Table className="w-full">
                                    <TableHeader className='bg-[#2A515B] text-white'>
                                        <TableRow className='text-center'>
                                            <TableHead className='text-white text-center h-8'>SI</TableHead>
                                            <TableHead className='text-white text-center h-8' >Work List</TableHead>
                                            <TableHead className='text-white text-center h-8' >Start Date</TableHead>
                                            <TableHead className='text-white text-center h-8' >End Date</TableHead>

                                            <TableHead className='text-white text-center h-8'>Days</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tasks.map((task, index) => {
                                            // Ensure task.start and task.end are defined before calculating days
                                            if (!task.start || !task.end) {
                                                return (
                                                    <TableRow key={task.id} className="text-center h-8">
                                                        <TableCell className="text-center border border-[#e5e7eb] h-8">{index + 1}</TableCell>
                                                        <TableCell className="border border-[#e5e7eb] h-8">{task.name}</TableCell>
                                                        <TableCell className="border border-[#e5e7eb] h-8">Invalid Dates</TableCell>
                                                    </TableRow>
                                                );
                                            }

                                            const days = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24);

                                            return (
                                                <><TableRow key={task.id} className="text-center h-8" >
                                                        <TableCell className="text-center border border-[#e5e7eb] h-8">{index + 1}</TableCell>
                                                        <TableCell className="border border-[#e5e7eb] h-8">{task.name}</TableCell>
                                                        <TableCell className="border border-[#e5e7eb] h-8">
                                                            {task.start.toLocaleDateString("en-US")}
                                                        </TableCell>


                                                        <TableCell className="border border-[#e5e7eb] h-8">
                                                        {task.end.toLocaleDateString("en-US")}

                                                        </TableCell>


                                                        <TableCell className="border border-[#e5e7eb] h-8">{days} Days</TableCell>
                                                    </TableRow></>
                                            );
                                        })}
                                    </TableBody>



                                </Table>
                            </div>
                        )}


                        TaskListTable={() => (
                            <div>
                               
                            </div>
                        )}
                    />
                ) : (
                    <p>No tasks available</p>
                )}
            </div>
        </div>
    );
};

export default Page;