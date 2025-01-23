import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Header */}
            <header className="w-full flex items-center justify-between p-6 bg-transparent">
                <h1 className="text-2xl font-bold tracking-wide">
                    <span className="text-teal-300">Skill</span>Swap
                </h1>
                <nav className="space-x-6">
                    <button
                        className="px-4 py-2 bg-teal-500 text-black rounded-lg font-semibold hover:bg-teal-300 transition duration-300"
                        onClick={() => navigate('/GetStarted')}
                    >
                        Login
                    </button>
                    <button
                        className="px-4 py-2 bg-black text-teal-400 border border-teal-400 rounded-lg font-semibold hover:bg-white hover:border-transparent hover:text-black transition duration-300"
                        onClick={() => navigate('/GetStarted')}
                    >
                        Sign Up
                    </button>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="flex flex-col items-center text-center px-6 mt-16">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    Swap Skills, Grow Together.
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-3xl">
                    Skill Swap is the ultimate platform to exchange knowledge, connect with talented individuals, and learn something new. Empower your journey, one skill at a time.
                </p>
                <div className="mt-8 space-x-4">
                    <button
                        className="px-6 py-3 bg-teal-500 text-black font-bold rounded-full hover:bg-teal-300 transition duration-300"
                        onClick={() => navigate('/GetStarted')}
                    >
                        Get Started
                    </button>
                    <button
                        className="px-6 py-3 bg-transparent border border-teal-400 rounded-full font-bold hover:bg-white hover:border-transparent hover:text-black transition duration-300"
                        onClick={() => navigate('/about')}
                    >
                        Learn More
                    </button>
                </div>
            </main>

            {/* Features Section */}
            <section className="w-full mt-20 px-6 text-center space-y-12">
                <h2 className="text-3xl font-bold">Why Skill Swap?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="p-6 bg-gray-700 text-cyan-400 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">Skill Sharing</h3>
                        <p className="text-sm text-white">
                            Share your expertise and learn from others in a collaborative and supportive environment.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-700 text-cyan-400 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">Skill Sharing</h3>
                        <p className="text-sm text-white">
                            Share your expertise and learn from others in a collaborative and supportive environment.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-700 text-cyan-400 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">Skill Sharing</h3>
                        <p className="text-sm text-white">
                            Share your expertise and learn from others in a collaborative and supportive environment.
                        </p>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="w-full mt-20 py-6 bg-blue-700 text-center">
                <p className="text-sm">
                    © {new Date().getFullYear()} Skill Swap. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
