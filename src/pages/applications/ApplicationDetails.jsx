import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ApplicationDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const response = await axios.get(`/applications/${id}`);
      setApplication(response.data);
    } catch (error) {
      console.error('Error fetching application details:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (status) => {
    try {
      await axios.put(`/applications/${id}`, { status });
      setApplication({ ...application, status });
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Error updating application status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application not found</h2>
          <p className="text-gray-600 mb-4">The application you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/applications')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/applications')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Applications
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Application Details</h1>
                <p className="text-xl opacity-90 mb-4">
                  {application.job?.title || 'Job Title Not Available'}
                </p>
                <p className="opacity-75">
                  {application.job?.company || 'Company Not Available'}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full border-2 ${getStatusColor(application.status)}`}>
                <span className="font-medium capitalize">{application.status}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Application Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Application Information</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Applied on:</span>
                    <span className="ml-2 font-medium">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  {application.updatedAt !== application.createdAt && (
                    <div>
                      <span className="text-gray-600">Last updated:</span>
                      <span className="ml-2 font-medium">
                        {new Date(application.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {user?.role === 'student' ? 'Job Details' : 'Applicant Details'}
                </h2>
                <div className="space-y-3">
                  {user?.role === 'student' ? (
                    <>
                      <div>
                        <span className="text-gray-600">Position:</span>
                        <span className="ml-2 font-medium">{application.job?.title}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Company:</span>
                        <span className="ml-2 font-medium">{application.job?.company}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-2 font-medium">{application.job?.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-medium capitalize">{application.job?.type}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{application.user?.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{application.user?.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Role:</span>
                        <span className="ml-2 font-medium capitalize">{application.user?.role}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cover Letter</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
                </div>
              </div>
            )}

            {/* Resume */}
            {application.resume && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resume</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Resume.pdf</p>
                      <p className="text-gray-600 text-sm">Click to download</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons for Recruiters */}
            {(user?.role === 'recruiter' || user?.role === 'admin') && application.status === 'pending' && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={() => updateApplicationStatus('accepted')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accept Application
                  </button>
                  <button
                    onClick={() => updateApplicationStatus('rejected')}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject Application
                  </button>
                </div>
              </div>
            )}

            {/* Status Message for Students */}
            {user?.role === 'student' && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Application Status</h2>
                {application.status === 'pending' && (
                  <div className="flex items-center text-yellow-700">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Your application is being reviewed. We'll notify you once there's an update.
                  </div>
                )}
                {application.status === 'accepted' && (
                  <div className="flex items-center text-green-700">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Congratulations! Your application has been accepted. The company will contact you soon.
                  </div>
                )}
                {application.status === 'rejected' && (
                  <div className="flex items-center text-red-700">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Unfortunately, your application was not selected for this position. Keep applying to other opportunities!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;