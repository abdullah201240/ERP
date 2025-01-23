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
    assigned: { eName: string; eid: string; id: string }[]; // Stores selected employees
    createdAt: string;
    updatedAt: string;
    daysRemaining?: number; // Added optional property
    daysPassed?: number; 
  }


export default function DesignDevelopmentTable() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
   
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
   useEffect(() => {
    if (projects.length > 0) {
        // Assuming you want to calculate days for each project
        projects.forEach(project => {
            // Convert string dates to Date objects
            const startDate = new Date(project.startDate); // Ensure valid date conversion
            const endDate = new Date(project.endDate); // Ensure valid date conversion
            const currentDate = new Date(); // Get the current date

            // Calculate days remaining
            const remainingTime = endDate.getTime() - currentDate.getTime();
            const daysRemaining = Math.max(0, Math.floor(remainingTime / (1000 * 60 * 60 * 24))); // Ensure non-negative result

            // Calculate days passed
            const passedTime = currentDate.getTime() - startDate.getTime();
            const daysPassed = Math.max(0, Math.floor(passedTime / (1000 * 60 * 60 * 24))); // Ensure non-negative result

            // You can store these values in the project object or handle them as needed
            project.daysRemaining = daysRemaining; // Add daysRemaining to the project object
            project.daysPassed = daysPassed; // Add daysPassed to the project object
        });

        // Update the state with the modified projects
        setProjects([...projects]);
    }
}, [projects]);

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
                        <TableHead className='text-white text-center' >Current Work in Progress</TableHead>
                        <TableHead className='text-white text-center'>Remaining Tasks</TableHead>
                        <TableHead className='text-white text-center'>Completion (%)</TableHead>
                        <TableHead className='text-white text-center'>View Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project, index) => (
                        <TableRow key={project.id} className='text-center'>
                            <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
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