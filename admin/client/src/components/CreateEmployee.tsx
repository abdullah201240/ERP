'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import EmployeeTable from './table/EmployeeTable';
import Image from 'next/image';
interface EmployeeDetails {
    name: string;
    email: string;
    password: string;
    phone: string;
    companyId: string;
    sisterConcernId: string;
    gender: string;
    dob: string;
    employeeId: string;
    photo: File | null;
}

export default function CreateEmployee() {
    const [token, setToken] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const router = useRouter();

    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails>({
        name: '',
        email: '',
        password: '',
        phone: '',
        companyId: '',
        gender: '',
        dob: '',
        employeeId: '',
        sisterConcernId: '',
        photo: null,
    });

    useEffect(() => {
       
            const storedToken = localStorage.getItem('accessTokenCompany');
            console.log(storedToken)
            if (!storedToken) {
                router.push('/');
            } else {
                setToken(storedToken);
                fetchCompanyProfile(storedToken);
            }
        
    }, [router]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const fetchCompanyProfile = async (accessToken: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}sisterConcern/auth/sisterConcern/profile`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await response.json();
             console.table(data.data)
            if (data.success) {
                setEmployeeDetails((prev) => ({
                    ...prev,
                    companyId: data.data.companyId,
                    sisterConcernId: data.data.id,
                }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEmployeeDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setEmployeeDetails((prevDetails) => ({ ...prevDetails, photo: file }));
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();
        Object.keys(employeeDetails).forEach((key) => {
            const value = employeeDetails[key as keyof EmployeeDetails];
            if (value !== null) {
                formData.append(key, value as string | Blob);
            }
        });

        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}sisterConcern/auth/signup`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            console.log(formData)

            if (!response.ok) throw new Error('Failed to create employee');
            toast.success('Employee created successfully!');
            setReloadTable((prev) => !prev);
            setEmployeeDetails({
                name: '',
                email: '',
                password: '',
                phone: '',
                companyId: '',
                gender: '',
                dob: '',
                employeeId: '',
                sisterConcernId: '',
                photo: null,
            });
            setPhotoPreview(null);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to create employee');
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) return null;

    return (
      <div>
    <div className="mx-auto max-w-6xl mt-8">
        <div className="bg-[#433878] p-8 rounded-xl shadow-lg">
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-white font-semibold mb-2">Employee Name</label>
                        <input type="text" id="name" name="name" value={employeeDetails.name} onChange={handleInputChange} placeholder="Employee Name" className="block w-full rounded-md border-gray-300 p-2 bg-gray-100" />
                    </div>
                    <div>
                        <label htmlFor="employeeId" className="block text-white font-semibold mb-2">Employee ID</label>
                        <input type="text" id="employeeId" name="employeeId" value={employeeDetails.employeeId} onChange={handleInputChange} placeholder="Employee ID" className="block w-full rounded-md border-gray-300 p-2 bg-gray-100" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-white font-semibold mb-2">Password</label>
                        <input type="password" id="password" name="password" value={employeeDetails.password} onChange={handleInputChange} placeholder="Password" className="block w-full rounded-md border-gray-300 p-2 bg-gray-100" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-white font-semibold mb-2">Email</label>
                        <input type="email" id="email" name="email" value={employeeDetails.email} onChange={handleInputChange} placeholder="Email" className="block w-full rounded-md border-gray-300 p-2 bg-gray-100" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-white font-semibold mb-2">Phone Number</label>
                        <input type="text" id="phone" name="phone" value={employeeDetails.phone} onChange={handleInputChange} placeholder="Phone Number" className="block w-full rounded-md border-gray-300 p-2 bg-gray-100" />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-white font-semibold mb-2">Gender</label>
                        <select id="gender" name="gender" value={employeeDetails.gender} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 p-2 bg-gray-100">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dob" className="block text-white font-semibold mb-2">Date of Birth</label>
                        <input type="date" id="dob" name="dob" value={employeeDetails.dob} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 p-2 bg-gray-100" />
                    </div>
                    <div>
                        <label htmlFor="photo" className="block text-white font-semibold mb-2">Upload Photo</label>
                        <input type="file" id="photo" accept="image/*" onChange={handlePhotoChange} className="block w-full p-2" />
                        {photoPreview && <Image src={photoPreview} alt="Preview" height={100} width={100} className="mt-2 w-32 h-32 object-cover rounded" />}
                    </div>
                </div>
                <button type="submit" disabled={loading} className="mt-6 block w-full border border-white text-white font-bold py-3 px-4 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors">{loading ? 'Adding Employee...' : 'Add Employee'}</button>
            </form>
        </div>
    </div>
    <EmployeeTable reload={reloadTable} />
</div>
    );
}
