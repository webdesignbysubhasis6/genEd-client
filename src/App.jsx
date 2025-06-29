import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Student from './components/Student';
import Attendance from './components/Attendance';
import { Toaster } from './components/ui/sonner';
import Teacher from './components/Teacher';
import PredictCgpa from './components/PredictCgpa';
import TrackAttendance from './components/TrackAttendance';
import ThemeProvider from './components/Theme/ThemeProvider';
import ThemeToggle from './components/Theme/ThemeToggle';
import TrackByStudent from './components/TrackByStudent';
import Feedback from './components/Feedback';
import Feedbacks from './components/Feedbacks';
import LearningPathRecommendation from './components/LearningPathRecommendation';
import LearningPath from './components/LearningPath';

const App = () => {
  return (
    // <ThemeProvider defaultTheme="dark">
    <Router>
    <Toaster/>
    {/* <ThemeToggle /> */}
      <Routes>
        {/* Landing page */}
        
        <Route path="/" element={<Landing />} />

        {/* Nested routes under Home */}
        <Route path="/home" element={<Home />}>
        {/* <Route index element={<Profile />} /> */}
          <Route path="profile" element={<Profile />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="student" element={<Student />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="teacher" element={<Teacher />} />
          <Route path="track" element={<TrackAttendance />} />
          <Route path="predict" element={<PredictCgpa />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="feedbacks" element={<Feedbacks />} /> 
          <Route path="recommendation" element={<LearningPath />} /> 
          <Route path="trackbystudent" element={<TrackByStudent />} />
        </Route>
      </Routes>
    </Router>
    // </ThemeProvider>
  );
};

export default App;
