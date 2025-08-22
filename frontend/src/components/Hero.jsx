import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
    return (
        <>
            <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-8 py-16 bg-gradient-to-br from-black via-purple-900 to-black text-white relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 z-0">
                    {/* Main gradient orbs */}
                    <div className="absolute -top-10 -right-10 w-96 h-96 bg-purple-500 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600 opacity-15 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-500 opacity-10 rounded-full filter blur-3xl animate-pulse delay-500"></div>
                    
                    {/* Floating particles */}
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 3}s`
                            }}
                        />
                    ))}
                    
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="md:w-1/2 text-center md:text-left space-y-8 z-10 animate-fadeInUp">
                    {/* Badge */}
                    <div className="inline-block animate-fadeInDown">
                        <div className="px-6 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-full backdrop-blur-sm">
                            <span className="text-purple-300 font-semibold text-sm uppercase tracking-wider flex items-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                Live & Secure Platform
                            </span>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl xl:text-7xl font-black leading-[0.9] animate-fadeInUp delay-200">
                        <span className="block bg-gradient-to-r from-purple-200 via-purple-300 to-white bg-clip-text text-transparent drop-shadow-2xl">
                            THE ULTIMATE
                        </span>
                        <span className="block bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent mt-2">
                            HOSTEL OUTPASS
                        </span>
                        <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent mt-2 animate-pulse">
                            SYSTEM
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto md:mx-0 leading-relaxed animate-fadeInUp delay-300">
                        Say goodbye to paperwork. CampusPass is your smart, secure, and seamless way to manage hostel outpasses.
                    </p>

                    {/* CTA Button */}
                    <div className="animate-fadeInUp delay-500">
                        <button className="group relative mt-4 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-purple-700/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95">
                            {/* Button glow effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-70 transition duration-300"></div>
                            
                            {/* Button content */}
                            <span className="relative flex items-center space-x-2">
                                <Link to="/login">Get Started Now</Link>
                                <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                                    🚀
                                </div>
                            </span>
                        </button>
                        
                        {/* Trust indicators */}
                        <div className="mt-6 flex flex-wrap justify-center md:justify-start items-center space-x-6 text-gray-400">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-sm">No Setup Fee</span>
                            </div>
                            {/* <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-sm">Instant Deploy</span>
                            </div> */}
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-sm">24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Illustration/Visual */}
                <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center items-center h-full w-full z-10">
                    <div className="relative group">
                        {/* Image glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                        
                        {/* Floating rings around image */}
                        <div className="absolute -inset-8 border-2 border-purple-500/20 rounded-2xl animate-pulse"></div>
                        {/* <div className="absolute -inset-12 border border-purple-400/10 rounded-3xl animate-pulse delay-500"></div> */}
                        
                        {/* Main image container */}
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-700 hover:scale-105 group">
                            <img
                                src="hostel2.jpeg"
                                alt="CampusPass illustration"
                                className="w-full max-w-[600px] h-auto transition-all duration-700 group-hover:brightness-110"
                            />
                            
                            {/* Image overlay effects */}
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Floating UI elements */}
                            {/* <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-200">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    <span>Live System</span>
                                </div>
                            </div> */}
                            
                            {/* <div className="absolute bottom-4 left-4 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-300">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Secure</span>
                                </div>
                            </div> */}
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 border-2 border-purple-400/30 rounded-full animate-spin-slow"></div>
                        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse delay-700"></div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                    <div className="flex flex-col items-center space-y-2">
                        <span className="text-gray-400 text-sm font-medium">Scroll to explore</span>
                        <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Floating Action Buttons */}
                {/* <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden xl:flex flex-col space-y-4 z-10">
                    <div className="group relative">
                        <div className="w-12 h-12 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-purple-600/50 transition-all duration-300 hover:scale-110 cursor-pointer">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Live Demo
                        </div>
                    </div>
                    
                    <div className="group relative">
                        <div className="w-12 h-12 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-blue-600/50 transition-all duration-300 hover:scale-110 cursor-pointer">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Documentation
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="w-12 h-12 bg-pink-600/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-pink-600/50 transition-all duration-300 hover:scale-110 cursor-pointer">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Support
                        </div>
                    </div>
                </div> */}

                {/* Performance Stats - Floating */}
                {/* <div className="absolute bottom-20 left-8 hidden lg:block z-10 animate-fadeInLeft delay-1000">
                    <div className="bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 space-y-4">
                        <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            System Performance
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between space-x-4">
                                <span className="text-gray-400 text-sm">Response Time</span>
                                <span className="text-green-400 font-semibold text-sm">~0.3s</span>
                            </div>
                            <div className="flex items-center justify-between space-x-4">
                                <span className="text-gray-400 text-sm">Uptime</span>
                                <span className="text-green-400 font-semibold text-sm">99.9%</span>
                            </div>
                            <div className="flex items-center justify-between space-x-4">
                                <span className="text-gray-400 text-sm">Security</span>
                                <span className="text-blue-400 font-semibold text-sm">Enterprise</span>
                            </div>
                        </div>
                    </div>
                </div> */}
            </section>

            {/* Custom CSS for additional animations */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }

                .animate-fadeInDown {
                    animation: fadeInDown 0.6s ease-out forwards;
                }

                .animate-fadeInLeft {
                    animation: fadeInLeft 0.8s ease-out forwards;
                }

                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }

                .delay-200 {
                    animation-delay: 0.2s;
                }

                .delay-300 {
                    animation-delay: 0.3s;
                }

                .delay-500 {
                    animation-delay: 0.5s;
                }

                .delay-700 {
                    animation-delay: 0.7s;
                }

                .delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </>
    )
}

export default Hero