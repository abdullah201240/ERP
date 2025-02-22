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

// Define Interface for unit
interface unit {
    id: number;
    name: string;
}
interface ProductunitTableProps {
    reload: boolean;
}
const ProductunitTable: React.FC<ProductunitTableProps> = ({ reload }) => {
    const [units, setunits] = useState<unit[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editunit, setEditunit] = useState<unit | null>(null);
    const [editedName, setEditedName] = useState<string>("");
    const router = useRouter();

    const [user, setUser] = useState({ name: '', email: '', id: '',sisterConcernId: '' });


    useEffect(() => {
      // Retrieve the access token from localStorage
      const token = localStorage.getItem('accessTokenpq');
      // Check if the token exists
      if (!token) {
        router.push('/'); // Redirect to login page if token doesn't exist
      } else {
        // Fetch user profile data from the API
        fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
          headers: {
            'Authorization': token
          }
        })
     
          .then(res => res.json())
          .then(data => {
            if (data) {
  
              setUser({ name: data.data.name, email: data.data.email, id: data.data.id , sisterConcernId: data.data.sisterConcernId });
  
  
            }
          })
          .catch(err => {
            console.error('Error fetching user data:', err);
            router.push('/'); // Redirect to login page in case of any error
          });
      }
    }, [router]);


    const fetchunits = useCallback(async () => {

        try {
            const token = localStorage.getItem('accessTokenpq');
            if (!token) {
                router.push('/'); // Adjust the path to your login page
                return; // Exit the function early
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/unit/${user.sisterConcernId}`, {
                headers: {
                    'Authorization': token,

                },
            }); // Replace with your actual API endpoint
            if (!response.ok) throw new Error("Failed to fetch categories");
            const result = await response.json(); // Parse the response JSON

            // Check if the response has a `data` field and it is an array
            if (result.data && Array.isArray(result.data)) {
                setunits(result.data); // Set the categories from the `data` field
            } else {
                console.error("Expected an array of categories inside 'data', but got:", result);
                setunits([]); // Default to an empty array if the structure is incorrect
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setunits([]); // Default to an empty array in case of error
        }
    }, [router,user]);
    useEffect(() => {
        fetchunits();
    }, [reload, fetchunits]);

    // Handle delete
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const token = localStorage.getItem('accessTokenpq');
            if (!token) {
                router.push('/'); // Adjust the path to your login page
                return; // Exit the function early
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/unit/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,

                },
            });

            if (!response.ok) throw new Error("Failed to delete unit");

            setunits(units.filter(cat => cat.id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error("Error deleting unit:", error);
        }
    };

    // Handle edit
    const handleEdit = (unit: unit) => {
        setEditunit(unit);
        setEditedName(unit.name);
    };

    // Save updated unit
    const saveEdit = async () => {
        if (!editunit) return;
        try {
            const token = localStorage.getItem('accessTokenpq');
            if (!token) {
                router.push('/'); // Adjust the path to your login page
                return; // Exit the function early
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/unit/${editunit.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: editedName }),
            });

            if (!response.ok) throw new Error("Failed to update unit");

            setunits(units.map(cat => cat.id === editunit.id ? { ...cat, name: editedName } : cat));
            setEditunit(null);
        } catch (error) {
            console.error("Error updating unit:", error);
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
                    {units.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>
                                No units Found
                            </TableCell>
                        </TableRow>
                    ) : (
                        units.map((unit, index) => (
                            <TableRow key={unit.id} className='text-center'>
                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                <TableCell className='border border-[#e5e7eb]'>{unit.name}</TableCell>
                                <TableCell className='border border-[#e5e7eb] flex items-center justify-center gap-4'>
                                    <FaEdit
                                        onClick={() => handleEdit(unit)}
                                        className='opacity-50 cursor-pointer text-xl'
                                    />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <RiDeleteBin6Line
                                                className='opacity-50 cursor-pointer text-xl'
                                                onClick={() => setDeleteId(unit.id)}
                                            />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this unit? This action cannot be undone.
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

            {/* Edit unit Dialog */}
            {editunit && (
                <Dialog open={!!editunit} onOpenChange={() => setEditunit(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit unit</DialogTitle>
                        </DialogHeader>
                        <Input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditunit(null)}>Cancel</Button>
                            <Button onClick={saveEdit}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
export default ProductunitTable;