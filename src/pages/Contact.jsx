import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, ArrowRight, CheckCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-white antialiased">
      {/* Navigation */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-8 lg:px-12 xl:px-16">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-lg mr-3 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">C</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 tracking-tight">
                CampusEdge
              </span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full py-24 bg-white">
        <div className="w-full px-8 lg:px-12 xl:px-16">
          <ScrollReveal animation="fadeInUp" delay={200}>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
                Get in touch
                <span className="block text-gray-600 font-bold">
                  with our team
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-16 leading-relaxed max-w-3xl mx-auto font-medium">
                Have questions about CampusEdge? We're here to help you succeed in your recruitment journey.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="w-full py-16 bg-white">
        <div className="w-full px-8 lg:px-12 xl:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <ScrollReveal animation="fadeInUp" delay={400}>
                <div className="bg-white p-10 rounded-lg border border-gray-200 shadow-lg">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h2>
                  
                  {isSubmitted && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-green-800 font-medium">Message sent successfully! We'll get back to you soon.</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="What's this about?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 ml-3" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </ScrollReveal>

              {/* Contact Information */}
              <ScrollReveal animation="fadeInUp" delay={600}>
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      We're here to help you with any questions about CampusEdge. Reach out to us through any of the channels below.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Us</h3>
                        <p className="text-gray-600 mb-2">Send us an email anytime</p>
                        <a href="mailto:chaitanyasonar339@gmail.com" className="text-indigo-600 hover:text-indigo-800 font-medium">
                          chaitanyasonar339@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Call Us</h3>
                        <p className="text-gray-600 mb-2">Mon-Fri from 9am to 6pm</p>
                        <a href="tel:+1-555-0123" className="text-indigo-600 hover:text-indigo-800 font-medium">
                          +91 8177968861 
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Visit Us</h3>
                        <p className="text-gray-600 mb-2">Our headquarters</p>
                        <address className="text-indigo-600 not-italic">
                          Jalgaon Khandesh<br />
                          India
                        </address>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h3>
                    <div className="space-y-3">
                      <Link to="/about" className="block text-gray-600 hover:text-gray-900 transition-colors font-medium">
                        About Us
                      </Link>
                      <Link to="/features" className="block text-gray-600 hover:text-gray-900 transition-colors font-medium">
                        Features
                      </Link>
                      <Link to="/pricing" className="block text-gray-600 hover:text-gray-900 transition-colors font-medium">
                        Pricing
                      </Link>
                      <Link to="/support" className="block text-gray-600 hover:text-gray-900 transition-colors font-medium">
                        Support Center
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-24 bg-gray-50">
        <div className="w-full px-8 lg:px-12 xl:px-16">
          <ScrollReveal animation="fadeInUp" delay={200}>
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 font-medium">
                Quick answers to common questions about CampusEdge
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto space-y-6">
            <ScrollReveal animation="fadeInUp" delay={400}>
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How do I get started with CampusEdge?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Simply sign up for a free account, complete your profile, and start exploring job opportunities or posting positions. Our platform is designed to be intuitive and user-friendly.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeInUp" delay={600}>
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Is CampusEdge free for students?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! CampusEdge offers a free tier for students with access to job listings, application tracking, and basic features. Premium features are available with our paid plans.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeInUp" delay={800}>
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How do I contact support?</h3>
                <p className="text-gray-600 leading-relaxed">
                  You can reach our support team through the contact form above, email us at support@campusedge.com, or call us during business hours. We typically respond within 24 hours.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-white border-t border-gray-200">
        <div className="w-full px-8 lg:px-12 xl:px-16 text-center">
          <ScrollReveal animation="fadeInUp" delay={200}>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
              Join thousands of students and hundreds of companies already using CampusEdge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center shadow-lg"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/about"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-50 border-t border-gray-200">
        <div className="w-full px-8 lg:px-12 xl:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-black rounded-lg mr-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">C</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">
                    CampusEdge
                  </span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Transforming campus recruitment with AI-powered solutions that connect students with opportunities and companies with talent.
                </p>
              </div>
              
              {/* Product Links */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Product</h3>
                <ul className="space-y-4">
                  <li><Link to="/features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</Link></li>
                  <li><Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Pricing</Link></li>
                  <li><Link to="/integrations" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Integrations</Link></li>
                  <li><Link to="/api" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">API</Link></li>
                </ul>
              </div>
              
              {/* Solutions Links */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Solutions</h3>
                <ul className="space-y-4">
                  <li><Link to="/students" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">For Students</Link></li>
                  <li><Link to="/recruiters" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">For Recruiters</Link></li>
                  <li><Link to="/colleges" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">For Colleges</Link></li>
                  <li><Link to="/enterprises" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Enterprise</Link></li>
                </ul>
              </div>
              
              {/* Company Links */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Company</h3>
                <ul className="space-y-4">
                  <li><Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">About Us</Link></li>
                  <li><Link to="/careers" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Careers</Link></li>
                  <li><Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Blog</Link></li>
                  <li><Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Contact</Link></li>
                </ul>
              </div>
            </div>
            
            {/* Bottom Section */}
            <div className="border-t border-gray-200 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-wrap justify-center md:justify-start space-x-8 mb-4 md:mb-0">
                  <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    Terms of Service
                  </Link>
                  <Link to="/cookies" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    Cookie Policy
                  </Link>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-500 font-medium">
                    © 2024 CampusEdge Inc. All rights reserved.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Made with ❤️ in India for the global community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
