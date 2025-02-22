'use client'
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
interface ProductionWorkUpdate {
    id: number;
    workingDrawingsId: string;
    productionWorkPlansId: string;
    date: string;
    workUpdate: string;
}
interface ProductionWorkPlan {
    id: number;
    workingDrawingsId: string;
    assignee: string;

    workType: string;

    startDate: string;

    endDate: string;

    remarks: string;

    completed: string;
    employeeName: string
    productionWorkUpdate: ProductionWorkUpdate[];
    status: string


}

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const id = params?.project;
    const [drawings, setDrawings] = useState<Drawing | null>(null);
    const [productionWorkPlans, setProductionWorkPlans] = useState<ProductionWorkPlan[]>([]);




    useEffect(() => {
        const checkTokenAndFetchProfile = async () => {
            const token = localStorage.getItem('accessTokenAccounts');
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
            } catch (error) {
                console.error(error);
            }
        };

        checkTokenAndFetchProfile();
    }, [router]);
    const fetchCompanyProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessTokenAccounts');
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('accessTokenAccounts');

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            fetchCompanyProfile();
        }
    }, [router, fetchCompanyProfile]);


    const fetchDrawings = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessTokenAccounts');
            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROJECTMANAGEMENT}workingDrawing/drawing/${id}`, {
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to fetch drawings");
            const data = await response.json();

            setDrawings(data.data || null);
        } catch (error) {
            console.error("Error fetching drawings:", error);
            setDrawings(null);
        }
    }, [router, id]);

    const fetchProductionWorkPlan = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessTokenAccounts');
            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROJECTMANAGEMENT}workingDrawing/productionWorkPlan/${id}`, {
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to fetch ProductionWorkPlan");
            const data = await response.json();

            setProductionWorkPlans(data.data || null);





        } catch (error) {
            console.error("Error fetching ProductionWorkPlan:", error);
        }
    }, [router, id]);



    useEffect(() => {
        fetchDrawings();
        fetchProductionWorkPlan();
    }, [fetchDrawings, fetchProductionWorkPlan]);





    return (
        <div className="p-2 md:p-5">
            <h1 className="text-2xl font-bold mb-4">Production Work Update</h1>


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
                    <div className='mt-16 '>


                        <h1 className="mt-4 mb-8 text-lg font-semibold"> item: {drawings.itemName} </h1>

                        <Table>
                            <TableHeader className='bg-[#2A515B] text-white'>
                                <TableRow className='text-center'>
                                    <TableHead className='text-white text-center'>SI. No.</TableHead>
                                    <TableHead className='text-white text-center'>Type of work</TableHead>
                                    <TableHead className='text-white text-center'>Status</TableHead>


                                    <TableHead className='text-white text-center'>Start Date</TableHead>
                                    <TableHead className='text-white text-center'>End Date</TableHead>
                                    <TableHead className='text-white text-center'>Time Required</TableHead>
                                    <TableHead className='text-white text-center'>Time
                                        Passed</TableHead>
                                    <TableHead className='text-white text-center'>Time Remaining</TableHead>
                                    <TableHead className='text-white text-center'>Tracking</TableHead>
                                    <TableHead className='text-white text-center'>Completed</TableHead>

                                    



                                    <TableHead className='text-white text-center'>Assignee</TableHead>
                                    <TableHead className='text-white text-center'>Remarks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productionWorkPlans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className='text-center border border-[#e5e7eb]'>
                                            No Production Work Plan found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    productionWorkPlans.map((productionWorkPlan, index) => {
                                        // Calculate time required in days
                                        const startDate = new Date(productionWorkPlan.startDate);
                                        const endDate = new Date(productionWorkPlan.endDate);
                                        const currentDate = new Date();

                                        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                                        const daysPassed = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                                        const daysRemaining = Math.max((totalDays - daysPassed) + 1, 0);
                                        let tracking = "Not applicable";
                                        if (productionWorkPlan.status === "In Progress" && daysRemaining === 0) {
                                            tracking = "Over due"
                                        }
                                        if (productionWorkPlan.status === "In Progress" && daysRemaining > 0) {
                                            tracking = "On Track"
                                        }

                                        return (
                                            <TableRow key={productionWorkPlan.id} className='text-center'>
                                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{productionWorkPlan.workType}</TableCell>
                                                <TableCell className='border border-[#e5e7eb] text-center'>


                                                    {productionWorkPlan.status}

                                                </TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{productionWorkPlan.startDate}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{productionWorkPlan.endDate}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{totalDays + 1} days</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{daysPassed} days</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{daysRemaining} days</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{tracking}</TableCell>
                                                <TableCell className='border border-[#e5e7eb] text-center'>

                                                {productionWorkPlan.completed}
                                                   
                                                </TableCell>

                                               
                                                
                                                <TableCell className='border border-[#e5e7eb]'>{productionWorkPlan.employeeName}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{productionWorkPlan?.remarks}</TableCell>

                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                    </div>


                </div>
            ) : (
                <p>Loading...</p>
            )}



        </div>
    );
}