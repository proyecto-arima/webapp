import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { login } from '../redux/slices/auth';
import { setCourses } from '../redux/slices/courses';
import { setUser } from '../redux/slices/user';
import { RootState } from '../redux/store';
import CourseRoutes from '../routes/CourseRouter';
import DirectorRouter from '../routes/DirectorRouter';
import InstitutesRouter from '../routes/InstitutesRouter';
import ProfileRouter from '../routes/ProfileRouter';
import StudentRouter from '../routes/StudentRouter';
import { get } from '../utils/network';

export const Index = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user);
  //const navigate = useNavigate();

  useEffect(() => {
    if(user.role === 'TEACHER' || user.role === 'STUDENT') {
      navigate('/courses/dashboard');
    }
    if(user.role === 'ADMIN') {
      navigate('/directors');
    }
  }, [user?.role])

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated) return;
    
    get('/auth')
      .then(res => {
        if (res.ok) {
          if (!isAuthenticated) {
            dispatch(login());
          }
        }
      })
      .then(() => get('/users/me')).then(res => res.json()).then(res => {
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
        if (location.href.includes('/login') || location.href.includes('/recoverPassword')) {
          navigate('/');
        }
      })
      .catch(err => {
        console.error(`An unexpected error occurred while checking the authentication status: ${err}`);
      });
  }, []);

  return (
    <>
      {isAuthenticated && <Sidebar />}
      <Routes>
        <Route path='/students/*' element={<StudentRouter />} />
        <Route path='/courses/*' element={<CourseRoutes />} />
        <Route path='/directors/*' element={<DirectorRouter />} />
        <Route path='/institutes/*' element={<InstitutesRouter />} />
        <Route path='/me/*' element={<ProfileRouter />} />
      </Routes></>
  );
};
