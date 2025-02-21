import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";

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
            <main className="flex flex-col items-center text-center px-6 py-12 mt-16">
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
            {/* How It Works Section */}
            <section className="w-10/12 mt-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Description on the Left */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">How It Works</h2>
                        <p className="text-lg">
                            Simply complete your Profile, and find your match for the skill You want to Learn and the skill you will teach, With our platform we make it easey for you to find mentors and and guide others as well all the meanewhile learning a new Skill.
                        </p>
                        <p className="text-lg">
                            Discover an unprecedented fusion of simplicity and power, designed to cater to
                            creative minds at all levels.
                        </p>
                        <button
                            className="px-6 py-3 bg-teal-500 text-black font-bold rounded-full hover:bg-teal-300 transition duration-300"
                            onClick={() => navigate('/GetStarted')}
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Video on the Right */}
                    <div className="bg-gray-700 rounded-lg overflow-hidden shadow-lg justify-self-end">
                        <video
                            className="w-full h-40 md:h-80"
                            src="/assets/demo.mp4" // Replace with your video URL
                            title="How It Works"
                            autoPlay // Autoplay the video
                            loop // Loop the video endlessly
                            muted // Mute the video to allow autoplay
                            playsInline // Ensure the video plays inline on mobile devices
                        ></video>
                    </div>
                </div>
            </section>
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
                        <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
                        <p className="text-sm text-white">
                            Join a vibrant community of learners and mentors who are passionate about growth.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-700 text-cyan-400 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
                        <p className="text-sm text-white">
                            Learn at your own pace and on your own terms, anytime, anywhere.
                        </p>
                    </div>
                </div>
            </section>


            {/* About Us Section */}
            <section className="w-full mt-20 px-6 text-center">
                <h2 className="text-3xl font-bold">About Us</h2>
                <p className="mt-4 text-lg max-w-3xl mx-auto">
                    Skill Swap was founded with the mission to make learning accessible and collaborative. We believe that everyone has something to teach and something to learn. Join us in building a world where knowledge is shared freely.
                </p>
            </section>



            {/* Contact Us Section */}
            <section className="w-full mt-20 text-center">
      

     
      <div className="w-full mt-12 bg-gray-800 py-8 px-6 rounded-lg shadow-lg flex row justify-around">
        <div className="left self-center">
        <h2 className="text-3xl font-bold text-gray-100">Contact Us</h2>
        <p className="mt-4 text-lg text-gray-300">Have questions or feedback? Reach out to us!</p>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mt-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 text-3xl hover:text-blue-400">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-3xl hover:text-blue-300">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 text-3xl hover:text-pink-400">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 text-3xl hover:text-blue-600">
            <FaLinkedin />
          </a>
          <a href="mailto:support@skillswap.com" className="text-gray-300 text-3xl hover:text-gray-200">
            <FaEnvelope />
          </a>
        </div>
        </div>

        {/* Contact Form */}
        <div className="mt-4 max-w-lg">
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
            <textarea
              placeholder="Your Message"
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
              rows="4"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-3 rounded-lg font-bold hover:bg-indigo-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>


            {/* Footer */}
            <footer className="w-full py-6 bg-blue-700 text-center">
                <p className="text-sm">
                    © {new Date().getFullYear()} Skill Swap. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;