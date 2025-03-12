// useAuth.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

export const useAuth = () => {
    const router = useRouter();
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkTokenAndFetchProfile = async () => {
            // Check if the access token exists in localStorage
            const token = localStorage.getItem('accessTokenHr');

            // If the token does not exist, redirect to the login page
            if (!token) {
                router.push('/'); // Adjust the path to your login page
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    router.push('/notFound');
                    return;
                }

                const data = await response.json();
                if (data.success) {
                    setEmployeeDetails(data.data);
                } else {
                    router.push('/'); // Redirect if authentication fails
                }
            } catch (error) {
                console.error(error);
                router.push('/'); // Redirect on error
            } finally {
                setLoading(false);
            }
        };

        checkTokenAndFetchProfile();
    }, [router]);

    return { employeeDetails, loading };
};
