import React from 'react'

function Features() {
    return (
        <>
            <section className="px-6 py-20 bg-gradient-to-b from-black via-gray-900 to-purple-900 text-white">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center text-purple-300 mb-16">
                    What Makes CampusPass Powerful?
                </h2>

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {[
                        {
                            title: "Instant Outpass Requests",
                            desc: "Students submit requests and track approval status in real-time.",
                        },
                        {
                            title: "Parent & Warden Approvals",
                            desc: "Secure multi-step approval with logging and email alerts.",
                        },
                        {
                            title: "QR-Based Exit",
                            desc: "Security guards verify students via dynamic QR codes.",
                        },
                        {
                            title: "Photo Verification",
                            desc: "Capture exit photos for extra security and entry validation.",
                        },
                        {
                            title: "Analytics Dashboard",
                            desc: "Admin dashboard shows trends, exits per day, and more.",
                        },
                        {
                            title: "Multi-Hostel Support",
                            desc: "Easily manage multiple hostels with role-based access.",
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="bg-black bg-opacity-50 border border-purple-700 rounded-xl p-6 shadow-lg transform hover:scale-105 hover:shadow-purple-600 transition-all duration-300 ease-in-out"
                        >
                            <h3 className="text-2xl font-bold text-purple-400 mb-3">{feature.title}</h3>
                            <p className="text-gray-300">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Features