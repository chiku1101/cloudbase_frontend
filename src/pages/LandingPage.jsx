import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Play, Users, Building, GraduationCap, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoLoop from '../components/LogoLoop';
import ScrollReveal from '../components/ScrollReveal';

const LandingPage = () => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="w-full min-h-screen bg-white antialiased">
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-lg mr-3 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">C</span>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
              CampusEdge
              </span>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-black text-white px-4 sm:px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="w-full min-h-screen flex items-center justify-start py-8 sm:py-12 lg:py-0">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="max-w-6xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs sm:text-sm font-medium text-gray-700 mb-6 sm:mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Trusted by 500+ students
          </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-[1.1] tracking-tight">
              Campus recruitment,
              <span className="block text-gray-600 font-bold">
                simplified.
              </span>
          </h1>
          
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 lg:mb-16 leading-relaxed max-w-3xl font-medium">
              Connect students with opportunities and companies with talent through our AI-powered platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
              <Link
                to="/register"
                className="bg-black text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center shadow-lg touch-manipulation"
              >
                Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
              </Link>
              <button className="border border-gray-300 text-gray-700 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center touch-manipulation">
                Watch Demo
                <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
              </button>
          </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
                  <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">500+</div>
                <div className="text-sm sm:text-base font-semibold text-gray-600 uppercase tracking-wide">Students</div>
              </div>
                  <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">150+</div>
                <div className="text-sm sm:text-base font-semibold text-gray-600 uppercase tracking-wide">Companies</div>
              </div>
                  <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">95%</div>
                <div className="text-sm sm:text-base font-semibold text-gray-600 uppercase tracking-wide">Success Rate</div>
                </div>
            <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">24/7</div>
                <div className="text-sm sm:text-base font-semibold text-gray-600 uppercase tracking-wide">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full min-h-screen bg-white flex flex-col justify-center py-12 sm:py-16 lg:py-0">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <ScrollReveal animation="fadeInUp" delay={200}>
            <div className="max-w-4xl mb-12 sm:mb-16 lg:mb-20 text-center mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight">
                Everything you need to succeed
            </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-medium">
                Powerful features designed for students, recruiters, and institutions.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
            <ScrollReveal animation="fadeInUp" delay={400}>
              <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-900 rounded-lg flex items-center justify-center mb-6 sm:mb-8">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">For Students</h3>
                <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 font-medium">Smart job matching, application tracking, and career guidance.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />AI-powered job recommendations</li>
                  <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />Real-time application tracking</li>
                  <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />Resume and interview assistance</li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeInUp" delay={600}>
              <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-900 rounded-lg flex items-center justify-center mb-6 sm:mb-8">
                  <Building className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">For Recruiters</h3>
                <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 font-medium">Advanced filtering, bulk actions, and analytics to find talent efficiently.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />Advanced candidate filtering</li>
                  <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />Bulk application management</li>
                  <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />Recruitment analytics</li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeInUp" delay={800}>
              <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-900 rounded-lg flex items-center justify-center mb-6 sm:mb-8">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">For Colleges</h3>
                <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 font-medium">Comprehensive placement management with analytics and tools.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />Placement analytics dashboard</li>
                  <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />Company relationship management</li>
                  <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />Event and drive organization</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="w-full py-12 sm:py-16 border-t border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <ScrollReveal animation="fadeInUp" delay={200}>
            <p className="text-center text-sm text-gray-500 mb-6 sm:mb-8">Trusted by leading companies</p>
            <LogoLoop 
              speed={1.5}
              direction="left"
              className="h-16 sm:h-20"
              logoClassName="opacity-60 hover:opacity-100 transition-opacity duration-300"
              pauseOnHover={true}
            />
          </ScrollReveal>
        </div>
      </section>

      <section className="w-full py-16 sm:py-20 lg:py-24 bg-white border-t border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 text-center">
          <ScrollReveal animation="fadeInUp" delay={200}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto font-medium">
              Join thousands of students and hundreds of companies already using CampusEdge.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/register"
                className="bg-black text-white px-6 sm:px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center shadow-lg touch-manipulation"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <button className="border border-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center touch-manipulation">
                Schedule Demo
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="w-full bg-gray-50 border-t border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Main Footer Content */}
            <div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
              {/* Company Info */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-lg mr-3 sm:mr-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg sm:text-xl">C</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  CampusEdge
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  Transforming campus recruitment with AI-powered solutions that connect students with opportunities and companies with talent.
                </p>
                <div className="flex space-x-3 sm:space-x-4">
                  <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors touch-manipulation">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Li</span>
                  </a>
                  <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors touch-manipulation">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Tw</span>
                  </a>
                  <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors touch-manipulation">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Fb</span>
                  </a>
                </div>
            </div>
            
              {/* Product Links */}
            <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Product</h3>
                <ul className="space-y-3 sm:space-y-4">
                  <li><Link to="/features" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</Link></li>
                  <li><Link to="/pricing" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">Pricing</Link></li>
                  <li><Link to="/integrations" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">Integrations</Link></li>
                  <li><Link to="/api" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">API</Link></li>
                  <li><Link to="/security" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">Security</Link></li>
              </ul>
            </div>
            
              {/* Solutions Links */}
            <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Solutions</h3>
                <ul className="space-y-3 sm:space-y-4">
                  <li><Link to="/students" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">For Students</Link></li>
                  <li><Link to="/recruiters" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">For Recruiters</Link></li>
                  <li><Link to="/colleges" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">For Colleges</Link></li>
                  <li><Link to="/enterprises" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">Enterprise</Link></li>
                  <li><Link to="/startups" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">Startups</Link></li>
              </ul>
            </div>
            
              {/* Company Links */}
            <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Company</h3>
                <ul className="space-y-3 sm:space-y-4">
                  <li><Link to="/about" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">About Us</Link></li>
                  <li><Link to="/careers" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">Careers</Link></li>
                  <li><Link to="/blog" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">Blog</Link></li>
                  <li><Link to="/contact" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">Contact</Link></li>
                  <li><Link to="/support" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors font-medium">Support</Link></li>
              </ul>
            </div>
          </div>
          
            {/* Bottom Section */}
            <div className="border-t border-gray-200 py-6 sm:py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 lg:gap-8 mb-4 md:mb-0">
                  <Link to="/privacy" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    Terms of Service
                  </Link>
                  <Link to="/cookies" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    Cookie Policy
                  </Link>
                  <Link to="/sitemap" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    Sitemap
                  </Link>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
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

export default LandingPage;