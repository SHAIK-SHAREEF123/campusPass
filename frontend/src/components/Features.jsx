import React from 'react'

function Features() {
    return (
        <>
            <section className="px-6 py-20 bg-gradient-to-b from-black via-gray-900 to-purple-900 text-white relative overflow-hidden"  id='features'>
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10">
                    {/* Enhanced Header */}
                    <div className="text-center mb-20">
                        <div className="inline-block mb-6">
                            <div className="px-6 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm">
                                <span className="text-purple-300 font-semibold text-sm uppercase tracking-wider">Features</span>
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-purple-300 via-purple-200 to-white bg-clip-text text-transparent">
                                What Makes CampusPass
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent animate-pulse">
                                Powerful?
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Experience the next generation of hostel management with cutting-edge features designed for modern campuses
                        </p>
                        
                        {/* Animated Underline */}
                        <div className="mt-8 flex justify-center">
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
                        </div>
                    </div>

                    {/* Enhanced Features Grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                        {[
                            {
                                title: "Instant Outpass Requests",
                                desc: "Students submit requests and track approval status in real-time.",
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                ),
                                gradient: "from-purple-500 to-pink-500"
                            },
                            {
                                title: "Parent & Warden Approvals",
                                desc: "Secure multi-step approval with logging and email alerts.",
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                                gradient: "from-blue-500 to-purple-500"
                            },
                            {
                                title: "QR-Based Exit",
                                desc: "Security guards verify students via dynamic QR codes.",
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                ),
                                gradient: "from-green-500 to-blue-500"
                            },
                            {
                                title: "Photo Verification",
                                desc: "Capture exit photos for extra security and entry validation.",
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ),
                                gradient: "from-pink-500 to-red-500"
                            },
                            {
                                title: "Analytics Dashboard",
                                desc: "Admin dashboard shows trends, exits per day, and more.",
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                ),
                                gradient: "from-yellow-500 to-orange-500"
                            },
                            {
                                title: "Multi-Hostel Support",
                                desc: "Easily manage multiple hostels with role-based access.",
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                ),
                                gradient: "from-indigo-500 to-purple-500"
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group relative"
                            >
                                {/* Background Glow Effect */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt`}></div>
                                
                                {/* Main Card */}
                                <div className="relative bg-black/60 backdrop-blur-sm border border-purple-700/50 rounded-2xl p-8 shadow-2xl transform hover:scale-105 hover:shadow-purple-600/20 transition-all duration-500 ease-out group-hover:border-purple-500/70 h-full">
                                    {/* Icon Container */}
                                    <div className="relative mb-6">
                                        <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                                            <div className="text-white">
                                                {feature.icon}
                                            </div>
                                        </div>
                                        
                                        {/* Floating Icon Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative">
                                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-purple-100 transition-all duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed text-lg">
                                            {feature.desc}
                                        </p>
                                        
                                        {/* Hover Arrow */}
                                        <div className="mt-4 flex items-center text-purple-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                                            <span className="text-sm font-medium mr-2">Learn more</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Corner Accent */}
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA Section */}
                    {/* <div className="mt-20 text-center">
                        <div className="inline-block p-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl">
                            <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Campus?</h3>
                            <p className="text-gray-300 mb-6 max-w-md mx-auto">Join thousands of institutions already using CampusPass</p>
                            <div className="flex justify-center space-x-4">
                                <div className="flex items-center space-x-2 text-purple-300">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm">Live & Secure</span>
                                </div>
                                <div className="flex items-center space-x-2 text-purple-300">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                                    <span className="text-sm">24/7 Support</span>
                                </div>
                                <div className="flex items-center space-x-2 text-purple-300">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                                    <span className="text-sm">Easy Setup</span>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>
        </>
    )
}

export default Features