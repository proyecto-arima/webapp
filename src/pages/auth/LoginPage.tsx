import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card } from "reactstrap";

import logo from '../../assets/images/logo_black.png';
import LoginForm from "../../components/LoginForm";

import { useEffect } from "react";
import { login } from "../../redux/slices/auth";
import { setUser } from "../../redux/slices/user";
import { RootState } from "../../redux/store";
import { get, post } from "../../utils/network";
import { setCourses } from "../../redux/slices/courses";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const signin = async (email: string, password: string) => {
    await post('/auth', { email, password }).then(res => {
      if (res.ok) {
        dispatch(login());
      }
    }).then(() => get('/users/me')).then(res => res.json()).then(res => {
      const user = res.data;
      dispatch(setUser(user));
      return user;
    })
    .then((user) => {
      if(user.role === 'TEACHER' || user.role === 'STUDENT') {
        const getCourses = user.role === 'TEACHER' ? get('/teachers/me/courses') : get('/students/me/courses');
        return getCourses.then(res => res.json()).then(res => {
          dispatch(setCourses(res.data));
        }).then(() => navigate('/courses/dashboard'));
      }
      if(user.role === 'ADMIN') {
        navigate('/directors');
      }
      if(user.role === 'DIRECTOR') {
        navigate('/students');
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <Card style={{ width: '35%', paddingInline: '2rem', paddingBlock: '1rem' }}>

        <div className="text-center">
          <img src={logo} alt="Proyecto Arima" style={{ height: '10rem' }} />
        </div>
        <LoginForm login={signin} />

      </Card>
    </div>
  );
};

export default LoginPage;
