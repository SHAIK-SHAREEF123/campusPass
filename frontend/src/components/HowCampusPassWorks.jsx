import React from 'react'

function HowCampusPassWorks() {
    return (
        <>
            <section className="py-20 bg-gradient-to-br from-purple-900 to-purple-950 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-extrabold text-center mb-16 text-purple-300 drop-shadow">
                        How CampusPass Works
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        {/* Step 1 */}
                        <div className="p-6 bg-purple-800 bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            <img
                                src="form.svg"
                                alt="Student filling out a form"
                                className="w-40 h-40 mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-bold mb-2 text-purple-200">Request Outpass</h3>
                            <p className="text-sm text-purple-100">
                                The student fills out and submits an outpass request via the CampusPass platform using mobile or laptop.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="p-6 bg-purple-800 bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            <img
                                src="approve.svg"
                                alt="Parent and Warden Approval"
                                className="w-40 h-40 mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-bold mb-2 text-purple-200">Approval by Parent & Warden</h3>
                            <p className="text-sm text-purple-100">
                                Parent and Warden receive a notification and approve the outpass digitally through their mobile devices.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="p-6 bg-purple-800 bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            <img
                                src="exit.svg"
                                alt="Student leaves with verified outpass"
                                className="w-40 h-40 mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-bold mb-2 text-purple-200">Leave with Outpass</h3>
                            <p className="text-sm text-purple-100">
                                Once approved, the student gets a digital outpass and can exit the campus after verification at the gate.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HowCampusPassWorks