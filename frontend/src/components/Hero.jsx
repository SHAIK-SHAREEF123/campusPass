import React from 'react'

function Hero() {
    return (
        <>
            <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-8 py-16 bg-gradient-to-br from-black via-purple-900 to-black text-white relative overflow-hidden">
                {/* Text Content */}
                <div className="md:w-1/2 text-center md:text-left space-y-6 z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-purple-300 drop-shadow-lg leading-tight">
                        THE ULTIMATE HOSTEL OUTPASS SYSTEM
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-300 max-w-xl mx-auto md:mx-0">
                        Say goodbye to paperwork. CampusPass is your smart, secure, and seamless way to manage hostel outpasses.
                    </p>
                    <button className="mt-4 px-8 py-4 bg-purple-700 hover:bg-purple-800 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-purple-700 transition-all">
                        Get Started Now 🚀
                    </button>
                </div>

                {/* Illustration or Visual */}
                <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center items-center h-full w-full">
                    <img
                        src="hostel2.jpeg"
                        alt="CampusPass illustration"
                        className="w-full max-w-[600px] h-auto rounded-xl shadow-lg transition-transform duration-500 hover:scale-105 animate-fadeIn"
                    />
                </div>



                {/* Optional gradient blur background effect */}
                <div className="absolute -top-10 -right-10 w-96 h-96 bg-purple-500 opacity-20 rounded-full filter blur-3xl z-0"></div>
            </section>
        </>
    )
}

export default Hero