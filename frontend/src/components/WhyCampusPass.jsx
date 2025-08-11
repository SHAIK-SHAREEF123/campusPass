import React from 'react';
import { ShieldCheck, Clock, Smartphone, QrCode } from 'lucide-react';

const WhyCampusPass = () => {
  const benefits = [
    {
      title: 'Real-Time Tracking',
      description: 'Track student outpass status and location instantly with live updates.',
      icon: <Clock className="h-10 w-10 text-blue-600" />,
    },
    {
      title: 'One-Tap Approvals',
      description: 'Parents and wardens can approve or reject requests in just one click.',
      icon: <Smartphone className="h-10 w-10 text-amber-600" />,
    },
    {
      title: 'Digital Verification',
      description: 'QR-based verification ensures authentic gate passes and reduces fraud.',
      icon: <QrCode className="h-10 w-10 text-purple-600" />,
    },
    {
      title: 'Safe & Secure',
      description: 'Role-based access, encrypted communication, and secure login for all users.',
      icon: <ShieldCheck className="h-10 w-10 text-green-600" />,
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Why Choose <span className="text-blue-600">CampusPass?</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          CampusPass is designed to simplify, secure, and speed up the outpass approval process for students, parents, and caretakers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyCampusPass;