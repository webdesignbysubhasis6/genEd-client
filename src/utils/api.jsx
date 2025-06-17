import axios from "axios";
const authApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/auth/v1`,
  });
  
const studentApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/student/v1`,
});
const attendanceApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/attendance/v1`,
});
const teacherApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/teacher/v1`,
});
const monthClassApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/monthclass/v1`,
});
const gpaApi=axios.create({
    baseURL: import.meta.env.VITE_CGPA_URL
});
const cgpaApi=axios.create({
    baseURL: import.meta.env.VITE_GPA_URL
});
const feedbackApi=axios.create({
    baseURL: import.meta.env.VITE_FEEDBACK_URL
});
const utilsApi=axios.create({
    baseURL:`${import.meta.env.VITE_BACKEND_URL}/api/utils/v1`
});
const recommendApi=axios.create({
    baseURL:`${import.meta.env.VITE_RECOMMEND_URL}`
});
export {cgpaApi,recommendApi,feedbackApi,authApi,studentApi,attendanceApi,teacherApi,gpaApi,monthClassApi,utilsApi}