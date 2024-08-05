import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { API_URL } from './config';
import './App.css';


import NotImplemented from './components/NotImplemented';

import { login } from './redux/slices/auth';
import { RootState } from './redux/store';

import ProtectedRoute from './utils/ProtectedRoute';

import Login from './pages/auth/LoginPage';
import RecoverPasswordPage from './pages/auth/RecoverPasswordPage';

import { StudentCreationPage } from './pages/students/StudentCreationPage';
import { CourseCreationPage } from './pages/courses/CourseCreationPage';
import { CourseDashboardPage } from './pages/courses/CourseDashboardPage';

import CourseRoutes from './routes/CourseRouter';
import StudentRouter from './routes/StudentRouter';
import { StudentProfilePage } from './pages/user-profile/student/StudentProfilePage';
import { StudentProfileLearningTypePage } from './pages/user-profile/student/StudentProfileLearningTypePage';

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
        <Route path="/forgotPassword" element={<RecoverPasswordPage />} />

        {/* Student profile routes page */}
        <Route path="/me/profile" element={<StudentProfilePage />} />
        <Route path="/me/learning-type" element={<StudentProfileLearningTypePage />} />
        <Route path="/me/evaluations" element={<NotImplemented />} />

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
