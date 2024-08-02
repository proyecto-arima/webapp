import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router} from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import { API_URL } from './config';
import './App.css';


import NotImplemented from './components/NotImplemented';

import { login } from './redux/slices/auth';
import { RootState } from './redux/store';

import ProtectedRoute from './utils/ProtectedRoute';

import Login from './pages/auth/LoginPage';
import { StudentCreationPage } from './pages/students/StudentCreationPage';
import { CourseCreationPage } from './pages/courses/CourseCreationPage';
import { CourseDashboardPage } from './pages/courses/CourseDashboardPage';
import {SectionCreationPage} from './pages/courses/SectionCreationPage';
import { CourseProvider } from './pages/courses/contexts/CourseContext';

import CourseRoutes from './routes/CourseRouter';
import StudentRouter from './routes/StudentRouter';
import { SectionProvider } from './pages/courses/contexts/SectionContext';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${API_URL}/auth`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then(res => {
      console.log(isAuthenticated);
      if (!isAuthenticated) {
        if (res.ok) {
          console.log('User is authenticated');
          // dispatch(login());
          // TODO: ask for the role an redirect to the correct page for the role
        } else {
          console.warn('User is not authenticated');
        }
      }
    }).catch(err => {
      console.error('An unexpected error occurred while checking the authentication status');
      console.error(err);
    });
  }, [isAuthenticated]);

  return (
    <div className='main-content'>
      {/* {isAuthenticated} */}

      <Routes>
        {/* Not protected routes */}
        <Route path="/" element={<NotImplemented />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        {/* <Route path='/students/*' element={<ProtectedRoute>{<StudentCreationPage /> && <SidebarStudents />}</ProtectedRoute>} /> */}

    
        {/* Testing routes with not auth. DEBUG ONLY */}
        <Route path='/students/*' element={<StudentRouter />} />
        <Route path="/courses/*" element={<CourseRoutes />} />
        
      </Routes>

    </div>

  );
}

export default App;
