
import logo from '../../assets/images/logo_black.png';
import { useState } from "react";
import { Card, } from "reactstrap";
import { API_URL } from "../../config";
import SetPasswordForm from "../../components/SetPasswordForm";

const SetPasswordPage = () => {

  const [statusSended, setStatusSended] = useState(false);
  const [statusMessage, setMessage] = useState('');

  const handleSetPassword = async (newPassword: string, newPasswordConfirmation: string) => {

    // TODO: Validaciones del formulario

    const token = new URLSearchParams(window.location.search).get('token');
    const validToken = token?.split('.').length === 3 ? token : null;


    // const setPasswordResponse = await fetch(`${API_URL}/auth/passwordRecovery`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    // }).then(res => {
    //   console.log(res);
    //   console.log(res.ok);
    //   return res.ok;
    // }).catch(err => {
    //   console.error(`An unexpected error occurred: ${err}`);
    //   return false;
    // });
    const setPasswordResponse = true;

    if (setPasswordResponse) {
      setStatusSended(true);
      // TODO: esperar respuesta del servidor
      setMessage('Se actualizo la contraseña correctamente');
    } else {
      setStatusSended(false);
      setMessage('Ocurrio un error inesperado. Por favor, intenta de nuevo más tarde');
    }
    setTimeout(() => {
      setStatusSended(false);
      setMessage('');
    }, 5000);
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
        {new URLSearchParams(window.location.search).get('token') ? (
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
