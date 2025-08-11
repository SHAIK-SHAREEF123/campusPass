import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowCampusPassWorks from "../components/HowCampusPassWorks";
import WhyCampusPass from "../components/WhyCampusPass";
import Footer from "../components/Footer";

const Home = () => {
    return (

        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
            <Navbar />

            <Hero />

            <Features />

            <HowCampusPassWorks />

            <WhyCampusPass />

            {/* FOOTER */}
            <Footer />
        </div>
    );
};

export default Home;
