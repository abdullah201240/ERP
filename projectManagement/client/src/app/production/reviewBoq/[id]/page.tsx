'use client'
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from 'react-hot-toast';

interface Drawing {
    id: number;
    projectId: string;
    itemName: string;
    brandModel: string;
    category: string;
    clientName: string;
    clientContact: string;
    projectAddress: string;
    projectName: string;
    createdAt: string;
    status: string;
    itemQuantity?: string;
    itemDescription?: string;
    unit?: string;
}

interface Img {
    id: number;
    imageName: string;
    workingDrawingId: string;
}

interface Materials {
    id: number;
    brand: string;
    brandModel?: string;
    category: string;
    clientContact: string;
    clientName: string;
    countryOfOrigin: string;
    discountAmount: string;
    discountPercentage: string;
    productId: string;
    itemDescription: string;
    itemName: string;
    itemNeed: string;
    itemQuantity: string;
    mrpPrice: string;
    productName: string;
    ourProductCode: string;
    product_category: string;
    projectAddress: string;
    projectId: string;
    projectName: string;
    sourcePrice: string;
    supplierProductCode: string;
    unit: string;
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
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const [drawings, setDrawings] = useState<Drawing | null>(null);
    const [images, setImages] = useState<Img[]>([]);
    const [materialList, setMaterialList] = useState<Materials[]>([]);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<string>("");
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

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
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawing/${id}`, {
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to fetch drawings");
            const data = await response.json();

            setDrawings(data.data || null);
            setImages(data.data.images || []);
            setMaterialList(data.data.materialList || []);
        } catch (error) {
            console.error("Error fetching drawings:", error);
            setDrawings(null);
        }
    }, [router, id]);

    useEffect(() => {
        fetchDrawings();
    }, [fetchDrawings]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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


            // Send feedback and drawing ID to the API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({ feedback, drawingId: id, sisterConcernId: employeeDetails?.sisterConcernId }),
            });

            if (!response.ok) {
                throw new Error("Failed to send feedback");
            }

            toast.success('Feedback sent to the design team!'); // Show success message
            setFeedback(""); // Clear the textarea after submission
        } catch (error) {
            toast.error('Failed to send feedback. Please try again!'); // Show error message
            console.error("Error submitting feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2 md:p-5">
            <h1 className="text-2xl font-bold mb-4">Review BOQ</h1>
            {drawings ? (
                <div className="bg-white p-4 md:p-12 shadow rounded">
                    <div className="flex justify-center items-center bg-[#f0f0f0] p-2">
                        <h2 className="text-xl font-semibold">Project: {drawings.projectName}</h2>
                    </div>
                    <div className="flex justify-start items-center bg-[#D9D9D933] p-4 mt-4">
                        <h2 className="text-xl font-semibold"> {drawings.category}</h2>
                    </div>
                    <div className='mt-4'>
                        <p><strong>Item Name:</strong> {drawings.itemName}</p>
                        <p><strong>Item Description:</strong> {drawings.itemDescription}</p>
                        <p><strong>Brand Model:</strong> {drawings.brandModel}</p>
                        <p><strong>Item Quantity:</strong> {drawings.itemQuantity}</p>

                        <p><strong>Item Unit:</strong> {drawings.unit}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 mt-2">
                        {images.map(image => (
                            <div key={image.id} className="w-full h-auto">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${image.imageName}`}
                                    alt={image.imageName}
                                    className="w-full h-auto object-contain rounded"
                                    layout="responsive"
                                    width={100}
                                    height={100}
                                />
                            </div>
                        ))}
                    </div>
                    <div className='mt-16'>
                        <h1 className="mt-4 mb-8 text-lg font-semibold">{drawings.itemName} Working Drawing Material List</h1>

                        <Table>
                            <TableHeader className='bg-[#2A515B] text-white'>
                                <TableRow className='text-center'>
                                    <TableHead className='text-white text-center'>SI. No.</TableHead>

                                    <TableHead className='text-white text-center'>Product Code</TableHead>
                                    <TableHead className='text-white text-center'>Product Name</TableHead>
                                    <TableHead className='text-white text-center'>Product Category</TableHead>
                                    <TableHead className='text-white text-center'>Quantity</TableHead>
                                    <TableHead className='text-white text-center'>Total Quantity</TableHead>
                                    <TableHead className='text-white text-center'>Unit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {materialList.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className='text-center border border-[#e5e7eb]'>
                                            No Product found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    materialList.map((material, index) => (
                                        <TableRow key={material.id} className='text-center'>
                                            <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{material.ourProductCode}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{material.productName}</TableCell>

                                            <TableCell className='border border-[#e5e7eb]'>{material.product_category}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{material.itemNeed}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{Number(material.itemNeed) * Number(material.itemQuantity)}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{material.unit}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <div className="flex justify-center items-center bg-gray-50 mt-12">
                <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl mt-12 mb-12">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-lg font-semibold text-gray-700 mb-2">Write Correction Details (Revert for correction)</label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-3 bg-gray-100 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-md text-white font-semibold text-lg ${loading ? 'bg-[#FF841A] opacity-50 cursor-not-allowed' : 'bg-[#FF841A] hover:bg-[#FF6F00]'} transition duration-300`}
                        >
                            {loading ? 'Sending feedback...' : 'Send Feedback to Design Team'}
                        </button>
                    </form>
                </div>
            </div>

            <div className='mt-12 text-center'>
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-300">Purchase Req for Review</button>
            </div>
        </div>
    );
}
