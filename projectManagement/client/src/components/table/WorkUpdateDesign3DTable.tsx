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

import { useRouter } from 'next/navigation';
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
    completed: string;
}

interface Design3DTableProps {
  projectId: number | null;

}

const WorkUpdateDesign3DTable: React.FC<Design3DTableProps> = ({ projectId}) => {
    const router = useRouter();
    const [projects, setProjects] = useState<PreProjectSiteVisitPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const [updatedPercentage, setUpdatedPercentage] = useState<string>(''); // Track the updated percentage
    const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track which row is being edited

    const fetchProjects = useCallback(async () => {
        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/designPlan?projectId=${projectId}&stepType=3D`, {
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

    const handlePercentageChange = async (projectId: number, newPercentage: string) => {
        // Update the percentage locally first
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === projectId
                    ? { ...project, completed: newPercentage }
                    : project
            )
        );
        if (!token) {
            router.push('/');
        } else {
        // Call API to update the percentage
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/designplans/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: newPercentage
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update completion percentage');
            }
        } catch (err) {
            setError((err as Error).message);
        }
    };
}

    const handleClick = (index: number, currentCompleted: string) => {
        setEditingIndex(index);
        setUpdatedPercentage(currentCompleted);
    };

    const handleBlur = () => {
        setEditingIndex(null); // Close the dropdown when focus is lost
    };

    const handleSelectChange = (projectId: number, newPercentage: string) => {
        // Update the percentage both locally and in the backend
        setUpdatedPercentage(newPercentage); // Update state for dropdown
        handlePercentageChange(projectId, newPercentage); // Update the backend
        setEditingIndex(null); // Close the dropdown after selection
    };



    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);
  




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
                        <TableHead className='text-white text-center'>Step Name</TableHead>
                        <TableHead className='text-white text-center'>Start Date</TableHead>
                        <TableHead className='text-white text-center'>End Date</TableHead>
                        <TableHead className='text-white text-center'>Assignee</TableHead>
                        <TableHead className='text-white text-center'>Remarks</TableHead>
                        <TableHead className='text-white text-center'>Completed(%)</TableHead>
                        <TableHead className='text-white text-center'>Status</TableHead>
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
                                <TableCell 
                                    className='border border-[#e5e7eb]'
                                    onClick={() => handleClick(index, project.completed)}
                                >
                                    {editingIndex === index ? (
                                        <select
                                            value={updatedPercentage}
                                            onBlur={handleBlur}
                                            onChange={e => handleSelectChange(project.id, e.target.value)}
                                            onClick={e => e.stopPropagation()} // Prevent triggering handleClick on select click
                                        >
                                            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(percentage => (
                                                <option key={percentage} value={percentage}>
                                                    {percentage}%
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        `${project.completed}%`
                                    )}
                                </TableCell>
                                <TableCell className='border border-[#e5e7eb]'>
                                    {parseInt(project.completed) === 100 ? (
                                        <div style={{ backgroundColor: '#11734B', color: 'white', padding: '0.5rem', borderRadius: '15px' }}>Done</div>
                                    ) : (
                                        <div style={{ backgroundColor: new Date(project.endDate) < new Date() ? '#ff0000' : '#0A53A8', color: 'white', padding: '0.5rem', borderRadius: '15px' }}>
                                            Running
                                        </div>
                                    )}
                                </TableCell>
                                
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

           
        </div>
    );
}

export default WorkUpdateDesign3DTable;