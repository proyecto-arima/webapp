import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { API_URL } from './config';
import './App.css';

import SidebarStudents from './components/SidebarStudents';
import NotImplemented from './components/NotImplemented';

import { login } from './redux/slices/auth';
import { RootState } from './redux/store';

import ProtectedRoute from './utils/ProtectedRoute';

import Login from './pages/auth/LoginPage';
import SidebarCourses from './pages/courses/SidebarCourses';
import { StudentCreationPage } from './pages/students/StudentCreationPage';
import { CourseCreationPage } from './pages/courses/CourseCreationPage';
import { CourseDashboardPage } from './pages/courses/CourseDashboardPage';
import { CourseProvider } from './pages/courses/contexts/CourseContext';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      fetch(`${API_URL}/auth`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }).then(res => {
        if (res.ok) {
          console.log('User is authenticated');
          // dispatch(login());
          // TODO: ask for the role an redirect to the correct page for the role or setup login for each role
        } else {
          console.log('User is not authenticated');
        }
      })
    }
  }, [isAuthenticated])

  return (
    <CourseProvider>
      <div className='main-content'>
      {/* {isAuthenticated} */}
      <Routes>
        {/* Not protected routes */}
        <Route path="/" element={<NotImplemented />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        {/* <Route path='/students/*' element={<ProtectedRoute>{<StudentCreationPage /> && <SidebarStudents />}</ProtectedRoute>} /> */}

        {/* Testing routes with not auth. DEBUG ONLY */}
        <Route path='/students/*' element={<StudentCreationPage />} />
        <Route path="/courses/" element={<CourseDashboardPage />} />
        <Route path="/courses/new" element={<CourseCreationPage />} />
        <Route path="/courses/dashboard" element={<CourseDashboardPage />} />
      </Routes>
    </div>
    </CourseProvider>
   
  );
}

export default App;
