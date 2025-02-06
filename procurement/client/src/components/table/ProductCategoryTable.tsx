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
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';

// Define Interface for Category
interface Category {
    id: number;
    name: string;
}
interface ProductCategoryTableProps {
    reload: boolean;
}
const ProductCategoryTable: React.FC<ProductCategoryTableProps> = ({ reload }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [editedName, setEditedName] = useState<string>("");
    const router = useRouter();

    // Fetch categories from API


    const fetchCategories = useCallback(async () => {

        try {
            const token = localStorage.getItem('accessTokenpq');
            if (!token) {
                router.push('/'); // Adjust the path to your login page
                return; // Exit the function early
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/category`, {
                headers: {
                    'Authorization': token,

                },
            }); // Replace with your actual API endpoint
            if (!response.ok) throw new Error("Failed to fetch categories");
            const result = await response.json(); // Parse the response JSON

            // Check if the response has a `data` field and it is an array
            if (result.data && Array.isArray(result.data)) {
                setCategories(result.data); // Set the categories from the `data` field
            } else {
                console.error("Expected an array of categories inside 'data', but got:", result);
                setCategories([]); // Default to an empty array if the structure is incorrect
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]); // Default to an empty array in case of error
        }
    }, [router]);
    useEffect(() => {
        fetchCategories();
    }, [reload, fetchCategories]);
    // Handle delete
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const token = localStorage.getItem('accessTokenpq');
            if (!token) {
                router.push('/'); // Adjust the path to your login page
                return; // Exit the function early
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/category/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,

                },
            });

            if (!response.ok) throw new Error("Failed to delete category");

            setCategories(categories.filter(cat => cat.id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    // Handle edit
    const handleEdit = (category: Category) => {
        setEditCategory(category);
        setEditedName(category.name);
    };

    // Save updated category
    const saveEdit = async () => {
        if (!editCategory) return;
        try {
            const token = localStorage.getItem('accessTokenpq');
            if (!token) {
                router.push('/'); // Adjust the path to your login page
                return; // Exit the function early
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/category/${editCategory.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: editedName }),
            });

            if (!response.ok) throw new Error("Failed to update category");

            setCategories(categories.map(cat => cat.id === editCategory.id ? { ...cat, name: editedName } : cat));
            setEditCategory(null);
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    return (
        <div>
            <Table>
                <TableHeader className='bg-[#2A515B] text-white '>
                    <TableRow className='text-center'>
                        <TableHead className='text-white text-center'>SI. No.</TableHead>
                        <TableHead className='text-white text-center'>Name</TableHead>
                        <TableHead className='text-white text-center'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>
                                No Categories Found
                            </TableCell>
                        </TableRow>
                    ) : (
                        categories.map((category, index) => (
                            <TableRow key={category.id} className='text-center'>
                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{category.name}</TableCell>
                                <TableCell className='border border-[#e5e7eb] flex items-center justify-center gap-4'>
                                    <FaEdit
                                        onClick={() => handleEdit(category)}
                                        className='opacity-50 cursor-pointer text-xl'
                                    />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <RiDeleteBin6Line
                                                className='opacity-50 cursor-pointer text-xl'
                                                onClick={() => setDeleteId(category.id)}
                                            />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this category? This action cannot be undone.
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
                </TableBody>
            </Table>

            {/* Edit Category Dialog */}
            {editCategory && (
                <Dialog open={!!editCategory} onOpenChange={() => setEditCategory(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                        </DialogHeader>
                        <Input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditCategory(null)}>Cancel</Button>
                            <Button onClick={saveEdit}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
export default ProductCategoryTable;