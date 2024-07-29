import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card } from "reactstrap";
import logo from '../../assets/logo_black.png';
import LoginForm from "../../components/LoginForm";
import { API_URL } from "../../config";
import { login } from "../../redux/slices/auth";
import { RootState } from "../../redux/store";

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const signin = async (email: string, password: string) => {
    // if (!email || !password) {
    //   console.log('email or password missing');
    //   return;
    // }

    const res = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (res.ok) {
      console.log('signin OK');
      // dispatch(login());
    } else {
      console.log('signin FAIL');
    }

    navigate('/courses');
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

export default Login;
