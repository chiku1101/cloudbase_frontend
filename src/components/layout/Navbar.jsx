import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const handleItemClick = (item) => {
    if (clickedItem === item) {
      setClickedItem(null); // Close if already open
    } else {
      setClickedItem(item); // Open the clicked item
    }
  };

  const handleMobileItemClick = (item, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Mobile item clicked:', item, 'Current clickedItem:', clickedItem);
    handleItemClick(item);
  };

  const isDropdownOpen = (item) => {
    return hoveredItem === item || clickedItem === item;
  };

  // Helper function to safely get array data from API response
  const getArrayFromResponse = (response, fallback = []) => {
    if (!response || !response.data) return fallback;
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.jobs && Array.isArray(response.data.jobs)) {
      return response.data.jobs;
    } else if (response.data.applications && Array.isArray(response.data.applications)) {
      return response.data.applications;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    return fallback;
  };

  // Fetch recent data for navbar dropdowns
  useEffect(() => {
    const fetchNavbarData = async () => {
      if (!user) return;

      try {
        if (user.role === 'student') {
          // Get recent jobs
          try {
            const jobsRes = await axios.get('/api/jobs');
            const jobs = getArrayFromResponse(jobsRes);
            setRecentJobs(jobs.slice(0, 3));
          } catch (error) {
            console.warn('Could not fetch recent jobs:', error.message);
          }

          // Get recent applications
          try {
            const applicationsRes = await axios.get('/api/applications/my-applications');
            const applications = getArrayFromResponse(applicationsRes);
            setRecentApplications(applications.slice(0, 3));
          } catch (error) {
            console.warn('Could not fetch recent applications:', error.message);
          }
        } else if (user.role === 'recruiter') {
          // Get recruiter's jobs
          try {
            const jobsRes = await axios.get('/api/jobs/recruiter');
            const jobs = getArrayFromResponse(jobsRes);
            setRecentJobs(jobs.slice(0, 3));
          } catch (error) {
            console.warn('Could not fetch recruiter jobs:', error.message);
          }

          // Get applications for recruiter's jobs
          try {
            const allJobsRes = await axios.get('/api/jobs');
            const allJobs = getArrayFromResponse(allJobsRes);
            const recruiterJobs = allJobs.filter(job => job.postedBy === user._id || job.recruiter === user._id);
            
            let allApplications = [];
            for (const job of recruiterJobs.slice(0, 3)) {
              try {
                const appRes = await axios.get(`/api/applications/job/${job._id}`);
                const jobApplications = getArrayFromResponse(appRes);
                allApplications = [...allApplications, ...jobApplications];
              } catch (appError) {
                console.warn(`Could not fetch applications for job ${job._id}:`, appError.message);
              }
            }
            setRecentApplications(allApplications.slice(0, 3));
          } catch (error) {
            console.warn('Could not fetch applications:', error.message);
          }
        }
      } catch (error) {
        console.error('Error fetching navbar data:', error);
      }
    };

    fetchNavbarData();
  }, [user]);

  // Close dropdowns when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close desktop dropdowns, not mobile menu items
      if (!event.target.closest('.dropdown-container') && 
          !event.target.closest('.mobile-dropdown')) {
        setClickedItem(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-8 lg:px-12 xl:px-16">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-lg mr-3 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">C</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 tracking-tight">
              CampusEdge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/dashboard')
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            
            {/* Jobs with hover and click dropdown */}
            <div 
              className="relative dropdown-container"
              onMouseEnter={() => setHoveredItem('jobs')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                onClick={() => handleItemClick('jobs')}
                className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  isActive('/jobs')
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Jobs
              </div>
              {isDropdownOpen('jobs') && (
                <div className="absolute top-full left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg border border-gray-200 shadow-lg py-4 z-50">
                  <div className="px-4 pb-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Recent Jobs</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {recentJobs.length > 0 ? (
                      recentJobs.map((job) => (
                        <Link
                          key={job._id}
                          to={`/jobs/${job._id}`}
                          className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {job.title || 'Job Title'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {job.company || 'Company'}
                              </p>
                            </div>
                            <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              {job.jobType || 'Full-time'}
                            </span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No recent jobs
                      </div>
                    )}
                  </div>
                  <div className="px-4 pt-2 border-t border-gray-100">
                    <Link
                      to="/jobs"
                      className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                    >
                      View all jobs →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Applications with hover and click dropdown */}
            <div 
              className="relative dropdown-container"
              onMouseEnter={() => setHoveredItem('applications')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                onClick={() => handleItemClick('applications')}
                className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  isActive('/applications')
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Applications
              </div>
              {isDropdownOpen('applications') && (
                <div className="absolute top-full left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg border border-gray-200 shadow-lg py-4 z-50">
                  <div className="px-4 pb-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Recent Applications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {recentApplications.length > 0 ? (
                      recentApplications.map((application) => (
                        <Link
                          key={application._id}
                          to={`/applications/${application._id}`}
                          className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {application.job?.title || application.jobTitle || 'Application'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {application.job?.company || application.company || 'Company'}
                              </p>
                            </div>
                            <span className={`ml-2 text-xs px-2 py-1 rounded ${
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {application.status || 'pending'}
                            </span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No recent applications
                      </div>
                    )}
                  </div>
                  <div className="px-4 pt-2 border-t border-gray-100">
                    <Link
                      to="/applications"
                      className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                    >
                      View all applications →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/messages"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/messages')
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Messages
            </Link>

            {/* Quick Actions with hover and click dropdown */}
            <div 
              className="relative dropdown-container"
              onMouseEnter={() => setHoveredItem('quick-actions')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span 
                onClick={() => handleItemClick('quick-actions')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
              >
                Quick Actions
              </span>
              {isDropdownOpen('quick-actions') && (
                <div className="absolute top-full left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg border border-gray-200 shadow-lg py-4 z-50">
                  <div className="px-4 pb-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-4">
                    {/* Browse Jobs - Available to all */}
                    <Link
                      to="/jobs"
                      className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-gray-900 text-center">Browse Jobs</span>
                      <span className="text-xs text-gray-500 text-center">Find opportunities</span>
                    </Link>

                    {/* My Applications - For students */}
                    {user?.role === 'student' && (
                      <Link
                        to="/applications"
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-900 text-center">My Applications</span>
                        <span className="text-xs text-gray-500 text-center">Track applications</span>
                      </Link>
                    )}

                    {/* Post a Job - For recruiters and admins */}
                    {(user?.role === 'recruiter' || user?.role === 'admin') && (
                      <Link
                        to="/create-job"
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-900 text-center">Post a Job</span>
                        <span className="text-xs text-gray-500 text-center">Create job opening</span>
                      </Link>
                    )}

                    {/* Resume Builder - For students */}
                    {user?.role === 'student' && (
                      <Link
                        to="/resume-builder"
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-900 text-center">Resume Builder</span>
                        <span className="text-xs text-gray-500 text-center">Create resume</span>
                      </Link>
                    )}

                    {/* Profile - Available to all */}
                    <Link
                      to="/profile"
                      className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-gray-900 text-center">Profile</span>
                      <span className="text-xs text-gray-500 text-center">Manage account</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {(user?.role === 'recruiter' || user?.role === 'admin') && (
              <Link
                to="/create-job"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/create-job')
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Post Job
              </Link>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              
              {/* Mobile Jobs Section */}
              <div className="space-y-1 mobile-dropdown">
                <div
                  onClick={(e) => handleMobileItemClick('mobile-jobs', e)}
                  className="flex items-center justify-between px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                >
                  <span>Jobs</span>
                  <svg className={`w-4 h-4 transition-transform ${clickedItem === 'mobile-jobs' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {clickedItem === 'mobile-jobs' && (
                  <div className="ml-4 space-y-1">
                    <Link
                      to="/jobs"
                      className="block px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      All Jobs
                    </Link>
                    {recentJobs.length > 0 && (
                      <div className="px-3 py-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Recent Jobs</p>
                        {recentJobs.slice(0, 3).map((job) => (
                          <Link
                            key={job._id}
                            to={`/jobs/${job._id}`}
                            className="block px-2 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {job.title || 'Job Title'}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Applications Section */}
              <div className="space-y-1 mobile-dropdown">
                <div
                  onClick={(e) => handleMobileItemClick('mobile-applications', e)}
                  className="flex items-center justify-between px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                >
                  <span>Applications</span>
                  <svg className={`w-4 h-4 transition-transform ${clickedItem === 'mobile-applications' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {clickedItem === 'mobile-applications' && (
                  <div className="ml-4 space-y-1">
                    <Link
                      to="/applications"
                      className="block px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      All Applications
                    </Link>
                    {recentApplications.length > 0 && (
                      <div className="px-3 py-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Recent Applications</p>
                        {recentApplications.slice(0, 3).map((application) => (
                          <Link
                            key={application._id}
                            to={`/applications/${application._id}`}
                            className="block px-2 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {application.job?.title || application.jobTitle || 'Application'}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/messages"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Messages
              </Link>

              {/* Mobile Quick Actions Section */}
              <div className="space-y-1 mobile-dropdown">
                <div
                  onClick={(e) => handleMobileItemClick('mobile-quick-actions', e)}
                  className="flex items-center justify-between px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                >
                  <span>Quick Actions</span>
                  <svg className={`w-4 h-4 transition-transform ${clickedItem === 'mobile-quick-actions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {clickedItem === 'mobile-quick-actions' && (
                  <div className="ml-4 space-y-1">
                    <Link
                      to="/jobs"
                      className="flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Browse Jobs
                    </Link>
                    
                    {user?.role === 'student' && (
                      <Link
                        to="/applications"
                        className="flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        My Applications
                      </Link>
                    )}

                    {(user?.role === 'recruiter' || user?.role === 'admin') && (
                      <Link
                        to="/create-job"
                        className="flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Post a Job
                      </Link>
                    )}

                    {user?.role === 'student' && (
                      <Link
                        to="/resume-builder"
                        className="flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Resume Builder
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                  </div>
                )}
              </div>

              {(user?.role === 'recruiter' || user?.role === 'admin') && (
                <Link
                  to="/create-job"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Post Job
                </Link>
              )}
              <Link
                to="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;