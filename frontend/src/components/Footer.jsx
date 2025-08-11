import React from 'react'

function Footer() {
    return (
        <>
            <footer className="bg-gray-900 text-white px-6 py-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Logo and tagline */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Campus<span className="text-blue-500">Pass</span></h2>
                        <p className="text-gray-400">Empowering safe, verified, and smart campus movement for students.</p>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="hover:text-blue-400 transition">Home</a></li>
                            <li><a href="/features" className="hover:text-blue-400 transition">Features</a></li>
                            <li><a href="/dashboard" className="hover:text-blue-400 transition">Dashboard</a></li>
                            <li><a href="/login" className="hover:text-blue-400 transition">Login</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Contact</h3>
                        <ul className="text-gray-400 space-y-2">
                            <li>Email: support@campuspass.com</li>
                            <li>Phone: +91-98765-43210</li>
                            <li>Location: Hyderabad, India</li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4 text-gray-400">
                            <a href="#" className="hover:text-blue-500 transition"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="hover:text-blue-500 transition"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="hover:text-blue-500 transition"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="hover:text-blue-500 transition"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} CampusPass. All rights reserved.
                </div>
            </footer>

        </>
    )
}

export default Footer