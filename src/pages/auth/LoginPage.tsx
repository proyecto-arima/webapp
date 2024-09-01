import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card } from "reactstrap";

import logo from '../../assets/images/logo_black.png';
import LoginForm from "../../components/LoginForm";

import { login } from "../../redux/slices/auth";
import { setUser } from "../../redux/slices/user";
import { get, post } from "../../utils/network";
import { setCourses } from "../../redux/slices/courses";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signIn = async (email: string, password: string): Promise<boolean> => {
    const loginData = { email, password };
    const isLogged: boolean = await post('/auth/', loginData)
      .then(async (res) => {
        if (res.ok) {
          const dataResponse = await res.json();
          return dataResponse;
        } else {
          console.error(`Status response failed. Status code ${res}`);
        }
      })
      .then((res) => {
        const data = res.data;
        if (res.success) {
          return data;
        } else {
          console.error(`Failed while getting data: ${res}`);
        }
      })
      .then((data) => {
        if (data) {
          dispatch(login());
          return true;
        }
      })
      .then((isLogged) => {
        if (isLogged) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.error(`An error occurred while trying to sign in: ${error}`);
        return false;
      });

    if (!isLogged) {
      console.error(`User not logged in`);
      return false;
    }

    const user = await get('/users/me')
      .then(async (res) => {
        if (res.ok) {
          const dataResponse = await res.json();
          return dataResponse;
        } else {
          console.error(`Status response failed. Status code ${res}`);
        }
      })
      .then((res) => {
        const data = res.data;
        if (res.success) {
          return data;
        } else {
          console.error(`Failed while getting data: ${res}`);
        }
      })
      .then((data) => {
        if (data) {
          dispatch(setUser(data));
          return data;
        }
      })
      .catch((error) => {
        console.error(`An error occurred while trying to get user data: ${error}`);
      });

    const isData = user ? true : false;
    if(!isData) {
      console.error(`User data not found`);
      return false;
    };

    if (user.role && ['STUDENT', 'TEACHER'].includes(user.role)) {
      const coursesEndpoint = user.role === 'TEACHER' ? '/teachers/me/courses' : '/students/me/courses';
      const isCourses: boolean = await get(coursesEndpoint)
        .then(async (res) => {
          if (res.ok) {
            const dataResponse = await res.json();
            return dataResponse;
          } else {
            console.error(`Status response failed. Status code ${res}`);
          }
        })
        .then((res) => {
          const data = res.data;
          if (res.success) {
            return data;
          } else {
            console.error(`Failed while getting data: ${res}`);
          }
        })
        .then((data) => {
          if (data) {
            dispatch(setCourses(data));
            return true;
          }
        })
        .then((isData) => {
          if (isData) {
            return true;
          } else {
            return false;
          }
        })
        .catch((error) => {
          console.error(`An error occurred while trying to get courses data: ${error}`);
          return false;
        });
      navigate('/courses/dashboard');
      return isLogged && isData && isCourses;
    } else {
      if (user.role === 'ADMIN') {
        navigate('/directors');
      } else if (user.role === 'DIRECTOR') {
        navigate('/students');
      } else {
        console.error("User role not found");
        return false;
      }      
      return isLogged && isData;
    }
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
        <LoginForm login={signIn} />
      </Card>
    </div>
  );

};

export default LoginPage;
