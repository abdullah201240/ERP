import React from 'react';
import Image from 'next/image';
import Logo from '@/app/assets/img/Logo.webp';

export default function Page() {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="container px-4 mx-auto">
                <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32">
                            <Image
                                src={Logo}
                                alt="Logo"
                                className="w-full h-full object-contain"
                                width={128}
                                height={128}
                                priority
                            />
                        </div>
                    </div>
                    <form action="/dashboard">
                        <h1 className="text-gray-800 text-xl font-semibold text-center mb-6 max-w-full mx-auto">
                            Enter your User ID and Password to login to the Portal
                        </h1>
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">Email</label>
                            <input 
                                className="w-full p-4 text-lg font-semibold placeholder-gray-500 bg-white border-2 border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300" 
                                type="email" 
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold text-gray-700" htmlFor="password">Password</label>
                            <input 
                                className="w-full p-4 text-lg font-semibold placeholder-gray-500 bg-white border-2 border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300" 
                                type="password" 
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2"/>
                                <span className="font-semibold text-gray-700">Remember me</span>
                            </label>
                            <a className="text-indigo-600 hover:underline text-sm font-semibold" href="#">Forgot your password?</a>
                        </div>
                        <button 
                            className="w-full py-4 px-6 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-md transition duration-200"
                        >
                            Sign in
                        </button>
                        
                    </form>
                </div>
            </div>
        </div>
    );
}
