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
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';

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
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();

    const id = params?.id;
    const [materialEntries, setMaterialEntries] = useState<MaterialEntry[]>([]);
    const [date, setDate] = useState("");
    const [quantity, setQuantity] = useState("");

    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    // New state for edit dialog
    const [editOpen, setEditOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<MaterialEntry | null>(null);
    const [editQuantity, setEditQuantity] = useState("");
    const [editDate, setEditDate] = useState("");
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
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/viewDrawingsByProjectId/${id}`, {
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
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/saveMaterials/${id}`, {
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

    const handleSubmit = async () => {
        if (!selectedProduct || !quantity || !date) {
            return alert("All fields are required");
        }
        if (!employeeDetails) {
            return;
        }

        const selectedProductDetails = projects.find(product => product.productCode === selectedProduct);
        if (!selectedProductDetails) {
            return alert("Invalid product selection");
        }

        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workingDrawing/saveMaterials`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productCode: selectedProduct,
                    productName: selectedProductDetails.productName,
                    quantity,
                    date,
                    sisterConcernId: employeeDetails.sisterConcernId,
                    projectId: id
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save material");
            }

            const newEntry = await response.json();
            setMaterialEntries(prev => [...prev, newEntry]);
            await fetchMaterials();  // Refetch materials after adding

            setOpen(false);
        } catch (error) {
            console.error("Error saving material:", error);
        }
    };


    const handleEdit = (entry: MaterialEntry) => {
        setSelectedEntry(entry);
        setEditQuantity(entry.quantity.toString());
        setEditDate(entry.date);
        setEditOpen(true);
    };
    const handleUpdate = async () => {
        if (!selectedEntry || !editQuantity || !editDate) return alert("All fields are required");

        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/saveMaterials/${selectedEntry.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quantity: parseInt(editQuantity),
                    date: editDate,
                }),
            });

            if (!response.ok) throw new Error("Failed to update material");
            const updatedEntry = await response.json();
            setMaterialEntries(prev => prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
            await fetchMaterials();
            setEditOpen(false);
        } catch (error) {
            console.error("Error updating material:", error);
        }
    };

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem('accessToken');
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/saveMaterials/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setMaterialEntries(prev => prev.filter(entry => entry.id !== id));
            await fetchMaterials();
        } catch (error) {
            console.error("Error deleting material:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Total Material List & Price</h1>
            <Button onClick={() => setOpen(true)} className="mb-4 bg-[#ea580b] hover:bg-[#29515b]">+ Add Material</Button>

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
                            <TableRow key={entry.productCode} className="text-center">
                                <TableCell className="border border-[#e5e7eb]">{index + 1}</TableCell>
                                <TableCell className="border border-[#e5e7eb]">{entry.productCode}</TableCell>
                                <TableCell className="border border-[#e5e7eb]">{entry.productName}</TableCell>

                                <TableCell className="border border-[#e5e7eb]">{entry.quantity}</TableCell>

                                <TableCell className="border border-[#e5e7eb]">{entry.date}</TableCell>
                                <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>
                                    <FaEdit
                                        onClick={() => handleEdit(entry)} // Set the project data for editing
                                        className='mr-8 opacity-50 cursor-pointer'
                                    />

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <RiDeleteBin6Line className='opacity-50 cursor-pointer' />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this material entry? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                                                <AlertDialogAction asChild>
                                                    <Button onClick={() => handleDelete(entry.id)}>Delete</Button>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>





                                </TableCell>

                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>


            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger />
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Material</DialogTitle>
                    </DialogHeader>
                    <Select onValueChange={setSelectedProduct}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.map(product => (
                                <SelectItem key={product.productCode} value={product.productCode}>
                                    {product.productName} ({product.productCode})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Quantity" onChange={e => setQuantity(e.target.value)} />
                    <Input type="date" onChange={e => setDate(e.target.value)} />
                    <Button className='bg-[#ea580b] hover:bg-[#29515b]' onClick={handleSubmit}>Submit</Button>
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Material</DialogTitle>
                    </DialogHeader>
                    <Input type="number" placeholder="Quantity" value={editQuantity} onChange={e => setEditQuantity(e.target.value)} />
                    <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
                    <Button className='bg-[#ea580b] hover:bg-[#29515b]' onClick={handleUpdate}>Update</Button>
                </DialogContent>
            </Dialog>

        </div>
    );
}



