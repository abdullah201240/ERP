'use client';
import React, { useEffect } from 'react'
import CreateEmployee from '@/components/CreateEmployee'
import { useRouter } from 'next/navigation';


export default function Home() {
    const router = useRouter();

    useEffect(() => {
       
        const storedToken = localStorage.getItem('accessTokenCompany');
        if (!storedToken) {
            router.push('/');
        } 
    
}, [router]);
  return (
    <div>
        <CreateEmployee/>
      
    </div>
  )
}
