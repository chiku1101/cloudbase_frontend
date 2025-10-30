import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const JobList = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      console.log('Current user:', user); // Add debugging
      const response = await axios.get('/api/jobs');
      console.log('Jobs response:', response.data);
      
      // Handle different response structures
      if (response.data.jobs) {
        // New structure: { jobs: [...], total: 5, userRole: "student" }
        setJobs(response.data.jobs);
        console.log('Set jobs from response.data.jobs:', response.data.jobs.length);
      } else if (Array.isArray(response.data)) {
        // Old structure: direct array
        setJobs(response.data);
        console.log('Set jobs from response.data array:', response.data.length);
      } else {
        console.error('Unexpected response structure:', response.data);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || job.jobType === filterType;
    const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const JobCard = ({ job }) => (
    <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{job.title}</h3>
          <p className="text-lg text-gray-600 font-medium mb-3">{job.company}</p>
          <div className="flex items-center text-gray-500 text-base">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-3">
          <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            job.jobType === 'Full-time' ? 'bg-green-100 text-green-800' :
            job.jobType === 'Part-time' ? 'bg-blue-100 text-blue-800' :
            job.jobType === 'Internship' ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.jobType}
          </span>
          {job.salary && (
            <p className="text-gray-600 text-base font-medium">{job.salary}</p>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 line-clamp-3 text-base leading-relaxed">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {job.requiredSkills && job.requiredSkills.length > 0 ? (
          <>
            {job.requiredSkills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg font-medium">
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg font-medium">
                +{job.requiredSkills.length - 3} more
              </span>
            )}
          </>
        ) : (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg font-medium">
            No specific skills required
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-base font-medium">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link
          to={`/jobs/${job._id}`}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">Loading job opportunities...</p>
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
            Job Opportunities
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed max-w-3xl">
            Discover your next career opportunity
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-10 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-3">Search Jobs</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Job Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Location</label>
              <input
                type="text"
                placeholder="Enter location..."
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 font-medium">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No jobs found</h3>
            <p className="text-lg text-gray-600 mb-8 font-medium">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;