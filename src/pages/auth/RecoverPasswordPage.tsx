
import logo from '../../assets/images/logo_black.png';
import { useState } from "react";
import { Card, } from "reactstrap";
import { API_URL } from "../../config";
import RecoverPasswordForm from "../../components/RecoverPasswordForm";

const RecoverPassword = () => {

  const [statusSended, setStatusSended] = useState(false);
  const [statusMessage, setMessage] = useState('');

  const handleRecoverPassword = async (email: string) => {
    const recoveryEmailResponse = await fetch(`${API_URL}/auth/passwordRecovery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(res => {
      return res.ok;
    }).catch(err => {
      console.error(`An unexpected error occurred: ${err}`);
      return false;
    });

    if (recoveryEmailResponse) {
      setStatusSended(true);
      setMessage('Se envio el correo con las instrucciones para recuperar tu contraseña');
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
      <Card style={{ width: '35%', paddingInline: '2rem', paddingBlock: '1rem' }}>
        <div className="text-center">
          <img src={logo} alt="Proyecto Arima" style={{ height: '10rem' }} />
        </div>
        <RecoverPasswordForm
          recoverPassword={handleRecoverPassword}
          statusSended={statusSended}
          statusMessage={statusMessage}
        />
      </Card>

    </div>
  );
};

export default RecoverPassword;
