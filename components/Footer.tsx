
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">OAK & IRON</h3>
            <p className="text-sm leading-relaxed">
              Exquisite wooden furniture handcrafted for the modern British home. Quality you can feel, designs you will love.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-amber-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Policies</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Return Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3"><MapPin size={16} /> 123 London Rd, London, UK</li>
              <li className="flex items-center gap-3"><Phone size={16} /> +44 20 7946 0000</li>
              <li className="flex items-center gap-3"><Mail size={16} /> support@oakandiron.co.uk</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-xs">
          <p>© {new Date().getFullYear()} Oak & Iron Furniture Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
