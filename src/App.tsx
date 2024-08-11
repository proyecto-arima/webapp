import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

import './App.css';

import { login } from './redux/slices/auth';
import { RootState } from './redux/store';


import NotImplementedPage from './components/NotImplementedPage';
import LoginPage from './pages/auth/LoginPage';
import RecoverPasswordPage from './pages/auth/RecoverPasswordPage';

import CourseRoutes from './routes/CourseRouter';
import StudentRouter from './routes/StudentRouter';
import ProfileRouter from './routes/ProfileRouter';

import Sidebar from './components/Sidebar';
import SetPasswordPage from './pages/auth/SetPasswordPage';
import { setCourses } from './redux/slices/courses';
import { setUser } from './redux/slices/user';
import { get } from './utils/network';
import ProtectedRoute from './utils/ProtectedRoute';


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
        navigate('/login');
      }).catch(err => {
        console.error(`An unexpected error occurred while checking the authentication status: ${err}`);
      });
  }, []);

  return (
    <div className='main-content'>
      {isAuthenticated && <Sidebar />}
      <Routes>
        <Route path="/" element={<NotImplementedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotPassword" element={<RecoverPasswordPage />} />
        <Route path="/recoverPassword" element={<SetPasswordPage />} />

        <Route path='/students/*' element={<ProtectedRoute>{<StudentRouter />}</ProtectedRoute>} />
        <Route path='/courses/*' element={<ProtectedRoute>{<CourseRoutes />}</ProtectedRoute>} />
        <Route path='/me/*' element={<ProtectedRoute>{<ProfileRouter />}</ProtectedRoute>} />
      </Routes>

    </div>
  );
}

export default App;
