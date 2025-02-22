"use client"
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
import Link from 'next/link';

// Define an interface for the project data
interface Project {
    id: number;
    projectId: string;


    clientName: string;
    clientContact: string;
    projectAddress: string;
    projectName: string;


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

export default function Page() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const router = useRouter();

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
                const data = await response.json();
                console.table(data.data)
                if (data.success) {
                    setEmployeeDetails(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkTokenAndFetchProfile();
    }, [router]);

    const fetchDrawings = useCallback(async () => {
        setLoading(true);

        try {
            if (!employeeDetails) {
                return
            }
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/getWorkingDrawingByProject/${employeeDetails?.sisterConcernId}`, {
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to fetch drawings");
            const data = await response.json();

            setProjects(data.data);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching drawings:", error);
            setLoading(false);

        }
        finally {
            setLoading(false);

        }
    }, [router, employeeDetails]);

    useEffect(() => {
        fetchDrawings();
    }, [fetchDrawings]);



    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Projects</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Table>
                    <TableHeader className="bg-[#2A515B] text-white">
                        <TableRow className="text-center">
                            <TableHead className="text-white text-center">SI. No.</TableHead>
                            <TableHead className="text-white text-center">Project ID</TableHead>
                            <TableHead className="text-white text-center">Client Name</TableHead>
                            <TableHead className="text-white text-center">Client Contact</TableHead>
                            <TableHead className="text-white text-center">Project Address</TableHead>
                            <TableHead className="text-white text-center">Action</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center border border-[#e5e7eb]">
                                    No Project Data Available
                                </TableCell>
                            </TableRow>
                        ) : (
                            projects.map((project, index) => (
                                <TableRow key={project.id} className="text-center">
                                    <TableCell className="border border-[#e5e7eb]">{index + 1}</TableCell>
                                    <TableCell className="border border-[#e5e7eb]">{project.projectId}</TableCell>
                                    <TableCell className="border border-[#e5e7eb]">{project.clientName}</TableCell>
                                    <TableCell className="border border-[#e5e7eb]">{project.clientContact}</TableCell>
                                    <TableCell className="border border-[#e5e7eb]">{project.projectAddress}</TableCell>
                                    <TableCell className='border border-[#e5e7eb]  flex items-center justify-center'>
                                        <Link href={`/production/bill-generation/${project.projectId}`}>
                                            <p className="mr-8 bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">Bill</p>
                                        </Link>
                                        
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
