import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/auth';

import { setCourses } from '../redux/slices/courses';
import { setUser } from '../redux/slices/user';
import { logout } from '../redux/slices/auth';
import { RootState } from '../redux/store';

import CourseRoutes from '../routes/CourseRouter';
import DirectorRouter from '../routes/DirectorRouter';
import InstitutesRouter from '../routes/InstitutesRouter';
import ProfileRouter from '../routes/ProfileRouter';
import StudentRouter from '../routes/StudentRouter';
import { TeacherRouter } from '../routes/TeacherRouter';

import Sidebar from '../components/Sidebar';
import { get, del } from '../utils/network';

export const Index = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchSession = async () => {
    console.info('Checking user session');
    const userSession = await get('/auth')
      .then(async (res) => {
        if (res.ok) {
          const dataResponse = await res.json();
          return dataResponse;
        } else {
          console.error(`Status response failed. Status code ${res.status}`);
          return { success: false };
        }
      })
      .then((res) => {
        if (res.success) {
          dispatch(login());
          return true;
        } else {
          console.warn("User is not authenticated");
          dispatch(logout());
          navigate('/login');
          return false;
        }
      })
      .then(() => get('/users/me'))
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          return false;
        }
        const stateRes = dispatch(setUser(res.data));
        return stateRes.payload;
      })
      .catch((error) => {
        console.error(`An error occurred while retrieve user session: ${error}`);
        return false;
      });
      
    // En caso de roles desconocidos en la sesion, se cierra la sesion y se vuelve a loguear
    if (!userSession || !['TEACHER', 'STUDENT', 'ADMIN', 'DIRECTOR'].includes(userSession.role)) {
      console.warn('Session not found');
      dispatch(logout());
      del('/auth');
      navigate('/login');
      return;
    } else if (userSession.role === 'TEACHER') {
      get('/teachers/me/courses')
        .then(res => res.json())
        .then(res => {
          dispatch(setCourses(res.data));
        })
        .then(() => {
          navigate(window.location.pathname);
        })
        .catch(err => {
          console.error(`An unexpected error occurred while checking the courses of the teacher: ${err}`);
        });
    } else if (userSession.role === 'STUDENT') {
      get('/students/me/courses')
        .then(res => res.json())
        .then(res => {
          dispatch(setCourses(res.data));
        })
        .then(() => {
          navigate(window.location.pathname);
        })
        .catch(err => {
          console.error(`An unexpected error occurred while checking the courses of the student: ${err}`);
        });
    } else if (userSession.role === 'ADMIN') {
      navigate(window.location.pathname);
    } else if (userSession.role === 'DIRECTOR') {
      navigate(window.location.pathname);
    }
  };

  useEffect(() => {
    if (isAuthenticated) return;
    if (isAuthenticated && window.location.pathname === '/') {
      navigate('/me/profile');
      return;
    }
    fetchSession();
  }, []);

  return (
    <>
      {isAuthenticated && <Sidebar />}
      <Routes>
        <Route path='/students/*' element={<StudentRouter />} />
        <Route path='/teachers/*' element={<TeacherRouter />} />
        <Route path='/courses/*' element={<CourseRoutes />} />
        <Route path='/directors/*' element={<DirectorRouter />} />
        <Route path='/institutes/*' element={<InstitutesRouter />} />
        <Route path='/me/*' element={<ProfileRouter />} />
      </Routes></>
  );
};