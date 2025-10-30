import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, ExternalLink, Filter, RefreshCw, ArrowLeft, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ExternalJobsPage = () => {
  const [externalJobs, setExternalJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('remote');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  
  // Data for filters
  const [categories, setCategories] = useState([]);
  const [popularLocations, setPopularLocations] = useState([]);
  const [jobSources] = useState([
    { id: 'all', name: 'All Sources' },
    { id: 'indeed', name: 'Indeed' },
    { id: 'github', name: 'GitHub' },
    { id: 'startup', name: 'Wellfound' }
  ]);

  useEffect(() => {
    fetchExternalJobs();
    fetchJobCategories();
    fetchPopularLocations();
  }, []);

  const fetchExternalJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/external-jobs', {
        params: {
          query: searchQuery || 'software engineer',
          location: selectedLocation,
          limit: 50,
          source: selectedSource
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
      setSearchLoading(true);
      const response = await axios.post('/api/external-jobs/search', {
        query: searchQuery || 'software engineer',
        location: selectedLocation,
        category: selectedCategory,
        experience: selectedExperience,
        jobType: selectedJobType,
        limit: 50
      });
      
      if (response.data.success) {
        setExternalJobs(response.data.data);
      }
    } catch (error) {
      console.error('Error in advanced search:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleExternalJobClick = (job) => {
    console.log('Opening external job:', job.title, job.externalUrl);
    if (job.externalUrl) {
      window.open(job.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const JobCard = ({ job }) => (
    <div 
      className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300"
      onClick={() => handleExternalJobClick(job)}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{job.title}</h3>
            <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold rounded-full flex items-center gap-1 w-fit">
              <ExternalLink className="w-3 h-3" />
              {job.source}
            </span>
          </div>
          <p className="text-base sm:text-lg text-gray-600 font-medium mb-2 sm:mb-3">{job.company}</p>
          <div className="flex items-center text-gray-500 text-sm sm:text-base mb-1 sm:mb-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center text-gray-500 text-sm sm:text-base">
              <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:items-end space-y-2 sm:space-y-3">
          <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold w-fit ${
            job.jobType === 'Full-time' ? 'bg-green-100 text-green-800' :
            job.jobType === 'Part-time' ? 'bg-blue-100 text-blue-800' :
            job.jobType === 'Internship' ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.jobType}
          </span>
          {job.experience && (
            <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full w-fit">
              {job.experience}
            </span>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 sm:mb-6 line-clamp-3 text-sm sm:text-base leading-relaxed">
        {job.description}
      </p>
      
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
          {job.skills.slice(0, 5).map((skill, index) => (
            <span key={index} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 text-xs sm:text-sm rounded-lg font-medium">
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 text-xs sm:text-sm rounded-lg font-medium">
              +{job.skills.length - 5} more
            </span>
          )}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center text-gray-500 text-sm sm:text-base">
          <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{job.postedDate || 'Recently posted'}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleExternalJobClick(job);
          }}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
        >
          Apply on {job.source}
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700 text-xs sm:text-sm font-medium flex items-center gap-2">
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Click anywhere on this card to open the job posting</span>
          <span className="sm:hidden">Tap to open job posting</span>
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 font-medium">Loading external job opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pt-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="flex items-center gap-4 mb-4 sm:mb-6">
            <Link 
              to="/jobs" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back to All Jobs</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                External Jobs
              </h1>
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 font-medium leading-relaxed mt-2">
                Discover opportunities from top job boards and companies
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700">{externalJobs.length} Opportunities</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700">Multiple Sources</span>
            </div>
          </div>
        </div>

        {/* Advanced Search Section */}
        <div className="bg-white p-4 sm:p-6 lg:p-10 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 mb-8 sm:mb-12 lg:mb-16">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Find Your Perfect Job</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">Job Title/Keywords</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., software engineer, data scientist"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
              >
                {popularLocations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">Job Source</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
              >
                {jobSources.map((source) => (
                  <option key={source.id} value={source.id}>{source.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">Experience Level</label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
              >
                <option value="">All Levels</option>
                <option value="entry level">Entry Level</option>
                <option value="mid level">Mid Level</option>
                <option value="senior level">Senior Level</option>
                <option value="lead">Lead</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">Job Type</label>
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={handleAdvancedSearch}
              disabled={searchLoading}
              className="bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {searchLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search External Jobs</span>
                  <span className="sm:hidden">Search Jobs</span>
                </>
              )}
            </button>
            
            <button
              onClick={fetchExternalJobs}
              className="bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Job Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-blue-50 p-3 sm:p-4 lg:p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-blue-600 text-xs sm:text-sm font-semibold uppercase tracking-wide truncate">Total Jobs</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900">{externalJobs.length}</p>
              </div>
              <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 flex-shrink-0" />
            </div>
          </div>
          
          <div className="bg-green-50 p-3 sm:p-4 lg:p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-green-600 text-xs sm:text-sm font-semibold uppercase tracking-wide truncate">Indeed Jobs</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900">{externalJobs.filter(job => job.source === 'Indeed').length}</p>
              </div>
              <ExternalLink className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 flex-shrink-0" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 sm:p-4 lg:p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-purple-600 text-xs sm:text-sm font-semibold uppercase tracking-wide truncate">GitHub Jobs</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-900">{externalJobs.filter(job => job.source === 'GitHub').length}</p>
              </div>
              <ExternalLink className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 flex-shrink-0" />
            </div>
          </div>
          
          <div className="bg-orange-50 p-3 sm:p-4 lg:p-6 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-orange-600 text-xs sm:text-sm font-semibold uppercase tracking-wide truncate">Startup Jobs</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-900">{externalJobs.filter(job => job.source === 'Wellfound').length}</p>
              </div>
              <ExternalLink className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-orange-600 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {externalJobs.length > 0 ? (
            externalJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))
          ) : (
            <div className="text-center py-12 sm:py-16">
              <ExternalLink className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No external jobs found</h3>
              <p className="text-sm sm:text-base text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExternalJobsPage;
