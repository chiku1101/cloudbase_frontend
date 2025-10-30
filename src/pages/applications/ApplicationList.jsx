import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ApplicationList = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Use the correct endpoint based on user role
      let response;
      if (user?.role === 'student') {
        response = await axios.get('/api/applications/my-applications');
      } else if (user?.role === 'recruiter') {
        // For recruiters, we need to fetch their jobs first, then get applications for each job
        try {
          const jobsResponse = await axios.get('/api/jobs/recruiter');
          const jobs = jobsResponse.data.jobs || jobsResponse.data;
          
          // If there are jobs, get applications for the first job (or you could implement a job selector)
          if (jobs && jobs.length > 0) {
            response = await axios.get(`/api/applications/job/${jobs[0]._id}`);
          } else {
            // No jobs found, set empty applications
            setApplications([]);
            setLoading(false);
            return;
          }
        } catch (jobError) {
          console.error('Error fetching recruiter jobs:', jobError);
          setApplications([]);
          setLoading(false);
          return;
        }
      } else {
        // For admin, just set empty applications since there's no general endpoint
        setApplications([]);
        setLoading(false);
        return;
      }
      
      // Handle different response structures
      if (response.data.applications) {
        setApplications(response.data.applications);
      } else if (Array.isArray(response.data)) {
        setApplications(response.data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.patch(`/api/applications/${applicationId}/status`, { status });
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Error updating application status');
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ApplicationCard = ({ application }) => (
    <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {application.job?.title || 'Job Title Not Available'}
          </h3>
          <p className="text-lg text-gray-600 font-medium mb-3">
            {application.job?.company || 'Company Not Available'}
          </p>
          <div className="flex items-center text-gray-500 text-base mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {application.job?.location || 'Location Not Available'}
          </div>
          {user?.role !== 'student' && (
            <p className="text-gray-600 text-base font-medium">
              Applicant: {application.user?.name || 'Name Not Available'}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-3">
          <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
          <span className="text-gray-500 text-base font-medium">
            {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          to={`/applications/${application._id}`}
          className="text-gray-900 hover:text-gray-700 font-semibold text-lg"
        >
          View Details →
        </Link>
        
        {(user?.role === 'recruiter' || user?.role === 'admin') && application.status === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={() => updateApplicationStatus(application._id, 'accepted')}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors duration-200"
            >
              Accept
            </button>
            <button
              onClick={() => updateApplicationStatus(application._id, 'rejected')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-700 transition-colors duration-200"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pt-16">
      <div className="w-full px-8 lg:px-12 xl:px-16 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            {user?.role === 'student' ? 'My Applications' : 'Job Applications'}
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed max-w-3xl">
            {user?.role === 'student' 
              ? 'Track the status of your job applications' 
              : 'Manage and review job applications'
            }
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-10 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 mb-16">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                filter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Applications ({applications.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                filter === 'pending'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({applications.filter(app => app.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                filter === 'accepted'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Accepted ({applications.filter(app => app.status === 'accepted').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                filter === 'rejected'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({applications.filter(app => app.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredApplications.map((application) => (
              <ApplicationCard key={application._id} application={application} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No applications found</h3>
            <p className="text-lg text-gray-600 mb-8 font-medium">
              {filter === 'all' 
                ? user?.role === 'student' 
                  ? "You haven't applied to any jobs yet." 
                  : "No applications have been submitted yet."
                : `No ${filter} applications found.`
              }
            </p>
            {user?.role === 'student' && filter === 'all' && (
              <div className="mt-6">
                <Link
                  to="/jobs"
                  className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;