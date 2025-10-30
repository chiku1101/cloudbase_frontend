import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        cgpa: user.studentDetails?.cgpa || '',
        skills: user.studentDetails?.skills?.join(', ') || '',
        resumeUrl: user.studentDetails?.resumeUrl || '',
        branch: user.studentDetails?.branch || '',
        graduationYear: user.studentDetails?.graduationYear || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('/api/users/profile', formData);
      await fetchUser(); // Re-fetch user to update context
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      skills: user?.skills?.join(', ') || '',
      experience: user?.experience || '',
      education: user?.education || ''
    });
    setEditing(false);
  };

  return (
    <div className="w-full min-h-screen bg-white pt-16">
      <div className="w-full px-8 lg:px-12 xl:px-16 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Profile
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed max-w-3xl">
            Manage your account information and preferences
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gray-900 px-10 py-12 text-white">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center mr-8">
                <span className="text-4xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
                <p className="text-lg font-medium opacity-90 capitalize mb-1">{user?.role}</p>
                <p className="text-base opacity-75">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-10">
            {!editing ? (
              // View Mode
              <div>
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Full Name</label>
                    <p className="text-lg text-gray-900 font-medium">{user?.name || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Email</label>
                    <p className="text-lg text-gray-900 font-medium">{user?.email || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Phone</label>
                    <p className="text-lg text-gray-900 font-medium">{user?.phone || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Role</label>
                    <p className="text-lg text-gray-900 font-medium capitalize">{user?.role || 'Not provided'}</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Bio</label>
                    <p className="text-lg text-gray-900 leading-relaxed">{user?.bio || 'No bio provided'}</p>
                  </div>

                  {user?.role === 'student' && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Skills</label>
                        <div className="flex flex-wrap gap-3">
                          {user?.studentDetails?.skills?.length > 0 ? (
                            user.studentDetails.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-lg text-gray-500">No skills added</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">CGPA</label>
                        <p className="text-lg text-gray-900 font-medium">{user?.studentDetails?.cgpa || 'Not provided'}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Branch</label>
                        <p className="text-lg text-gray-900 font-medium">{user?.studentDetails?.branch || 'Not provided'}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Graduation Year</label>
                        <p className="text-lg text-gray-900 font-medium">{user?.studentDetails?.graduationYear || 'Not provided'}</p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Resume</label>
                        {user?.studentDetails?.resumeUrl ? (
                          <a href={user.studentDetails.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-lg text-gray-900 hover:text-gray-600 transition-colors font-medium">
                            View Resume
                          </a>
                        ) : (
                          <p className="text-lg text-gray-500">No resume uploaded</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
                  <div className="space-x-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Role</label>
                    <input
                      type="text"
                      value={user?.role}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 capitalize text-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Bio</label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-lg"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {user?.role === 'student' && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                          Skills (comma-separated)
                        </label>
                        <input
                          type="text"
                          name="skills"
                          value={formData.skills}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-lg"
                          placeholder="e.g. JavaScript, React, Node.js"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">CGPA</label>
                        <input
                          type="number"
                          name="cgpa"
                          step="0.01"
                          value={formData.cgpa}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-lg"
                          placeholder="e.g. 8.5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Branch</label>
                        <input
                          type="text"
                          name="branch"
                          value={formData.branch}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-lg"
                          placeholder="e.g. Computer Science"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Graduation Year</label>
                        <input
                          type="number"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-lg"
                          placeholder="e.g. 2025"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Resume URL</label>
                        <input
                          type="text"
                          name="resumeUrl"
                          value={formData.resumeUrl}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-lg"
                          placeholder="https://example.com/resume.pdf"
                        />
                      </div>
                    </>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;