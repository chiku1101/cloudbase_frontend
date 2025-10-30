import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Briefcase, DollarSign, ExternalLink, Filter, RefreshCw } from 'lucide-react';
import axios from 'axios';

const EnhancedJobList = () => {
  const { user } = useAuth();
  const [localJobs, setLocalJobs] = useState([]);
  const [externalJobs, setExternalJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [externalLoading, setExternalLoading] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterSource, setFilterSource] = useState('all'); // 'all', 'local', 'external'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  
  // External job search states
  const [externalSearchQuery, setExternalSearchQuery] = useState('software engineer');
  const [externalLocation, setExternalLocation] = useState('remote');
  const [categories, setCategories] = useState([]);
  const [popularLocations, setPopularLocations] = useState([]);

  useEffect(() => {
    fetchLocalJobs();
    fetchExternalJobs();
    fetchJobCategories();
    fetchPopularLocations();
  }, []);

  useEffect(() => {
    // Combine local and external jobs
    const combined = [...localJobs, ...externalJobs];
    setAllJobs(combined);
  }, [localJobs, externalJobs]);

  const fetchLocalJobs = async () => {
    try {
      const response = await axios.get('/api/jobs');
      
      if (response.data.jobs) {
        setLocalJobs(response.data.jobs);
      } else if (Array.isArray(response.data)) {
        setLocalJobs(response.data);
      } else {
        setLocalJobs([]);
      }
    } catch (error) {
      console.error('Error fetching local jobs:', error);
      setLocalJobs([]);
    }
  };

  const fetchExternalJobs = async () => {
    try {
      setExternalLoading(true);
      const response = await axios.get('/api/external-jobs', {
        params: {
          query: externalSearchQuery,
          location: externalLocation,
          limit: 20,
          source: 'all'
        }
      });
      
      if (response.data.success) {
        setExternalJobs(response.data.data);
      } else {
        setExternalJobs([]);
      }
    } catch (error) {
      console.error('Error fetching external jobs:', error);
      setExternalJobs([]);
    } finally {
      setExternalLoading(false);
      setLoading(false);
    }
  };

  const fetchJobCategories = async () => {
    try {
      const response = await axios.get('/api/external-jobs/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPopularLocations = async () => {
    try {
      const response = await axios.get('/api/external-jobs/locations');
      if (response.data.success) {
        setPopularLocations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleAdvancedSearch = async () => {
    try {
      setExternalLoading(true);
      const response = await axios.post('/api/external-jobs/search', {
        query: externalSearchQuery,
        location: externalLocation,
        category: selectedCategory,
        experience: selectedExperience,
        jobType: filterType,
        limit: 30
      });
      
      if (response.data.success) {
        setExternalJobs(response.data.data);
      }
    } catch (error) {
      console.error('Error in advanced search:', error);
    } finally {
      setExternalLoading(false);
    }
  };

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || job.jobType === filterType;
    const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesSource = filterSource === 'all' || 
                         (filterSource === 'local' && !job.isExternal) ||
                         (filterSource === 'external' && job.isExternal);
    
    return matchesSearch && matchesType && matchesLocation && matchesSource;
  });

  const JobCard = ({ job }) => {
    const handleExternalJobClick = (e) => {
      console.log('External job clicked:', job.title, job.externalUrl);
      
      // If clicking on the apply button, let the default behavior handle it
      if (e.target.closest('a[href]')) {
        console.log('Apply button clicked, letting default behavior handle it');
        return;
      }
      
      // Otherwise, open the external job URL
      if (job.isExternal && job.externalUrl) {
        console.log('Opening external job URL:', job.externalUrl);
        try {
          const newWindow = window.open(job.externalUrl, '_blank', 'noopener,noreferrer');
          if (!newWindow) {
            console.error('Popup blocked! Please allow popups for this site.');
            alert('Popup blocked! Please allow popups for this site and try again.');
          } else {
            console.log('External job opened successfully');
          }
        } catch (error) {
          console.error('Error opening external job:', error);
          alert('Error opening external job: ' + error.message);
        }
      } else {
        console.log('Job is not external or missing URL:', { isExternal: job.isExternal, externalUrl: job.externalUrl });
      }
    };

    return (
      <div 
        className={`bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 ${
          job.isExternal ? 'cursor-pointer hover:border-blue-300' : ''
        }`}
        onClick={job.isExternal ? handleExternalJobClick : undefined}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
              {job.isExternal && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {job.source}
                </span>
              )}
            </div>
            <p className="text-lg text-gray-600 font-medium mb-3">{job.company}</p>
            <div className="flex items-center text-gray-500 text-base mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </div>
            {job.salary && (
              <div className="flex items-center text-gray-500 text-base">
                <DollarSign className="w-4 h-4 mr-1" />
                {job.salary}
              </div>
            )}
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
          </div>
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-3 text-base leading-relaxed">
          {job.description}
        </p>
        
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg font-medium">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg font-medium">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-base font-medium">
            {job.postedDate || `Posted ${new Date(job.createdAt).toLocaleDateString()}`}
          </span>
          {job.isExternal ? (
            <a
              href={job.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click when clicking button
                console.log('Apply button clicked for:', job.title, job.externalUrl);
              }}
            >
              Apply on {job.source}
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <Link
              to={`/jobs/${job._id}`}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
            >
              View Details
            </Link>
          )}
        </div>
        
        {job.isExternal && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm font-medium flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Click anywhere on this card to open the job posting
            </p>
          </div>
        )}
      </div>
    );
  };

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
            Discover your next career opportunity from local companies and external job boards
          </p>
        </div>

        {/* Advanced Search Section */}
        <div className="bg-white p-10 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">Advanced Job Search</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Job Title/Keywords</label>
              <input
                type="text"
                value={externalSearchQuery}
                onChange={(e) => setExternalSearchQuery(e.target.value)}
                placeholder="e.g., software engineer, data scientist"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Location</label>
              <select
                value={externalLocation}
                onChange={(e) => setExternalLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              >
                {popularLocations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleAdvancedSearch}
              disabled={externalLoading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {externalLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search External Jobs
                </>
              )}
            </button>
            
            <div className="text-sm text-gray-600">
              Found {externalJobs.length} external jobs
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-base font-semibold text-gray-700 mb-3">Search All Jobs</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by job title or company..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Job Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">Source</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="all">All Sources</option>
                <option value="local">Local Jobs</option>
                <option value="external">External Jobs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Total Jobs</p>
                <p className="text-3xl font-bold text-blue-900">{allJobs.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">Local Jobs</p>
                <p className="text-3xl font-bold text-green-900">{localJobs.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <Link to="/external-jobs" className="block">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">External Jobs</p>
                  <p className="text-3xl font-bold text-purple-900">{externalJobs.length}</p>
                </div>
                <ExternalLink className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Job Listings */}
        <div className="space-y-8">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))
          ) : (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedJobList;
