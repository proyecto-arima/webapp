import { useState } from "react";
import { Card, } from "reactstrap";
import { API_URL } from "../../config";
import logo from '../../assets/images/logo_black.png';
import SetPasswordForm from "../../components/SetPasswordForm";
import { isSecurePassword } from "../../utils/FormValidators";

const SetPasswordPage = () => {
  const [statusSended, setStatusSended] = useState(false);
  const [statusMessage, setMessage] = useState('');
  const token = new URLSearchParams(window.location.search).get('token');

  const handleSetPassword = async (newPassword: string, newPasswordConfirmation: string) => {
    if (newPassword !== newPasswordConfirmation) {
      setMessage('Las contraseñas no coinciden');
      setTimeout(() => {
        setMessage('');
      }, 2000);
      return;
    }
    const passwordValidation = isSecurePassword(newPassword);
    if (!passwordValidation) {
      setMessage('La contraseña no es segura');
      setTimeout(() => {
      setMessage('');
      }, 2000);
      return;
    }
    const setPasswordResponse = await fetch(`${API_URL}/auth/setPassword?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword, newPasswordConfirmation }),
    }).then(res => {
      return res.ok;
    }).catch(err => {
      console.error(`An unexpected error occurred on fetch: ${err}`);
      return;
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
    }, 5000);
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
      {token ? (
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
      ) : (
        <h2>Ocurrio un error inesperado. Por favor, intenta de nuevo más tarde</h2>
      )}
    </div>
  );
};

export default SetPasswordPage;
