import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

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
import { get } from '../utils/network';

export const Index = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === 'TEACHER' || user.role === 'STUDENT') {
      navigate('/courses/dashboard');
    }
    if (user.role === 'ADMIN') {
      navigate('/directors');
    }
  }, [user?.role])

  useEffect(() => {
    if (isAuthenticated) return;
    if (!localStorage.getItem('token')) {
      dispatch(logout());
      navigate('/login');
      return;
    }
    get('/auth')
      .then(async (res) => {
        if (res.ok) {
          const dataResponse = await res.json();
          return dataResponse;
        } else {
          console.error(`Status response failed. Status code ${res}`);
        }
      })
      .then((res) => {
        if (res.success) {
          return true;
        } else {
          console.error("User is not authenticated, redirecting ...");
          dispatch(logout());
          navigate('/login');
          return false;
        }
      })
      .then(() => get('/users/me'))
      .then(res => res.json())
      .then(res => dispatch(setUser(res.data)))
      .catch((error) => {
        console.error(`An error occurred while retrieve user session: ${error}`);
        return false;
      })
      .catch((error) => {
        console.error(`An error occurred while retrieve user session: ${error}`);
        return false;
      });

      if (user.role === 'TEACHER') {
        get('/teachers/me/courses')
          .then(res => res.json())
          .then(res => {
            dispatch(setCourses(res.data));
          })
          .then(() => {
            navigate('/courses/dashboard');
          })
          .catch(err => {
            console.error(`An unexpected error occurred while checking the courses of he teacher: ${err}`);
          });
      }
      else if (user.role === 'STUDENT') {
        get('/students/me/courses')
          .then(res => res.json())
          .then(res => {
            dispatch(setCourses(res.data));
          })
          .then(() => {
            navigate('/courses/dashboard');
          })
          .catch(err => {
            console.error(`An unexpected error occurred while checking the courses of the student: ${err}`);
          });
      } else if (user.role === 'ADMIN') {
        navigate('/directors');
      } else if (user.role === 'DIRECTOR') {
        navigate('/students');
      } else {
        // En caso de roles desconocidos en la sesion, se cierra la sesion y se vuelve a loguear
        dispatch(logout());
        navigate('/login');
      }
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