import { useEffect, useState } from "react";
import { Card, } from "reactstrap";
import { useNavigate } from "react-router-dom";

import logo from '../../assets/images/logo_black.png';
import SetPasswordForm from "../../components/SetPasswordForm";

import { FormValidators } from "../../utils/FormValidators";
import { post } from "../../utils/network";

const SetPasswordPage = () => {
  const [statusSended, setStatusSended] = useState(false);
  const [statusMessage, setMessage] = useState('');
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    if (!token) {
      console.warn('No token provided');
      navigate('/');
    }
  }, [token]);

  const handleSetPassword = async (newPassword: string, newPasswordConfirmation: string) => {
    if (newPassword !== newPasswordConfirmation) {
      setMessage('Las contraseñas no coinciden');
      setTimeout(() => {
        setMessage('');
      }, 2000);
      return;
    }
    const passwordValidation = FormValidators.isSecurePassword(newPassword);
    if (!passwordValidation) {
      setMessage('La contraseña no es segura');
      setTimeout(() => {
        setMessage('');
      }, 2000);
      return;
    }

    const setPasswordResponse = await post(`/auth/setPassword?token=${token}`, { newPassword, newPasswordConfirmation })
      .then(res => {
        return res.ok;
      })
      .catch(err => {
        console.error(`An unexpected error occurred: ${err}`);
        return false;
      });

    if (setPasswordResponse) {
      setStatusSended(true);
      setMessage('Se actualizó la contraseña correctamente');
    } else {
      setMessage('Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde');
      return;
    }

    setTimeout(() => {
      setStatusSended(false);
      setMessage('');
      navigate('/login');
    }, 4000);
    return;
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
        <SetPasswordForm
          setPassword={handleSetPassword}
          statusSended={statusSended}
          statusMessage={statusMessage}
        />
      </Card>
    </div>
  );
};

export default SetPasswordPage;
