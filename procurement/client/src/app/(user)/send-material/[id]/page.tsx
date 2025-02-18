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
    productName: string;
    productCategory: string;

}

interface MaterialEntry {
    id: number;
    productCode: string;
    productName: string;
    quantity: number;
    date: string;
    status: string;
}


export default function Page() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();

    const id = params?.id;
    const [materialEntries, setMaterialEntries] = useState<MaterialEntry[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<MaterialEntry | null>(null);
    useEffect(() => {
        const checkTokenAndFetchProfile = async () => {
            const token = localStorage.getItem('accessTokenpq');
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

            } catch (error) {
                console.error(error);
            }
        };

        checkTokenAndFetchProfile();
    }, [router]);

    const fetchDrawings = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('accessTokenpq');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROJECTMANAGEMENT}workingDrawing/viewDrawingsByProjectId/${id}`, {
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
    const fetchMaterials = useCallback(async () => {
        const token = localStorage.getItem('accessTokenpq');
        if (!token) return;

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROJECTMANAGEMENT}workingDrawing/saveMaterials/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch materials");
            }

            const data = await response.json();
            setMaterialEntries(data.data);
        } catch (error) {
            console.error("Error fetching materials:", error);
        } finally {
            setLoading(false);
        }
    }, [id]); // Ensure `id` is included in dependencies


    useEffect(() => {
        fetchDrawings();
        fetchMaterials();

    }, [fetchDrawings, fetchMaterials]);



   interface ConfirmationPopupProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">Are you sure you want to send this material entry?</p>
            <div className="flex justify-end">
                <button
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    OK
                </button>
            </div>
        </div>
    </div>
);

    const handleSend = async () => {
        if (!selectedEntry) return;

        const token = localStorage.getItem('accessTokenpq');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROJECTMANAGEMENT}workingDrawing/saveMaterialsStatus/${selectedEntry.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'Sent from procurement' }),
            });

            if (!response.ok) throw new Error("Failed to update status");

            // Update the local state
            setMaterialEntries(prevEntries =>
                prevEntries.map(entry =>
                    entry.id === selectedEntry.id ? { ...entry, status: 'Sent from procurement' } : entry
                )
            );

            setIsPopupOpen(false);
            setSelectedEntry(null);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

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
                            <TableHead className="text-white text-center">Product Name</TableHead>

                            <TableHead className="text-white text-center">Product Category</TableHead>

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
                                    <TableCell className="border border-[#e5e7eb]">{project.productName}</TableCell>

                                    <TableCell className="border border-[#e5e7eb]">{project.productCategory}</TableCell>

                                    <TableCell className="border border-[#e5e7eb]">{project.totalNeed}</TableCell>
                                    <TableCell className="border border-[#e5e7eb]">{project.perPiecePrice}</TableCell>
                                    <TableCell className="border border-[#e5e7eb]">{project.totalPrice}</TableCell>




                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            )}
            <h1 className="text-2xl font-bold mb-8 mt-8">Total Material List  Price & Date</h1>


            <Table>
                <TableHeader className="bg-[#2A515B] text-white">
                    <TableRow className="text-center">
                        <TableHead className="text-white text-center">SI. No</TableHead>
                        <TableHead className="text-white text-center">Product Code</TableHead>
                        <TableHead className="text-white text-center">Product Name</TableHead>

                        <TableHead className="text-white text-center">Quantity</TableHead>

                        <TableHead className="text-white text-center">Date</TableHead>
                        <TableHead className="text-white text-center">Status</TableHead>

                        <TableHead className="text-white text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {materialEntries.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center border border-[#e5e7eb]">
                                No material Entries Data Available
                            </TableCell>
                        </TableRow>
                    ) : (
                        materialEntries.map((entry, index) => (
                            <TableRow key={entry.id} className="text-center">
                                <TableCell className="border border-[#e5e7eb]">{index + 1}</TableCell>
                                <TableCell className="border border-[#e5e7eb]">{entry.productCode}</TableCell>
                                <TableCell className="border border-[#e5e7eb]">{entry.productName}</TableCell>

                                <TableCell className="border border-[#e5e7eb]">{entry.quantity}</TableCell>

                                <TableCell className="border border-[#e5e7eb]">{entry.date}</TableCell>
                                <TableCell className="border border-[#e5e7eb]">{entry.status}</TableCell>

                                <TableCell className="border border-[#e5e7eb]">
                                    <button
                                        onClick={() => {
                                            setSelectedEntry(entry);
                                            setIsPopupOpen(true);
                                        }}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    >
                                        Send
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {isPopupOpen && (
                <ConfirmationPopup
                    onConfirm={handleSend}
                    onCancel={() => setIsPopupOpen(false)}
                />
            )}


        </div>
    );
}



