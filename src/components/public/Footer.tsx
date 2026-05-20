import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-white text-lg">
                Aaradhya <span className="text-blue-400">IT</span> Solutions
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Your partner in retail automation and enterprise hardware solutions.
              Empowering Goa's businesses with cutting-edge technology since 2014.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>
              
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 border border-gray-600 hover:border-gray-400 text-gray-300 text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <Phone size={15} />
                Call Us
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Products', path: '/products' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact Us', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Phone size={14} className="mt-0.5 shrink-0 text-blue-400" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Mail size={14} className="mt-0.5 shrink-0 text-blue-400" />
                contact@aaradhya-it.com
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={14} className="mt-0.5 shrink-0 text-blue-400" />
                Boarda, Margao, Goa, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © 2024 Aaradhya IT Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer