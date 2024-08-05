import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import { API_URL, DEBUG } from './config';

import { login } from './redux/slices/auth';
import { RootState } from './redux/store';


import NotImplementedPage from './components/NotImplementedPage';
import LoginPage from './pages/auth/LoginPage';
import RecoverPasswordPage from './pages/auth/RecoverPasswordPage';
import CourseRoutes from './routes/CourseRouter';
import StudentRouter from './routes/StudentRouter';

import SetPasswordPage from './pages/auth/SetPasswordPage';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${API_URL}/auth`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then(res => {
      if (res.ok) {
        if (!isAuthenticated) {
          dispatch(login());
        }
      }
    }).catch(err => {
      console.error(`An unexpected error occurred while checking the authentication status: ${err}`);
    });
  }, [isAuthenticated]);

  return (
    <div className='main-content'>
      {/* {isAuthenticated} */}

      <Routes>
        <Route path="/" element={<NotImplementedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotPassword" element={<RecoverPasswordPage />} />
        <Route path="/recoverPassword" element={<SetPasswordPage />} />

        {/* Protected routes */}
        {/* <Route path='/students/*' element={<ProtectedRoute>{<StudentCreationPage /> && <SidebarStudents />}</ProtectedRoute>} /> */}


        {/* Testing routes with not auth. DEBUG ONLY */}
        <Route path='/students/*' element={<StudentRouter />} />
        <Route path="/courses/*" element={<CourseRoutes />} />

        {DEBUG ? (
          <>
            <Route path='/students/*' element={<StudentRouter />} />
            <Route path='/courses/*' element={<CourseRoutes />} />
          </>
        ) : (
          <>
            <Route path='/students/*' element={<ProtectedRoute>{<StudentRouter />}</ProtectedRoute>} />
            <Route path='/courses/*' element={<ProtectedRoute>{<CourseRoutes />}</ProtectedRoute>} />
          </>
        )}
      </Routes>

    </div>
  );
}

export default App;
