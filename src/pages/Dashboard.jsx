import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper function to safely get array data from API response
  const getArrayFromResponse = (response, fallback = []) => {
    if (!response || !response.data) return fallback;
    
    // Handle different response structures
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user && user.role === 'student') {
        // Get student applications
        let applications = [];
        try {
          const applicationsRes = await axios.get('/api/applications/my-applications');
          applications = getArrayFromResponse(applicationsRes);
          console.log('Student applications:', applications);
        } catch (appError) {
          console.warn('Could not fetch applications:', appError.message);
        }

        // Get all available jobs
        let jobs = [];
        try {
          const jobsRes = await axios.get('/api/jobs');
          jobs = getArrayFromResponse(jobsRes);
          console.log('All jobs:', jobs);
        } catch (jobError) {
          console.warn('Could not fetch jobs:', jobError.message);
        }

        
        setStats({
          totalJobs: jobs.length,
          totalApplications: applications.length,
          pendingApplications: applications.filter(app => app.status === 'pending').length,
          acceptedApplications: applications.filter(app => app.status === 'accepted').length
        });

      } else if (user && user.role === 'recruiter') {
        // Get jobs posted by this recruiter
        let jobs = [];
        try {
          const jobsRes = await axios.get('/api/jobs/recruiter');
          jobs = getArrayFromResponse(jobsRes);
          console.log('Recruiter jobs:', jobs);
        } catch (jobError) {
          console.warn('Could not fetch recruiter jobs:', jobError.message);
          // Fallback: try to get all jobs and filter by user
          try {
            const allJobsRes = await axios.get('/api/jobs');
            const allJobs = getArrayFromResponse(allJobsRes);
            jobs = allJobs.filter(job => job.postedBy === user._id || job.recruiter === user._id);
          } catch (fallbackError) {
            console.warn('Fallback job fetch also failed:', fallbackError.message);
          }
        }

        // Get applications for recruiter's jobs
        let allApplications = [];
        for (const job of jobs) {
          try {
            const appRes = await axios.get(`/api/applications/job/${job._id}`);
            const jobApplications = getArrayFromResponse(appRes);
            allApplications = [...allApplications, ...jobApplications];
          } catch (appError) {
            console.warn(`Could not fetch applications for job ${job._id}:`, appError.message);
          }
        }

        
        setStats({
          totalJobs: jobs.length,
          totalApplications: allApplications.length,
          pendingApplications: allApplications.filter(app => app.status === 'pending').length,
          acceptedApplications: allApplications.filter(app => app.status === 'accepted').length
        });

      } else if (user && user.role === 'admin') {
        // Admin view - get all jobs and applications
        let jobs = [];
        let applications = [];

        try {
          const jobsRes = await axios.get('/api/jobs');
          jobs = getArrayFromResponse(jobsRes);
        } catch (jobError) {
          console.warn('Could not fetch all jobs:', jobError.message);
        }

        try {
          const applicationsRes = await axios.get('/api/applications');
          applications = getArrayFromResponse(applicationsRes);
        } catch (appError) {
          console.warn('Could not fetch all applications:', appError.message);
        }

        
        setStats({
          totalJobs: jobs.length,
          totalApplications: applications.length,
          pendingApplications: applications.filter(app => app.status === 'pending').length,
          acceptedApplications: applications.filter(app => app.status === 'accepted').length
        });
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-xs sm:text-sm lg:text-base font-semibold uppercase tracking-wide mb-2 sm:mb-3 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${color} rounded-lg flex items-center justify-center flex-shrink-0 ml-3`}>
          <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center bg-white p-6 sm:p-8 lg:p-12 rounded-lg border border-gray-200 max-w-md w-full">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Error Loading Dashboard</h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 font-medium">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-gray-900 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pt-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-12">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-[1.1] tracking-tight">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 font-medium leading-relaxed max-w-3xl">
            {user?.role === 'student' 
              ? 'Find your dream job and track your applications'
              : user?.role === 'recruiter'
              ? 'Manage job postings and review applications'
              : user?.role === 'admin'
              ? 'Oversee platform operations and user management'
              : 'Welcome to the platform'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          <StatCard
            title="Total Jobs"
            value={stats.totalJobs}
            icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>}
            color="bg-gray-900"
          />
          <StatCard
            title="Applications"
            value={stats.totalApplications}
            icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>}
            color="bg-gray-900"
          />
          <StatCard
            title="Pending"
            value={stats.pendingApplications}
            icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
            color="bg-gray-900"
          />
          <StatCard
            title="Accepted"
            value={stats.acceptedApplications}
            icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
            color="bg-gray-900"
          />
        </div>


        {/* Recent Activity Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            Recent Activity
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Your Latest Updates</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Application submitted successfully</p>
                  <p className="text-gray-600 text-sm">Software Engineer at Google - 2 hours ago</p>
                </div>
                <span className="text-green-600 text-sm font-medium">Completed</span>
              </div>

              <div className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Application under review</p>
                  <p className="text-gray-600 text-sm">Data Scientist at Meta - 1 day ago</p>
                </div>
                <span className="text-yellow-600 text-sm font-medium">Pending</span>
              </div>

              <div className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Profile updated</p>
                  <p className="text-gray-600 text-sm">Added new skills and experience - 2 days ago</p>
                </div>
                <span className="text-blue-600 text-sm font-medium">Updated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            Upcoming Deadlines
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
                <span className="text-red-600 text-sm font-medium">3 deadlines</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Senior Software Engineer</p>
                    <p className="text-sm text-gray-600">Google</p>
                  </div>
                  <span className="text-red-600 text-sm font-medium">2 days left</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Data Analyst</p>
                    <p className="text-sm text-gray-600">Microsoft</p>
                  </div>
                  <span className="text-yellow-600 text-sm font-medium">5 days left</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Next Week</h3>
                <span className="text-blue-600 text-sm font-medium">2 deadlines</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Product Manager</p>
                    <p className="text-sm text-gray-600">Amazon</p>
                  </div>
                  <span className="text-blue-600 text-sm font-medium">8 days left</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">UX Designer</p>
                    <p className="text-sm text-gray-600">Apple</p>
                  </div>
                  <span className="text-green-600 text-sm font-medium">10 days left</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips & Resources Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            Tips & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Tips</h3>
              <p className="text-gray-600 text-sm mb-4">Learn how to create a standout resume that gets noticed by recruiters.</p>
              <a href="#" className="text-blue-600 text-sm font-medium hover:text-blue-700">Read More →</a>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Prep</h3>
              <p className="text-gray-600 text-sm mb-4">Master common interview questions and techniques to ace your next interview.</p>
              <a href="#" className="text-green-600 text-sm font-medium hover:text-green-700">Read More →</a>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Growth</h3>
              <p className="text-gray-600 text-sm mb-4">Discover strategies for advancing your career and building professional skills.</p>
              <a href="#" className="text-purple-600 text-sm font-medium hover:text-purple-700">Read More →</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;