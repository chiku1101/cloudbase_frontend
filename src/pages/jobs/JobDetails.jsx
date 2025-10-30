import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/jobs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setJob(response.data);
        // Check if user has applied from the job response
        if (response.data.hasApplied !== undefined) {
          setHasApplied(response.data.hasApplied);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. It might have been removed.');
      } finally {
        setLoading(false);
      }
    };

    const checkApplicationStatus = async () => {
      if (user?.role !== 'student') return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/applications/my-applications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Fix: Changed to match the backend response structure
        const hasAppliedForThisJob = response.data.applications.some(app => app.job._id === id);
        setHasApplied(hasAppliedForThisJob);
      } catch (err) {
        console.error('Error checking application status:', err);
        // Don't set error state here as this is not critical for the page to function
      }
    };

    fetchJobDetails();
    checkApplicationStatus();
  }, [id, user]);

  const handleApplyClick = () => {
    setShowApplicationForm(true);
    setError(''); // Clear previous errors
  };

  const handleCancelApplication = () => {
    setShowApplicationForm(false);
    setCoverLetter('');
    setError('');
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // FIXED: Changed the endpoint and payload structure
      const response = await axios.post('/api/applications/apply', {
        jobId: id,  // Changed from using URL parameter to body parameter
        coverLetter: coverLetter
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Application submitted successfully:', response.data);
      setHasApplied(true);
      setShowApplicationForm(false);
      setCoverLetter('');
      alert('Application submitted successfully!');
      
    } catch (err) {
      console.error('Error applying for job:', err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Job not found.'}</h2>
        <Link to="/jobs" className="text-indigo-600 hover:underline">
          &larr; Back to Jobs
        </Link>
      </div>
    );
  }

  const renderApplicationSection = () => {
    if (user?.role !== 'student') {
      return null;
    }

    // Check if job is available for applications
    const isJobClosed = job.status !== 'open' || new Date(job.deadline) <= new Date();
    
    if (isJobClosed) {
      return (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4 text-center">
          <h3 className="text-lg font-medium text-red-800">Applications Closed</h3>
          <p className="mt-2 text-sm text-red-700">
            {job.status !== 'open' 
              ? 'This job is no longer accepting applications.' 
              : 'The application deadline has passed.'}
          </p>
        </div>
      );
    }

    if (hasApplied) {
      return (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4 text-center">
          <h3 className="text-lg font-medium text-green-800">Application Submitted</h3>
          <p className="mt-2 text-sm text-green-700">You have already applied for this position.</p>
        </div>
      );
    }

    if (showApplicationForm) {
      return (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Your Application</h3>
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <h4 className="text-sm font-bold text-red-800">Could not submit application</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              {error.includes('profile') && (
                <Link to="/profile" className="text-sm font-bold text-indigo-600 hover:underline mt-2 block">
                  Update Your Profile &rarr;
                </Link>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmitApplication}>
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                Cover Letter (Optional)
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Tell the recruiter why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelApplication}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applying}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="mt-8 text-center">
        <button
          onClick={handleApplyClick}
          className="w-full max-w-xs inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Apply Now
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/jobs" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Back to Jobs
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <p className="text-xl opacity-90 mt-1">{job.company}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Posted</p>
                <p className="font-semibold">{new Date(job.createdAt).toLocaleDateString()}</p>
                <p className="text-sm opacity-80 mt-1">Deadline</p>
                <p className="font-semibold">{new Date(job.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-center">
              <div><strong className="block text-gray-600">Location</strong> {job.location}</div>
              <div><strong className="block text-gray-600">Job Type</strong> {job.jobType}</div>
              <div><strong className="block text-gray-600">Salary</strong> {job.salary || 'Not Disclosed'}</div>
            </div>

            {/* Show job status for debugging */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
              <p><strong>Status:</strong> {job.status}</p>
              <p><strong>Applications:</strong> {job.applicationCount || 0}</p>
              {job.minCGPA && <p><strong>Min CGPA:</strong> {job.minCGPA}</p>}
            </div>

            <div className="prose max-w-none">
              <h2 className="font-semibold">Job Description</h2>
              <p>{job.description}</p>

              {job.requirements && job.requirements.length > 0 && (
                <>
                  <h2 className="font-semibold">Requirements</h2>
                  <ul className="list-disc pl-5">
                    {Array.isArray(job.requirements) ? job.requirements.map((req, i) => <li key={i}>{req}</li>) : <li>{job.requirements}</li>}
                  </ul>
                </>
              )}
            </div>
            
            {renderApplicationSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;