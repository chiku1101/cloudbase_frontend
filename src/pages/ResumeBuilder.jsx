import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: []
    },
    projects: [],
    certifications: []
  });

  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    location: '',
    graduationDate: '',
    gpa: ''
  });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    technologies: '',
    url: '',
    github: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState('technical');

  // Load user data into resume
  useEffect(() => {
    if (user) {
      setResumeData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: user.name || '',
          email: user.email || ''
        }
      }));
    }
  }, [user]);

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    if (newExperience.company && newExperience.position) {
      setResumeData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience, id: Date.now() }]
      }));
      setNewExperience({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    }
  };

  const removeExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setResumeData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation, id: Date.now() }]
      }));
      setNewEducation({
        institution: '',
        degree: '',
        field: '',
        location: '',
        graduationDate: '',
        gpa: ''
      });
    }
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addProject = () => {
    if (newProject.name && newProject.description) {
      setResumeData(prev => ({
        ...prev,
        projects: [...prev.projects, { ...newProject, id: Date.now() }]
      }));
      setNewProject({
        name: '',
        description: '',
        technologies: '',
        url: '',
        github: ''
      });
    }
  };

  const removeProject = (id) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [skillType]: [...prev.skills[skillType], newSkill.trim()]
        }
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill, type) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter(s => s !== skill)
      }
    }));
  };

  const downloadResume = () => {
    // Generate PDF using browser's print functionality
    const resumeHTML = generateResumeHTML();
    
    // Create a new window with the resume content
    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    
    if (printWindow) {
      printWindow.document.write(resumeHTML);
      printWindow.document.close();
      
      // Add title for better PDF naming
      printWindow.document.title = `${resumeData.personal.fullName || 'Resume'} - Resume`;
      
      // Wait for content and styles to load, then trigger print dialog
      printWindow.onload = () => {
        setTimeout(() => {
          // Focus the window and trigger print
          printWindow.focus();
          printWindow.print();
          
          // Optional: Close the window after a delay (user can choose to keep it open)
          setTimeout(() => {
            if (printWindow && !printWindow.closed) {
              printWindow.close();
            }
          }, 1000);
        }, 1000); // Increased delay to ensure proper loading
      };
      
      // Fallback for browsers that don't support onload properly
      setTimeout(() => {
        if (printWindow && !printWindow.closed) {
          printWindow.focus();
          printWindow.print();
        }
      }, 2000);
    } else {
      // Fallback: Alert user about popup blocker
      alert('Please allow popups for this website to generate PDF resume. Then try again.');
    }
  };

  const generateResumeHTML = () => {
    const { personal, experience, education, skills, projects } = resumeData;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personal.fullName} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 2rem;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 1rem;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 0.5rem;
            letter-spacing: 1px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
            font-size: 0.95rem;
            color: #555;
        }
        
        .contact-info span {
            padding: 0.2rem 0.8rem;
            background: #f8f9fa;
            border-radius: 15px;
            border: 1px solid #e9ecef;
        }
        
        .section {
            margin-bottom: 2rem;
        }
        
        .section-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 1rem;
            padding-bottom: 0.3rem;
            border-bottom: 2px solid #3498db;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .summary {
            font-size: 1rem;
            line-height: 1.7;
            color: #555;
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-radius: 8px;
            background: #fafafa;
            border-left: 3px solid #3498db;
        }
        
        .experience-header, .education-header, .project-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.5rem;
            flex-wrap: wrap;
        }
        
        .position, .degree, .project-name {
            font-size: 1.1rem;
            font-weight: 700;
            color: #2c3e50;
        }
        
        .company, .institution {
            font-size: 1rem;
            font-weight: 600;
            color: #3498db;
            margin-bottom: 0.2rem;
        }
        
        .date-location {
            font-size: 0.9rem;
            color: #7f8c8d;
            text-align: right;
        }
        
        .description {
            margin-top: 0.5rem;
            line-height: 1.6;
            color: #555;
        }
        
        .technologies {
            margin-top: 0.5rem;
            font-weight: 600;
            color: #27ae60;
        }
        
        .project-links {
            margin-top: 0.5rem;
        }
        
        .project-links a {
            color: #3498db;
            text-decoration: none;
            margin-right: 1rem;
            font-weight: 500;
        }
        
        .skills-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
        
        .skills-category {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            border-left: 3px solid #e74c3c;
        }
        
        .skills-category h4 {
            font-size: 1.1rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .skill-tag {
            background: #3498db;
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            body {
                padding: 0.5in;
                font-size: 11pt;
                background: white !important;
                margin: 0;
            }
            
            .header {
                page-break-after: avoid;
            }
            
            .header h1 {
                font-size: 22pt;
                margin-bottom: 8pt;
            }
            
            .contact-info {
                font-size: 9pt;
                gap: 0.5rem;
            }
            
            .contact-info span {
                padding: 2pt 6pt;
                background: #f8f9fa !important;
                border: 1pt solid #e9ecef !important;
            }
            
            .section {
                page-break-inside: avoid;
                margin-bottom: 16pt;
            }
            
            .section-title {
                font-size: 13pt;
                margin-bottom: 8pt;
                padding-bottom: 3pt;
                border-bottom: 2pt solid #3498db !important;
            }
            
            .summary {
                background: #f8f9fa !important;
                border-left: 4pt solid #3498db !important;
                padding: 8pt;
                page-break-inside: avoid;
            }
            
            .experience-item,
            .education-item,
            .project-item {
                background: #fafafa !important;
                border-left: 3pt solid #3498db !important;
                padding: 8pt;
                margin-bottom: 12pt;
                page-break-inside: avoid;
            }
            
            .skills-category {
                background: #f8f9fa !important;
                border-left: 3pt solid #e74c3c !important;
                page-break-inside: avoid;
            }
            
            .skill-tag {
                background: #3498db !important;
                color: white !important;
                padding: 2pt 6pt;
                font-size: 8pt;
            }
            
            .project-links a {
                color: #3498db !important;
            }
            
            .company, .institution {
                color: #3498db !important;
            }
            
            .technologies {
                color: #27ae60 !important;
            }
        }
        
        @media (max-width: 768px) {
            .experience-header, .education-header, .project-header {
                flex-direction: column;
            }
            
            .date-location {
                text-align: left;
                margin-top: 0.2rem;
            }
            
            .skills-container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${personal.fullName || 'Your Name'}</h1>
        <div class="contact-info">
            ${personal.email ? `<span>📧 ${personal.email}</span>` : ''}
            ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ''}
            ${personal.location ? `<span>📍 ${personal.location}</span>` : ''}
            ${personal.linkedin ? `<span>💼 <a href="${personal.linkedin}" style="color: inherit; text-decoration: none;">LinkedIn</a></span>` : ''}
            ${personal.github ? `<span>💻 <a href="${personal.github}" style="color: inherit; text-decoration: none;">GitHub</a></span>` : ''}
            ${personal.website ? `<span>🌐 <a href="${personal.website}" style="color: inherit; text-decoration: none;">Portfolio</a></span>` : ''}
        </div>
    </div>

    ${personal.summary ? `
    <div class="section">
        <h2 class="section-title">Professional Summary</h2>
        <div class="summary">${personal.summary}</div>
    </div>
    ` : ''}

    ${experience.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Professional Experience</h2>
        ${experience.map(exp => `
        <div class="experience-item">
            <div class="experience-header">
                <div>
                    <div class="position">${exp.position}</div>
                    <div class="company">${exp.company}</div>
                </div>
                <div class="date-location">
                    <div>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
                    <div>${exp.location}</div>
                </div>
            </div>
            ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${education.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Education</h2>
        ${education.map(edu => `
        <div class="education-item">
            <div class="education-header">
                <div>
                    <div class="degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                    <div class="institution">${edu.institution}</div>
                </div>
                <div class="date-location">
                    <div>${edu.graduationDate}</div>
                    <div>${edu.location}</div>
                    ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
                </div>
            </div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${projects.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Projects</h2>
        ${projects.map(project => `
        <div class="project-item">
            <div class="project-header">
                <div class="project-name">${project.name}</div>
            </div>
            ${project.description ? `<div class="description">${project.description}</div>` : ''}
            ${project.technologies ? `<div class="technologies">Technologies: ${project.technologies}</div>` : ''}
            ${(project.url || project.github) ? `
            <div class="project-links">
                ${project.url ? `<a href="${project.url}" target="_blank">Live Demo</a>` : ''}
                ${project.github ? `<a href="${project.github}" target="_blank">GitHub</a>` : ''}
            </div>
            ` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${(skills.technical.length > 0 || skills.soft.length > 0) ? `
    <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-container">
            ${skills.technical.length > 0 ? `
            <div class="skills-category">
                <h4>Technical Skills</h4>
                <div class="skills-list">
                    ${skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            ${skills.soft.length > 0 ? `
            <div class="skills-category">
                <h4>Soft Skills</h4>
                <div class="skills-list">
                    ${skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    </div>
    ` : ''}
</body>
</html>`;
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: '👤' },
    { id: 'experience', name: 'Experience', icon: '💼' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'projects', name: 'Projects', icon: '⚡' },
    { id: 'skills', name: 'Skills', icon: '🔧' }
  ];

  const renderPersonalSection = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={resumeData.personal.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={resumeData.personal.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={resumeData.personal.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={resumeData.personal.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="City, State"
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-2">LinkedIn</label>
          <input
            type="url"
            value={resumeData.personal.linkedin}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-2">GitHub</label>
          <input
            type="url"
            value={resumeData.personal.github}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="https://github.com/yourusername"
          />
        </div>
      </div>
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-2">Professional Summary</label>
        <textarea
          value={resumeData.personal.summary}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Brief professional summary highlighting your key skills and achievements..."
        />
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h3>
      
      {/* Add new experience form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Experience</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Position"
            value={newExperience.position}
            onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Location"
            value={newExperience.location}
            onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <div className="flex space-x-2">
            <input
              type="date"
              placeholder="Start Date"
              value={newExperience.startDate}
              onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            {!newExperience.current && (
              <input
                type="date"
                placeholder="End Date"
                value={newExperience.endDate}
                onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newExperience.current}
              onChange={(e) => setNewExperience({...newExperience, current: e.target.checked, endDate: e.target.checked ? '' : newExperience.endDate})}
              className="mr-2"
            />
            <span className="text-gray-700">Currently working here</span>
          </label>
        </div>
        <textarea
          placeholder="Job description and achievements..."
          value={newExperience.description}
          onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-4"
        />
        <button
          onClick={addExperience}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
        >
          Add Experience
        </button>
      </div>

      {/* Display existing experiences */}
      <div className="space-y-4">
        {resumeData.experience.map((exp) => (
          <div key={exp.id} className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                <p className="text-gray-600 font-medium">{exp.company} • {exp.location}</p>
                <p className="text-gray-500 text-sm">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                <p className="text-gray-700 mt-2">{exp.description}</p>
              </div>
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-red-600 hover:text-red-700 ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Education</h3>
      
      {/* Add new education form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Education</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Institution"
            value={newEducation.institution}
            onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Degree"
            value={newEducation.degree}
            onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Field of Study"
            value={newEducation.field}
            onChange={(e) => setNewEducation({...newEducation, field: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Location"
            value={newEducation.location}
            onChange={(e) => setNewEducation({...newEducation, location: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            type="date"
            placeholder="Graduation Date"
            value={newEducation.graduationDate}
            onChange={(e) => setNewEducation({...newEducation, graduationDate: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="GPA (optional)"
            value={newEducation.gpa}
            onChange={(e) => setNewEducation({...newEducation, gpa: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <button
          onClick={addEducation}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
        >
          Add Education
        </button>
      </div>

      {/* Display existing education */}
      <div className="space-y-4">
        {resumeData.education.map((edu) => (
          <div key={edu.id} className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                <p className="text-gray-600 font-medium">{edu.institution} • {edu.location}</p>
                <p className="text-gray-500 text-sm">
                  Graduated: {edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}
                </p>
              </div>
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-red-600 hover:text-red-700 ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectsSection = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Projects</h3>
      
      {/* Add new project form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Project</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Technologies Used"
            value={newProject.technologies}
            onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            type="url"
            placeholder="Project URL (optional)"
            value={newProject.url}
            onChange={(e) => setNewProject({...newProject, url: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <input
            type="url"
            placeholder="GitHub URL (optional)"
            value={newProject.github}
            onChange={(e) => setNewProject({...newProject, github: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <textarea
          placeholder="Project description..."
          value={newProject.description}
          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-4"
        />
        <button
          onClick={addProject}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
        >
          Add Project
        </button>
      </div>

      {/* Display existing projects */}
      <div className="space-y-4">
        {resumeData.projects.map((project) => (
          <div key={project.id} className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                {project.technologies && (
                  <p className="text-gray-600 font-medium mb-2">Technologies: {project.technologies}</p>
                )}
                <p className="text-gray-700 mb-2">{project.description}</p>
                <div className="flex space-x-4">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700 text-sm font-medium">
                      Live Demo →
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700 text-sm font-medium">
                      GitHub →
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-600 hover:text-red-700 ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Skills</h3>
      
      {/* Add new skill form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Skill</h4>
        <div className="flex space-x-4 mb-4">
          <select
            value={skillType}
            onChange={(e) => setSkillType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="technical">Technical Skills</option>
            <option value="soft">Soft Skills</option>
          </select>
          <input
            type="text"
            placeholder="Enter skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <button
            onClick={addSkill}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
          >
            Add
          </button>
        </div>
      </div>

      {/* Display skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h4>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.technical.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-800"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill, 'technical')}
                  className="ml-2 text-gray-500 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Soft Skills</h4>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.soft.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-800"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill, 'soft')}
                  className="ml-2 text-gray-500 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalSection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'projects':
        return renderProjectsSection();
      case 'skills':
        return renderSkillsSection();
      default:
        return renderPersonalSection();
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pt-16">
      <div className="w-full px-8 lg:px-12 xl:px-16 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Resume Builder
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed max-w-3xl">
            Create a professional resume with our easy-to-use builder
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                      activeSection === section.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{section.icon}</span>
                    {section.name}
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {showPreview ? 'Hide Preview' : 'Preview Resume'}
                </button>
                <button
                  onClick={downloadResume}
                  className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate PDF Resume
                </button>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Click "Generate PDF" → Choose "Save as PDF" in print dialog
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {!showPreview ? (
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                {renderActiveSection()}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Resume Preview</h3>
                  <p className="text-sm text-gray-600">This is how your resume will look when downloaded</p>
                </div>
                <div className="p-6">
                  <style>
                    {`
                      .resume-preview .header {
                        text-align: center;
                        margin-bottom: 2rem;
                        border-bottom: 2px solid #2c3e50;
                        padding-bottom: 1rem;
                      }
                      .resume-preview .header h1 {
                        font-size: 2.5rem;
                        font-weight: 700;
                        color: #2c3e50;
                        margin-bottom: 0.5rem;
                        letter-spacing: 1px;
                      }
                      .resume-preview .contact-info {
                        display: flex;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 1rem;
                        font-size: 0.95rem;
                        color: #555;
                      }
                      .resume-preview .contact-info span {
                        padding: 0.2rem 0.8rem;
                        background: #f8f9fa;
                        border-radius: 15px;
                        border: 1px solid #e9ecef;
                      }
                      .resume-preview .section {
                        margin-bottom: 2rem;
                      }
                      .resume-preview .section-title {
                        font-size: 1.4rem;
                        font-weight: 700;
                        color: #2c3e50;
                        margin-bottom: 1rem;
                        padding-bottom: 0.3rem;
                        border-bottom: 2px solid #3498db;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                      }
                      .resume-preview .summary {
                        font-size: 1rem;
                        line-height: 1.7;
                        color: #555;
                        background: #f8f9fa;
                        padding: 1rem;
                        border-radius: 8px;
                        border-left: 4px solid #3498db;
                      }
                      .resume-preview .experience-item,
                      .resume-preview .education-item,
                      .resume-preview .project-item {
                        margin-bottom: 1.5rem;
                        padding: 1rem;
                        border-radius: 8px;
                        background: #fafafa;
                        border-left: 3px solid #3498db;
                      }
                      .resume-preview .experience-header,
                      .resume-preview .education-header,
                      .resume-preview .project-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 0.5rem;
                        flex-wrap: wrap;
                      }
                      .resume-preview .position,
                      .resume-preview .degree,
                      .resume-preview .project-name {
                        font-size: 1.1rem;
                        font-weight: 700;
                        color: #2c3e50;
                      }
                      .resume-preview .company,
                      .resume-preview .institution {
                        font-size: 1rem;
                        font-weight: 600;
                        color: #3498db;
                        margin-bottom: 0.2rem;
                      }
                      .resume-preview .date-location {
                        font-size: 0.9rem;
                        color: #7f8c8d;
                        text-align: right;
                      }
                      .resume-preview .description {
                        margin-top: 0.5rem;
                        line-height: 1.6;
                        color: #555;
                      }
                      .resume-preview .technologies {
                        margin-top: 0.5rem;
                        font-weight: 600;
                        color: #27ae60;
                      }
                      .resume-preview .project-links {
                        margin-top: 0.5rem;
                      }
                      .resume-preview .project-links a {
                        color: #3498db;
                        text-decoration: none;
                        margin-right: 1rem;
                        font-weight: 500;
                      }
                      .resume-preview .skills-container {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 2rem;
                      }
                      .resume-preview .skills-category {
                        background: #f8f9fa;
                        padding: 1rem;
                        border-radius: 8px;
                        border-left: 3px solid #e74c3c;
                      }
                      .resume-preview .skills-category h4 {
                        font-size: 1.1rem;
                        font-weight: 700;
                        color: #2c3e50;
                        margin-bottom: 0.5rem;
                      }
                      .resume-preview .skills-list {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 0.5rem;
                      }
                      .resume-preview .skill-tag {
                        background: #3498db;
                        color: white;
                        padding: 0.3rem 0.8rem;
                        border-radius: 15px;
                        font-size: 0.85rem;
                        font-weight: 500;
                      }
                    `}
                  </style>
                  <div 
                    className="resume-preview bg-white border border-gray-300 p-8 rounded-lg shadow-sm"
                    dangerouslySetInnerHTML={{ 
                      __html: generateResumeHTML().match(/<body>([\s\S]*)<\/body>/)[1] 
                    }}
                    style={{
                      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                      lineHeight: 1.6,
                      color: '#333',
                      maxWidth: '8.5in',
                      margin: '0 auto'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
