import { useState } from 'react'
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle } from 'lucide-react'
import { submitInquiry } from '../../services/public/inquiriesService'

const Contact = () => {
  const [form, setForm] = useState({ name: '', business: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      setError('Name and phone number are required.')
      return
    }
    setLoading(true)
    try {
      await submitInquiry(form)
      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-3">Get In Touch</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Contact <span className="text-blue-300">Us</span>
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Have a question or need a quote? Our team is ready to help.
              Reach out via WhatsApp, phone, or fill the form below.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Reach Us Directly</h2>
              <div className="space-y-5 mb-10">
                {[
                  {
                    icon: <Phone size={20} className="text-blue-600" />,
                    label: 'Phone',
                    value: '+91 98765 43210',
                    sub: 'Mon–Sat, 9am–7pm',
                    href: 'tel:+919876543210'
                  },
                  {
                    icon: <MessageCircle size={20} className="text-green-600" />,
                    label: 'WhatsApp',
                    value: '+91 98765 43210',
                    sub: 'Usually replies within minutes',
                    href: 'https://wa.me/919876543210'
                  },
                  {
                    icon: <Mail size={20} className="text-blue-600" />,
                    label: 'Email',
                    value: 'contact@aaradhya-it.com',
                    sub: 'We reply within 24 hours',
                    href: 'mailto:contact@aaradhya-it.com'
                  },
                  {
                    icon: <MapPin size={20} className="text-blue-600" />,
                    label: 'Office',
                    value: 'Boarda, Margao, Goa',
                    sub: 'India — 403601',
                    href: 'https://maps.google.com/?q=Margao,Goa'
                  },
                ].map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="font-semibold text-gray-900">{item.value}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.sub}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Business Hours */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Business Hours</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { day: 'Monday – Friday', hours: '9:00 AM – 7:00 PM' },
                    { day: 'Saturday', hours: '10:00 AM – 5:00 PM' },
                    { day: 'Sunday', hours: 'Closed' },
                  ].map(item => (
                    <div key={item.day} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.day}</span>
                      <span className={`font-medium ${item.hours === 'Closed' ? 'text-red-500' : 'text-gray-900'}`}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Sent!</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', business: '', phone: '', message: '' }) }}
                    className="mt-6 text-blue-600 text-sm font-medium hover:underline"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Send an Enquiry</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="business"
                        value={form.business}
                        onChange={handleChange}
                        placeholder="Your business or shop name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us what you need..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : 'Send Enquiry'}
                    </button>

                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                    >
                      <MessageCircle size={18} />
                      Or Chat on WhatsApp
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Google Maps */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <iframe
              title="Aaradhya IT Solutions Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3846.123456789!2d74.0!3d15.28!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMargao%2C+Goa!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact