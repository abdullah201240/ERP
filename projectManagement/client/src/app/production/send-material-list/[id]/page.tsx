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
import { useParams, useRouter } from 'next/navigation';

// Define an interface for the project data
interface Project {
    productCode: string;
    totalNeed: number;
    perPiecePrice: number;
    totalPrice: number;
}

export default function Page() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();

    const id = params?.id;

    useEffect(() => {
        const checkTokenAndFetchProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/auth/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    router.push('/');
                }
                const data = await response.json();
                console.table(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        checkTokenAndFetchProfile();
    }, [router]);

    const fetchDrawings = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workingDrawing/viewDrawingsByProjectId/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch drawings");
            const data = await response.json();

            setProjects(data.data.productSummary);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching drawings:", error);
            setLoading(false);
        }
    }, [router, id]);

    useEffect(() => {
        fetchDrawings();
    }, [fetchDrawings]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Total Material List & Price</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Table>
                    <TableHeader className="bg-[#2A515B] text-white">
                        <TableRow className="text-center">
                            <TableHead className="text-white text-center">SI. No.</TableHead>
                            <TableHead className="text-white text-center">Product Code</TableHead>
                            <TableHead className="text-white text-center">Total Need</TableHead>
                            <TableHead className="text-white text-center">Per Piece Price</TableHead>
                            <TableHead className="text-white text-center">Total Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center border border-[#e5e7eb]">
                                    No Project Data Available
                                </TableCell>
                            </TableRow>
                        ) : (
                            projects.map((project, index) => (
                                <TableRow key={project.productCode} className="text-center">
                                    <TableCell className="border border-[#e5e7eb]">{index + 1}</TableCell>
                                    <TableCell className="border border-[#e5e7eb]">{project.productCode}</TableCell>
                                    <TableCell className="border border-[#e5e7eb]">{project.totalNeed}</TableCell>
                                    <TableCell className="border border-[#e5e7eb]">{project.perPiecePrice}</TableCell>
                                    <TableCell className="border border-[#e5e7eb]">{project.totalPrice}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}