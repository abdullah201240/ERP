'use client';
import React, {  useState } from 'react';
import Image from 'next/image';
import Logo from '@/app/assets/img/Logo.png';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
   

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Success - Redirect or show success message
                toast.success('Login successful');

                localStorage.setItem('accessTokenAccounts', data.data.accessToken);


                router.push('/dashboard');

            } else {
                toast.error('Invalid email or password');
            }
        } catch (error) {
            if (error)
                toast.error('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

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
                    <form onSubmit={handleLogin}>
                        <h1 className="text-gray-800 text-xl font-semibold text-center mb-6 max-w-full mx-auto">
                            Enter your User ID and Password to login to the Portal
                        </h1>
                        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">Email</label>
                            <input
                                className="w-full p-4 text-lg font-semibold placeholder-gray-500 bg-white border-2 border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold text-gray-700" htmlFor="password">Password</label>
                            <input
                                className="w-full p-4 text-lg font-semibold placeholder-gray-500 bg-white border-2 border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="font-semibold text-gray-700">Remember me</span>
                            </label>
                            <a className="text-indigo-600 hover:underline text-sm font-semibold" href="#">Forgot your password?</a>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 px-6 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-md transition duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                    {loading && (
                        <div className="flex justify-center mt-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div> {/* Tailwind CSS Spinner */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
