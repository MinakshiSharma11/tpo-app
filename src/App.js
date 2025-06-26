import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Plus, Save, FileText, User, GraduationCap, Trophy, Briefcase, MapPin } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    currentAddress: '',
    permanentAddress: '',
    emergencyContact: '',
    emergencyRelation: '',
    studentId: '',
    
    // Academic Information
    tenth: {
      board: '',
      school: '',
      year: '',
      percentage: '',
      certificate: null
    },
    twelfth: {
      board: '',
      school: '',
      stream: '',
      year: '',
      percentage: '',
      certificate: null
    },
    
    // Higher Education
    currentCourse: '',
    university: '',
    currentSemester: '',
    currentCGPA: '',
    expectedGraduation: '',
    
    // NTA Score
    ntaExam: '',
    applicationNumber: '',
    rollNumber: '',
    score: '',
    scoreCard: null,
    
    // Documents
    resume: null,
    profilePhoto: null,
    
    // Projects
    projects: [],
    
    // Career Preferences
    sectorPreferences: [],
    rolePreferences: [],
    locationPreferences: [],
    willingToRelocate: false
  });

  const [errors, setErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fileInputRefs = useRef({});

  const totalSteps = 7;

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.studentId) newErrors.studentId = 'Student ID is required';
        break;
      case 2:
        if (!formData.tenth.board) newErrors['tenth.board'] = '10th board is required';
        if (!formData.tenth.percentage) newErrors['tenth.percentage'] = '10th percentage is required';
        if (!formData.twelfth.board) newErrors['twelfth.board'] = '12th board is required';
        if (!formData.twelfth.percentage) newErrors['twelfth.percentage'] = '12th percentage is required';
        break;
      case 3:
        if (!formData.currentCourse) newErrors.currentCourse = 'Current course is required';
        if (!formData.university) newErrors.university = 'University is required';
        if (!formData.currentCGPA) newErrors.currentCGPA = 'Current CGPA is required';
        break;
        default:
          break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleFileUpload = (field, file) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: file
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: '',
      description: '',
      technologies: '',
      duration: '',
      teamSize: '',
      githubLink: '',
      liveDemo: '',
      images: []
    };
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const saveData = () => {
    localStorage.setItem('tpoFormData', JSON.stringify(formData));
    alert('Data saved successfully!');
  };

  const loadData = () => {
    const savedData = localStorage.getItem('tpoFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
      alert('Data loaded successfully!');
    }
  };

  const submitForm = () => {
    if (validateStep(currentStep)) {
      localStorage.setItem('tpoFormData', JSON.stringify(formData));
      alert('Form submitted successfully!');
    }
  };

  const renderProgressBar = () => (
    <div className="progress mb-4" style={{ height: '8px' }}>
      <div 
        className="progress-bar bg-success" 
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  );

  const renderStepIndicator = () => (
    <div className="row mb-4">
      {[1, 2, 3, 4, 5, 6, 7].map(step => (
        <div key={step} className="col text-center">
          <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
            step <= currentStep ? 'bg-success text-white' : isDarkMode ? 'bg-secondary text-light' : 'bg-light text-muted'
          }`} style={{ width: '40px', height: '40px', fontSize: '14px' }}>
            {step}
          </div>
          <div className={`small mt-1 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
            {step === 1 && 'Personal'}
            {step === 2 && 'Academic'}
            {step === 3 && 'Higher Ed'}
            {step === 4 && 'NTA Score'}
            {step === 5 && 'Documents'}
            {step === 6 && 'Projects'}
            {step === 7 && 'Preferences'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPersonalDetails = () => (
    <div className="row">
      <div className="col-12">
        <h4 className={`mb-4 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
          <User className="me-2" size={24} />Personal Details
        </h4>
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Full Name *</label>
        <input
          type="text"
          className={`form-control ${errors.fullName ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
        />
        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Email *</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Phone Number *</label>
        <input
          type="tel"
          className={`form-control ${errors.phone ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Date of Birth *</label>
        <input
          type="date"
          className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
        />
        {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Gender *</label>
        <select
          className={`form-select ${errors.gender ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Student ID/Roll Number *</label>
        <input
          type="text"
          className={`form-control ${errors.studentId ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.studentId}
          onChange={(e) => handleInputChange('studentId', e.target.value)}
        />
        {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
      </div>
      <div className="col-12 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Current Address</label>
        <textarea
          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          rows="3"
          value={formData.currentAddress}
          onChange={(e) => handleInputChange('currentAddress', e.target.value)}
        />
      </div>
      <div className="col-12 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Permanent Address</label>
        <textarea
          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          rows="3"
          value={formData.permanentAddress}
          onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Emergency Contact</label>
        <input
          type="tel"
          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.emergencyContact}
          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Emergency Contact Relation</label>
        <input
          type="text"
          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.emergencyRelation}
          onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
        />
      </div>
    </div>
  );

  const renderAcademicInfo = () => (
    <div className="row">
      <div className="col-12">
        <h4 className={`mb-4 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
          <GraduationCap className="me-2" size={24} />Academic Information
        </h4>
      </div>
      
      {/* 10th Standard */}
      <div className="col-12 mb-4">
        <h5 className={`${isDarkMode ? 'text-info' : 'text-primary'}`}>10th Standard Details</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Board/University *</label>
            <input
              type="text"
              className={`form-control ${errors['tenth.board'] ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              value={formData.tenth.board}
              onChange={(e) => handleInputChange('tenth.board', e.target.value)}
            />
            {errors['tenth.board'] && <div className="invalid-feedback">{errors['tenth.board']}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>School Name</label>
            <input
              type="text"
              className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              value={formData.tenth.school}
              onChange={(e) => handleInputChange('tenth.school', e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Year of Passing</label>
            <input
              type="number"
              className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              value={formData.tenth.year}
              onChange={(e) => handleInputChange('tenth.year', e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Percentage/CGPA *</label>
            <input
              type="number"
              step="0.01"
              className={`form-control ${errors['tenth.percentage'] ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              value={formData.tenth.percentage}
              onChange={(e) => handleInputChange('tenth.percentage', e.target.value)}
            />
            {errors['tenth.percentage'] && <div className="invalid-feedback">{errors['tenth.percentage']}</div>}
          </div>
          <div className="col-12 mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Certificate Upload</label>
            <input
              type="file"
              className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('tenth.certificate', e.target.files[0])}
            />
          </div>
        </div>
      </div>

      {/* 12th Standard */}
      <div className="col-12">
        <h5 className={`${isDarkMode ? 'text-info' : 'text-primary'}`}>12th Standard/Diploma Details</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Board/University *</label>
            <input
              type="text"
              className={`form-control ${errors['twelfth.board'] ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              value={formData.twelfth.board}
              onChange={(e) => handleInputChange('twelfth.board', e.target.value)}
            />
            {errors['twelfth.board'] && <div className="invalid-feedback">{errors['twelfth.board']}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>School/College Name</label>
            <input
              type="text"
              className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              value={formData.twelfth.school}
              onChange={(e) => handleInputChange('twelfth.school', e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Stream/Specialization</label>
            <input
              type="text"
              className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              value={formData.twelfth.stream}
              onChange={(e) => handleInputChange('twelfth.stream', e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Year of Passing</label>
            <input
              type="number"
              className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              value={formData.twelfth.year}
              onChange={(e) => handleInputChange('twelfth.year', e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Percentage/CGPA *</label>
            <input
              type="number"
              step="0.01"
              className={`form-control ${errors['twelfth.percentage'] ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              value={formData.twelfth.percentage}
              onChange={(e) => handleInputChange('twelfth.percentage', e.target.value)}
            />
            {errors['twelfth.percentage'] && <div className="invalid-feedback">{errors['twelfth.percentage']}</div>}
          </div>
          <div className="col-12 mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Certificate Upload</label>
            <input
              type="file"
              className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('twelfth.certificate', e.target.files[0])}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderHigherEducation = () => (
    <div className="row">
      <div className="col-12">
        <h4 className={`mb-4 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
          <GraduationCap className="me-2" size={24} />Higher Education Details
        </h4>
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Current Course *</label>
        <input
          type="text"
          className={`form-control ${errors.currentCourse ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.currentCourse}
          onChange={(e) => handleInputChange('currentCourse', e.target.value)}
        />
        {errors.currentCourse && <div className="invalid-feedback">{errors.currentCourse}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>University/College Name *</label>
        <input
          type="text"
          className={`form-control ${errors.university ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.university}
          onChange={(e) => handleInputChange('university', e.target.value)}
        />
        {errors.university && <div className="invalid-feedback">{errors.university}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Current Semester/Year</label>
        <input
          type="text"
          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.currentSemester}
          onChange={(e) => handleInputChange('currentSemester', e.target.value)}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Current CGPA/Percentage *</label>
        <input
          type="number"
          step="0.01"
          className={`form-control ${errors.currentCGPA ? 'is-invalid' : ''} ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.currentCGPA}
          onChange={(e) => handleInputChange('currentCGPA', e.target.value)}
        />
        {errors.currentCGPA && <div className="invalid-feedback">{errors.currentCGPA}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Expected Graduation Date</label>
        <input
          type="date"
          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.expectedGraduation}
          onChange={(e) => handleInputChange('expectedGraduation', e.target.value)}
        />
      </div>
    </div>
  );

  const renderNTAScore = () => (
    <div className="row">
      <div className="col-12">
        <h4 className={`mb-4 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
          <Trophy className="me-2" size={24} />NTA Score Card
        </h4>
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Exam Name</label>
        <select
          className={`form-select ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.ntaExam}
          onChange={(e) => handleInputChange('ntaExam', e.target.value)}
        >
          <option value="">Select Exam</option>
          <option value="JEE Main">JEE Main</option>
          <option value="JEE Advanced">JEE Advanced</option>
          <option value="NEET">NEET</option>
          <option value="GATE">GATE</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Application Number</label>
        <input
          type="text"
          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.applicationNumber}
          onChange={(e) => handleInputChange('applicationNumber', e.target.value)}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Roll Number</label>
        <input
          type="text"
          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.rollNumber}
          onChange={(e) => handleInputChange('rollNumber', e.target.value)}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Score/Percentile</label>
        <input
          type="number"
          step="0.01"
          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          value={formData.score}
          onChange={(e) => handleInputChange('score', e.target.value)}
        />
      </div>
      <div className="col-12 mb-3">
        <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>Score Card Upload</label>
        <input
          type="file"
          className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload('scoreCard', e.target.files[0])}
        />
        {formData.scoreCard && (
          <div className="mt-2">
            <small className={`${isDarkMode ? 'text-success' : 'text-success'}`}>File uploaded: {formData.scoreCard.name}</small>
          </div>
        )}
      </div>
    </div>
  );

   const renderDocuments = () => (
    <div className="row">
      <div className="col-12">
        <h4 className={`mb-4 ${isDarkMode ? 'text-light' : ''}`}><FileText className="me-2" size={24} />Document Management</h4>
      </div>
      <div className="col-md-6 mb-4">
        <div className={`card ${isDarkMode ? 'bg-dark border-secondary' : ''}`}>
          <div className={`card-body text-center ${isDarkMode ? 'text-light' : ''}`}>
            <Upload size={48} className="text-primary mb-3" />
            <h5>Resume Upload</h5>
            <input
              type="file"
              className={`form-control mb-3 ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              accept=".pdf"
              onChange={(e) => handleFileUpload('resume', e.target.files[0])}
            />
            {formData.resume && (
              <div className="alert alert-success">
                <small>Uploaded: {formData.resume.name}</small>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className={`card ${isDarkMode ? 'bg-dark border-secondary' : ''}`}>
          <div className={`card-body text-center ${isDarkMode ? 'text-light' : ''}`}>
            <Camera size={48} className="text-primary mb-3" />
            <h5>Professional Photo</h5>
            <input
              type="file"
              className={`form-control mb-3 ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('profilePhoto', e.target.files[0])}
            />
            {formData.profilePhoto && (
              <div className="alert alert-success">
                <small>Uploaded: {formData.profilePhoto.name}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="row">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className={`${isDarkMode ? 'text-light' : ''}`}><Briefcase className="me-2" size={24} />Project Portfolio</h4>
          <button className="btn btn-primary" onClick={addProject}>
            <Plus size={16} className="me-1" />Add Project
          </button>
        </div>
      </div>
      {formData.projects.map((project, index) => (
        <div key={project.id} className="col-12 mb-4">
          <div className={`card ${isDarkMode ? 'bg-dark border-secondary' : ''}`}>
            <div className={`card-body text-center ${isDarkMode ? 'text-light' : ''}`}>
            <Camera size={48} className="text-primary mb-3" />
              <h6 className="mb-0">Project {index + 1}</h6>
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeProject(project.id)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Project Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={project.title}
                    onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Technologies Used</label>
                  <input
                    type="text"
                    className="form-control"
                    value={project.technologies}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    value={project.duration}
                    onChange={(e) => updateProject(project.id, 'duration', e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Team Size</label>
                  <input
                    type="number"
                    className="form-control"
                    value={project.teamSize}
                    onChange={(e) => updateProject(project.id, 'teamSize', e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">GitHub Link</label>
                  <input
                    type="url"
                    className="form-control"
                    value={project.githubLink}
                    onChange={(e) => updateProject(project.id, 'githubLink', e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Live Demo URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={project.liveDemo}
                    onChange={(e) => updateProject(project.id, 'liveDemo', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {formData.projects.length === 0 && (
        <div className="col-12">
          <div className="alert alert-info text-center">
            <p className="mb-0">No projects added yet. Click "Add Project" to get started!</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderPreferences = () => {
    const sectors = [
      'Information Technology', 'Banking & Financial Services', 'Consulting',
      'Manufacturing', 'Healthcare', 'E-commerce', 'Government',
      'Research & Development', 'Startups'
    ];

    const roles = [
      'Software Developer', 'Data Analyst/Scientist', 'System Administrator',
      'Business Analyst', 'Product Manager', 'UI/UX Designer'
    ];

    return (
      <div className="row">
        <div className="col-12">
          <h4 className={`mb-4 ${isDarkMode ? 'text-light' : ''}`}><MapPin className="me-2" size={24} />Career Preferences</h4>
        </div>
        
        <div className="col-12 mb-4">
          <h5 className={`${isDarkMode ? 'text-light' : ''}`}>Sector Preferences</h5>
          <div className="row">
            {sectors.map(sector => (
              <div key={sector} className="col-md-4 mb-2">
                <div className={` ${isDarkMode ? 'bg-dark border-secondary' : ''}`}>
                 <div className={`body text-left ${isDarkMode ? 'text-light' : ''}`}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={formData.sectorPreferences.includes(sector)}
                    onChange={(e) => handleCheckboxChange('sectorPreferences', sector, e.target.checked)}
                  />
                  <label className="form-check-label">{sector}</label></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 mb-4">
          <h5 className={`${isDarkMode ? 'text-light' : ''}`}>Role Preferences</h5>
          <div className="row">
            {roles.map(role => (
              <div key={role} className="col-md-4 mb-2">
                <div className={` ${isDarkMode ? 'bg-dark border-secondary' : ''}`}>
                 <div className={`body text-left ${isDarkMode ? 'text-light' : ''}`}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={formData.rolePreferences.includes(role)}
                    onChange={(e) => handleCheckboxChange('rolePreferences', role, e.target.checked)}
                  />
                  <label className="form-check-label">{role}</label></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 mb-4">
          <h5 className={`${isDarkMode ? 'text-light' : ''}`}>Location Preferences</h5>
          <div className="mb-3">
            <label className={`form-label ${isDarkMode ? 'text-light' : ''}`}>Preferred Cities/States</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter preferred locations separated by commas"
              value={formData.locationPreferences.join(', ')}
              onChange={(e) => handleInputChange('locationPreferences', e.target.value.split(', ').filter(loc => loc.trim()))}
            />
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={formData.willingToRelocate}
              onChange={(e) => handleInputChange('willingToRelocate', e.target.checked)}
            />
            <label className={`form-check-label ${isDarkMode ? 'text-light' : ''}`}>Willing to relocate</label>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalDetails();
      case 2:
        return renderAcademicInfo();
      case 3:
        return renderHigherEducation();
      case 4:
        return renderNTAScore();
      case 5:
        return renderDocuments();
      case 6:
        return renderProjects();
      case 7:
        return renderPreferences();
      default:
        return renderPersonalDetails();
    }
  };

  return (
    <div className={`min-vh-100 ${isDarkMode ? 'bg-dark text-light' : 'bg-light'}`}>
      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      
      {/* Header */}
      <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} border-bottom`}>
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            <GraduationCap className="me-2" size={24} />
            TPO Registration Portal
          </span>
          <div className="navbar-nav ms-auto">
            <button
              className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'} me-2`}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button className="btn btn-outline-primary me-2" onClick={saveData}>
              <Save size={16} className="me-1" />
              Save Draft
            </button>
            <button className="btn btn-outline-secondary" onClick={loadData}>
              Load Draft
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className={`card shadow ${isDarkMode ? 'bg-dark border-secondary' : 'bg-white'}`}>
              <div className="card-body p-4">
                {/* Progress Bar */}
                {renderProgressBar()}
                
                {/* Step Indicator */}
                {renderStepIndicator()}
                
                {/* Form Content */}
                <div className="mb-4">
                  {renderStepContent()}
                </div>
                
                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>
                  
                  <div>
                    {currentStep < totalSteps ? (
                      <button className="btn btn-primary" onClick={nextStep}>
                        Next
                      </button>
                    ) : (
                      <button className="btn btn-success" onClick={submitForm}>
                        Submit Application
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`mt-auto py-4 ${isDarkMode ? 'bg-dark border-top border-secondary' : 'bg-white border-top'}`}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="mb-0">© 2024 Training & Placement Office</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">Step {currentStep} of {totalSteps}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
