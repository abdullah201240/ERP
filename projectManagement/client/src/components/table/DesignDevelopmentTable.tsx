'use client'
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

interface Project {
    id: number;
    projectName: string;
    assignedTo: string;
    supervisorName: string;
    currentStage: string;
    startDate: string;
    projectTimeline: number;
    daysPassed: number;
    daysRemaining: number;
    currentWork: string;
    remainingTasks: string;
    completion: number;
}

export default function DesignDevelopmentTable() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            const fetchProjects = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/all-projects`, {
                        headers: {
                            'Authorization': token
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch projects');
                    }
                    const data = await response.json();
                    console.log(data.data); // Log the response data
                    if (Array.isArray(data.data)) {
                        setProjects(data.data); // Correctly set projects to data.data
                    } else {
                        throw new Error('Fetched data is not an array');
                    }
                } catch (err) {
                    setError((err as Error).message);
                } finally {
                    setLoading(false);
                }
            };

            fetchProjects();
        }
    }, [router, token]);

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
            <Table>
                <TableHeader className='bg-[#2A515B] text-white'>
                    <TableRow>
                        <TableHead className='text-white'>SI. No.</TableHead>
                        <TableHead className='text-white'>Project Name</TableHead>
                        <TableHead className='text-white'>Assigned To</TableHead>
                        <TableHead className='text-white'>Supervisor Name</TableHead>
                        <TableHead className='text-white'>Current Stage</TableHead>
                        <TableHead className='text-white'>Start Date</TableHead>
                        <TableHead className='text-white'>Project Timeline</TableHead>
                        <TableHead className='text-white'>Days Passed</TableHead>
                        <TableHead className='text-white'>Days Remaining</TableHead>
                        <TableHead className='text-white'>Current Work in Progress</TableHead>
                        <TableHead className='text-white'>Remaining Tasks</TableHead>
                        <TableHead className='text-white'>Completion (%)</TableHead>
                        <TableHead className='text-white'>View Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project, index) => (
                        <TableRow key={project.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{project.projectName}</TableCell>
                            <TableCell>{project.assignedTo}</TableCell>
                            <TableCell>{project.supervisorName}</TableCell>
                            <TableCell>{project.currentStage}</TableCell>
                            <TableCell>{project.startDate}</TableCell>
                            <TableCell>{project.projectTimeline}</TableCell>
                            <TableCell>{project.daysPassed}</TableCell>
                            <TableCell>{project.daysRemaining}</TableCell>
                            <TableCell>{project.currentWork}</TableCell>
                            <TableCell>{project.remainingTasks}</TableCell>
                            <TableCell>{project.completion}%</TableCell>
                            <TableCell>
                                <Link href={`/projects/${project.id}`} className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                                    View
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}