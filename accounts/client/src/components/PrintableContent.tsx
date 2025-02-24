'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import Image from 'next/image';
import { toWords } from 'number-to-words';

interface Material {
    id: number;
    brand: string;
    brandModel: string;
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
    sisterConcernId: string;
}

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
    materialList: Material[];
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
    logo: string;
}

export default function PrintableContent() {
    const searchParams = useSearchParams();
    const [drawings, setDrawings] = useState<Drawing | null>(null);
    const [subject, setSubject] = useState('');
    const [termsCondition, setTermsCondition] = useState('');
    const [includeVAT, setIncludeVAT] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

    useEffect(() => {
        const drawingsParam = searchParams.get('drawings');
        const subjectParam = searchParams.get('subject');
        const termsConditionParam = searchParams.get('termsCondition');
        const includeVATParam = searchParams.get('includeVAT');
        const employeeDetailsParam = searchParams.get('employeeDetails');

        if (drawingsParam) {
            setDrawings(JSON.parse(drawingsParam));
        }
        if (subjectParam) {
            setSubject(subjectParam);
        }
        if (termsConditionParam) {
            setTermsCondition(termsConditionParam);
        }
        if (includeVATParam) {
            setIncludeVAT(includeVATParam === 'true');
        }
        if (employeeDetailsParam) {
            setEmployeeDetails(JSON.parse(employeeDetailsParam));
        }
    }, [searchParams]);

    const totalAmount = drawings?.materialList?.reduce((total, item) => {
        const itemTotalPrice = parseFloat(item.mrpPrice || "0") * parseFloat(item.itemQuantity || "0");
        return total + itemTotalPrice;
    }, 0) || 0;
    const vatAmount = totalAmount * 0.075;  // 7.5% VAT
    const grandTotal = totalAmount + vatAmount;
    const grandTotalInWords = toWords(grandTotal).replace(/,/g, ''); // Clean commas if any
    const totalInWordsWithoutVAT = toWords(totalAmount).replace(/,/g, ''); // Total without VAT in words

    return (
        <div>
            <div className="bg-white p-4 md:p-12 shadow rounded">
                <div className="flex justify-end mt-4">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL_ADMIN}uploads/${employeeDetails?.logo}`}
                        alt="Logo"
                        width={100}
                        height={100}
                    />
                </div>
                <p> Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} </p>
                <p>To</p>
                <p>{drawings?.clientName || "No Client Name"}</p>
                <p>{drawings?.projectAddress || "No Project Address"}</p>
                <p className='mt-8'>Subject: {subject} </p>

                <Table className='mt-12'>
                    <TableHeader className='bg-[#2A515B] text-white'>
                        <TableRow className='text-center'>
                            <TableHead className='text-white text-center'>SI. No.</TableHead>
                            <TableHead className='text-white text-center'>DESCRIPTION OF ITEMS</TableHead>
                            <TableHead className='text-white text-center'>Total Amount (Tk)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className='text-center border border-[#e5e7eb]'>1</TableCell>
                            <TableCell className='text-center border border-[#e5e7eb]'>{drawings?.category}</TableCell>
                            <TableCell className='text-center border border-[#e5e7eb]'>{drawings?.materialList?.reduce((total, item) => total + parseFloat(item.mrpPrice || "0"), 0).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} className='text-right border border-[#e5e7eb]'>Total Amount in Tk.</TableCell>
                            <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>{drawings?.materialList?.reduce((total, item) => total + parseFloat(item.mrpPrice || "0"), 0).toFixed(2)}</TableCell>
                        </TableRow>
                        {includeVAT && (
                            <TableRow>
                                <TableCell colSpan={2} className='text-right border border-[#e5e7eb]'>VAT @ 7.5%</TableCell>
                                <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>{vatAmount.toFixed(2)}</TableCell>
                            </TableRow>
                        )}
                        {includeVAT && (
                            <TableRow>
                                <TableCell colSpan={2} className='text-right border border-[#e5e7eb]'>Grand Total in Tk.</TableCell>
                                <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>{grandTotal.toFixed(2)}</TableCell>
                            </TableRow>
                        )}
                        {!includeVAT && (
                            <TableRow>
                                <TableCell colSpan={2} className='text-right border border-[#e5e7eb]'>Grand Total in Tk.</TableCell>
                                <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>{totalAmount.toFixed(2)}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {!includeVAT && (
                    <div className="mt-8 text-left">
                        <p className="font-semibold">In-words : {totalInWordsWithoutVAT}</p>
                    </div>
                )}

                {includeVAT && (
                    <div className="mt-8 text-left">
                        <p className="font-semibold">In-words : {grandTotalInWords}</p>
                    </div>
                )}

                <p className='mt-12 font-semibold'>Terms & Conditions:</p>
                <div className="terms-condition mt-4 p-4 border rounded-md bg-gray-100">
                    <div dangerouslySetInnerHTML={{ __html: termsCondition }} />
                </div>

                <Table className='mt-12'>
                    <TableHeader className='bg-[#2A515B] text-white'>
                        <TableRow className='text-center'>
                            <TableHead className='text-white text-center'>SI. No.</TableHead>
                            <TableHead className='text-white text-center'>Items</TableHead>
                            <TableHead className='text-white text-center'>Brand Model</TableHead>
                            <TableHead className='text-white text-center'>Quantity</TableHead>
                            <TableHead className='text-white text-center'>Unit</TableHead>
                            <TableHead className='text-white text-center'>Price (Tk)</TableHead>
                            <TableHead className="text-white text-center">Total Price (Tk)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {drawings?.materialList?.map((item, index) => {
                            const totalPrice = parseFloat(item.mrpPrice || "0") * (parseFloat(item.itemQuantity || "0"));
                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="text-center border border-[#e5e7eb]">{index + 1}</TableCell>
                                    <TableCell className="text-center border border-[#e5e7eb]">{item.productName}</TableCell>
                                    <TableCell className="text-center border border-[#e5e7eb]">{item.brandModel}</TableCell>
                                    <TableCell className="text-center border border-[#e5e7eb]">{item.itemQuantity}</TableCell>
                                    <TableCell className="text-center border border-[#e5e7eb]">{item.unit}</TableCell>
                                    <TableCell className="text-center border border-[#e5e7eb]">{item.mrpPrice}</TableCell>
                                    <TableCell className="text-center border border-[#e5e7eb]">{totalPrice.toFixed(2)}</TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow>
                            <TableCell colSpan={6} className="text-right border border-[#e5e7eb]">Total Amount</TableCell>
                            <TableCell className="text-center border border-[#e5e7eb]">
                                {drawings?.materialList?.reduce((total, item) => total + (parseFloat(item.mrpPrice || "0") * parseFloat(item.itemQuantity || "0")), 0).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}