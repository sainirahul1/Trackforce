import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Facebook, Twitter, Linkedin, Github, Mail, Globe, Cpu } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Analytics', href: '#' },
        { name: 'Security', href: '#' },
        { name: 'Enterprise', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#' },
        { name: 'Customers', href: '#' },
        { name: 'Contact', href: '#' },
        { name: 'Support', href: '#' },
      ]
    },
    {
      title: 'Portals',
      links: [
        { name: 'Super Admin', path: '/login' },
        { name: 'Tenant Admin', path: '/login' },
        { name: 'Manager', path: '/login' },
        { name: 'Employee', path: '/login' },
      ]
    }
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16">
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-main rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                <ShieldCheck size={24} />
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-gray-900 dark:text-white">TrackForce</span>
            </Link>
            <p className="max-w-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              The next-generation field workforce tracking SaaS platform. 
              Real-time monitoring, advanced analytics, and enterprise scale.
            </p>
            <div className="flex items-center space-x-4">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-main hover:bg-primary-main/5 dark:hover:bg-primary-main/10 transition-all border border-transparent hover:border-primary-main/10"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.path ? (
                      <Link to={link.path} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-main transition-colors">
                        {link.name}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-main transition-colors">
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-center md:text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            © {currentYear} TrackForce SaaS Platform • All Rights Reserved
          </p>
          <div className="flex items-center space-x-8">
            <a href="#" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
