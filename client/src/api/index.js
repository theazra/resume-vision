import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

export const signIn = (formData) => API.post('/auth/login', formData);
export const signUp = (formData) => API.post('/auth/register', formData);

export const uploadCV = (formData) => API.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const fetchCVs = () => API.get('/api/cvs');
export const deleteCV = (id) => API.delete(`/api/cv/${id}`);
export const fetchJobs = (id) => API.get(`/api/jobs${id ? `?cv_id=${id}` : ''}`);
export const generateContent = (formData) => API.post('/api/generate-content', formData);
export const forgotPassword = (formData) => API.post('/auth/forgot-password', formData);
export const resetPassword = (formData) => API.post('/auth/reset-password', formData);
export const analyzeSkillGap = (data) => API.post('/api/analyze-skill-gap', data);
export const generateInterviewQuestions = (data) => API.post('/api/generate-interview-questions', data);

// Resume CRUD (Created CVs)
export const createResume = (data) => API.post('/api/resume', data);
export const getResume = (id) => API.get(`/api/resume/${id}`);
export const updateResume = (id, data) => API.put(`/api/resume/${id}`, data);
export const fetchResumes = () => API.get('/api/resumes');
export const deleteResume = (id) => API.delete(`/api/resume/${id}`);
export const downloadPDF = (data) => API.post('/api/download-pdf', data, { responseType: 'blob' });
