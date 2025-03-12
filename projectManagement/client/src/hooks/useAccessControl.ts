import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Access {
    id: number;
    employee_id: number;
    permission_id: number;
    createdAt: string;
    updatedAt: string;
}

// Cache for storing access data to avoid redundant API calls
const accessCache = new Map<number, Access[]>();

export const useAccessControl = () => {
    const [accessData, setAccessData] = useState<Access[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchAccess = useCallback(async (employeeId: number) => {
        // Cancel any ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Check cache first
        if (accessCache.has(employeeId)) {
            setAccessData(accessCache.get(employeeId)!);
            return;
        }

        setIsLoading(true);
        setError(null);

        abortControllerRef.current = new AbortController();

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL_ADMIN}access/view-all/${employeeId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: abortControllerRef.current.signal,
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch access data: ${response.statusText}`);
            }

            const data = await response.json();
            const accessList = data.data || [];

            // Update cache
            accessCache.set(employeeId, accessList);
            setAccessData(accessList);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
         } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [router]);

    // Clear cache and abort ongoing requests on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            accessCache.clear();
        };
    }, []);

    return { accessData, fetchAccess, isLoading, error };
};