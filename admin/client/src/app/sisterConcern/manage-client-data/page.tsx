'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientTable from '../../../components/table/ClientTable';


export default function Home() {
  const router = useRouter();
  

  useEffect(() => {
    const checkTokenAndFetchProfile = async () => {

        const token = localStorage.getItem('accessTokenCompany');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}sisterConcern/auth/sisterConcern/profile`, {
                headers: { 'Authorization': token }
            });
            if (!response.ok) {
                router.push('/');
            }
          await response.json();
           
        } catch (error) {
            console.error(error);
        }
    };

    checkTokenAndFetchProfile();
}, [router]);

  return (
    <div>
      <div className="bg-[#F1F2F3] pl-0 mt-2">
        <h1 className="text-2xl text-black">All Client Data</h1>

        <div className="bg-white mt-8 p-4 rounded-xl">

           <div className="w-[98vw] md:w-full">
            <ClientTable />
          </div> 

        </div>
      </div>
    </div>
  );
}