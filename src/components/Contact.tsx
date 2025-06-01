import React from 'react';
import { Instagram, Twitter, Github, MessageCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/vanshjainxd',
      color: 'hover:text-pink-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/vanshjainxd',
      color: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/VANSHJAIN-exe',
      color: 'hover:text-gray-800'
    },
    {
      name: 'Discord',
      icon: MessageCircle,
      url: 'https://discord.com/users/vanshjainxd',
      color: 'hover:text-indigo-500'
    }
  ];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black tracking-tight mb-6">Contact Me</h2>
        <p className="text-xl text-black/50 font-light">Let's connect and create something amazing together</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all"
          >
            <div className={`w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-4 transition-colors ${link.color}`}>
              <link.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{link.name}</h3>
            <p className="text-black/50 text-sm">Follow me on {link.name}</p>
          </a>
        ))}
      </div>
    </div>
  );
}; 