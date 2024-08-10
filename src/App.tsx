import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

import './App.css';
import { DEBUG } from './config';

import { login } from './redux/slices/auth';
import { RootState } from './redux/store';


import NotImplementedPage from './components/NotImplementedPage';
import LoginPage from './pages/auth/LoginPage';
import RecoverPasswordPage from './pages/auth/RecoverPasswordPage';
import CourseRoutes from './routes/CourseRouter';
import StudentRouter from './routes/StudentRouter';

import Sidebar from './components/Sidebar';
import SetPasswordPage from './pages/auth/SetPasswordPage';
import { setCourses } from './redux/slices/courses';
import { setUser } from './redux/slices/user';
import { get } from './utils/network';
import ProtectedRoute from './utils/ProtectedRoute';
import DirectorRouter from './routes/DirectorRouter';
import { Index } from './pages/Index';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    get('/auth').then(res => {
      if (res.ok) {
        if (!isAuthenticated) {
          dispatch(login());
        }
      }
    }).then(() => get('/users/me')).then(res => res.json()).then(res => {
      dispatch(setUser(res.data));
      return res.data;
    })
      .then((user) => {
        if (user.role === 'TEACHER') {
          return get('/teachers/me/courses')
        }
        if (user.role === 'STUDENT') {
          return get('/students/me/courses')
        }
      })
      .then(res => res.json())
      .then(res => {
        dispatch(setCourses(res.data));
      })
      .then(() => {
        if(location.href.includes('/login') || location.href.includes('/recoverPassword')) {
          navigate('/');
        }
      })
      
      .catch(err => {
        console.error(`An unexpected error occurred while checking the authentication status: ${err}`);
      });
  }, []);

  return (
    <div className='main-content'>

      {isAuthenticated && <Sidebar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotPassword" element={<RecoverPasswordPage />} />
        <Route path="/recoverPassword" element={<SetPasswordPage />} />

        {/* Protected routes */}
        {/* <Route path='/students/*' element={<ProtectedRoute>{<StudentCreationPage /> && <SidebarStudents />}</ProtectedRoute>} /> */}


        {DEBUG ? (
          <>
            <Route path='/students/*' element={<StudentRouter />} />
            <Route path='/courses/*' element={<CourseRoutes />} />
            <Route path='/directors/*' element={<DirectorRouter/>} />
          </>
        ) : (
          <>
            <Route path='/students/*' element={<ProtectedRoute>{<StudentRouter />}</ProtectedRoute>} />
            <Route path='/courses/*' element={<ProtectedRoute>{<CourseRoutes />}</ProtectedRoute>} />
            <Route path='/directors/*' element={<ProtectedRoute>{<DirectorRouter/>}</ProtectedRoute>} />
          </>
        )}
      </Routes>

    </div>
  );
}

export default App;
