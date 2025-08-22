import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Home,
  Settings,
  BarChart3,
  LogIn,
  ArrowUp,
  Heart
} from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/", icon: Home },
        { name: "Features", href: "/features", icon: Settings },
        { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
        { name: "Login", href: "/login", icon: LogIn },
      ]
    }
  ];

  const contactInfo = [
    { 
      icon: Mail, 
      text: "support@campuspass.com",
      href: "mailto:support@campuspass.com"
    },
    { 
      icon: Phone, 
      text: "+91-98765-43210",
      href: "tel:+919876543210"
    },
    { 
      icon: MapPin, 
      text: "Hyderabad, India",
      href: "https://maps.google.com/?q=Hyderabad,India"
    }
  ];

  const socialLinks = [
    { 
      icon: Facebook, 
      href: "#", 
      label: "Facebook",
      hoverColor: "hover:text-blue-500"
    },
    { 
      icon: Twitter, 
      href: "#", 
      label: "Twitter",
      hoverColor: "hover:text-sky-400"
    },
    { 
      icon: Instagram, 
      href: "#", 
      label: "Instagram",
      hoverColor: "hover:text-pink-500"
    },
    { 
      icon: Linkedin, 
      href: "#", 
      label: "LinkedIn",
      hoverColor: "hover:text-blue-600"
    }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Subtle Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                Campus
                <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
                  Pass
                </span>
              </h2>
              
              <p className="text-gray-300 leading-relaxed max-w-sm">
                Empowering safe, verified, and smart campus movement for students through innovative technology.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Secure Platform</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up animation-delay-200">
            <h3 className="text-xl font-semibold mb-6 text-gray-100">
              Quick Links
            </h3>
            
            <nav className="space-y-4">
              {footerSections[0].links.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="group flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1"
                  >
                    <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{link.name}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="animate-fade-in-up animation-delay-400">
            <h3 className="text-xl font-semibold mb-6 text-gray-100">
              Get in Touch
            </h3>
            
            <div className="space-y-4">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <a
                    key={index}
                    href={contact.href}
                    className="group flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">{contact.text}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="animate-fade-in-up animation-delay-600">
            <h3 className="text-xl font-semibold mb-6 text-gray-100">
              Stay Connected
            </h3>
            
            {/* Social Links */}
            <div className="flex gap-3 mb-8">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`group w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg ${social.hoverColor} hover:bg-gray-700`}
                  >
                    <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <p className="text-sm text-gray-300 font-medium">
                Get updates & news
              </p>
              
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>© {currentYear} CampusPass. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-400 animate-pulse" /> in India
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="/privacy" 
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Privacy Policy
            </a>
            
            <a 
              href="/terms" 
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Terms of Service
            </a>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="group w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;