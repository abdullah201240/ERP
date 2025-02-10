'use client';
import React, { useEffect, useState } from 'react';
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
import { FaEdit } from "react-icons/fa";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

interface Product {
    id: number;
    name: string;
    brand: string;
    countryOfOrigin: string;
    category: string;
    supplierProductCode: string;
    sizeAndDimension: string;
    ourProductCode: string;
    mrpPrice: string;
    discountPercentage: string;
    discountAmount: string;
    sourcePrice: string;
    unit: string;
    product_category: string;

}

export default function ProductTable() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessTokenpq') : null;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
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
    useEffect(() => {
        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            const fetchProducts = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/product/${user.sisterConcernId}?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`, {
                        headers: {
                            'Authorization': token
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch products');
                    }
                    const data = await response.json();
                    console.log(data.data);

                    if (data.success && Array.isArray(data.data.products)) {
                        setProducts(data.data.products);
                        setTotalProducts(data.data.totalProducts);
                    } else {
                        throw new Error('Fetched data is not in expected format');
                    }
                } catch (err) {
                    setError((err as Error).message);
                } finally {
                    setLoading(false);
                }
            };

            fetchProducts();
        }
    }, [router, token, currentPage, searchQuery,user]); // Add searchQuery to dependencies

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };
    const handleDelete = async () => {
        if (deleteId === null) return;

        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/product/${deleteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete project');
                }

                setProducts(prevProjects => prevProjects.filter(product => product.id !== deleteId));
            } catch (err) {
                setError((err as Error).message);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (products.length === 0) {
        return <div>No products found</div>;
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border p-2 mb-4"
            />
            <Table>
                <TableHeader className='bg-[#2A515B] text-white'>
                    <TableRow className='text-center'>
                        <TableHead className='text-white text-center'>SI. No.</TableHead>
                        <TableHead className='text-white text-center'>Product Name</TableHead>
                        <TableHead className='text-white text-center'>Supplier Product Code</TableHead>

                        <TableHead className='text-white text-center'>Our Product Code</TableHead>



                        <TableHead className='text-white text-center'>Brand</TableHead>
                        <TableHead className='text-white text-center'>Country of Origin</TableHead>
                        <TableHead className='text-white text-center'>Category</TableHead>
                        <TableHead className='text-white text-center'>MRP Price</TableHead>
                        <TableHead className='text-white text-center'>Discount (%)</TableHead>
                        <TableHead className='text-white text-center'>Discount Amount</TableHead>
                        <TableHead className='text-white text-center'>Source Price</TableHead>
                        <TableHead className='text-white text-center'>Unit</TableHead>
                        <TableHead className='text-white text-center'>Product Category</TableHead>



                        <TableHead className='text-white text-center'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow key={product.id} className='text-center'>
                            <TableCell className='text-center border border-[#e5e7eb]'>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{product.name}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{product.supplierProductCode}</TableCell>

                            <TableCell className='border border-[#e5e7eb]'>{product.ourProductCode}</TableCell>


                            <TableCell className='border border-[#e5e7eb]'>{product.brand}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{product.countryOfOrigin}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{product.category}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{product.mrpPrice}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{product.discountPercentage}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{product.discountAmount}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{product.sourcePrice}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{product.unit}</TableCell>
                            <TableCell className='border border-[#e5e7eb]'>{product.product_category}</TableCell>


                            <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>

                                <Link href={`editProducts/${product.id}`}>
                                    <FaEdit

                                        className='mr-8 opacity-50 cursor-pointer'
                                    />

                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <RiDeleteBin6Line
                                            className='opacity-50 cursor-pointer'
                                            onClick={() => setDeleteId(product.id)}
                                        />
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm product Deletion</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this product? This action cannot be undone, and the project will be permanently removed from the system.
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
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-end mt-4">
                <p className="mx-4 mt-2 text-lg font-semibold text-gray-700"> <span className='font-normal'> Page </span> {currentPage} <span className='font-normal'> of </span> {totalPages}</p>
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="bg-[#2A515B] text-white p-2 rounded-lg shadow hover:bg-[#2A515B] transition duration-200 ease-in-out disabled:opacity-50 flex items-center mr-4"
                >
                    <FaArrowLeft className="mr-2" />
                </button>

                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-[#2A515B] text-white p-2 rounded-lg shadow hover:bg-[#2A515B] transition duration-200 ease-in-out disabled:opacity-50 flex items-center"
                >
                    <FaArrowRight className="ml-2" />
                </button>
            </div>
        </div>
    );
}