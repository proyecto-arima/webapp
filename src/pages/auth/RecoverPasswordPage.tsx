
import logo from '../../assets/images/logo_black.png';
import { useState } from "react";
import { Card, } from "reactstrap";
import RecoverPasswordForm from "../../components/RecoverPasswordForm";
import { post } from '../../utils/network';

const RecoverPassword = () => {

  const [statusSended, setStatusSended] = useState(false);
  const [statusMessage, setMessage] = useState('');

  const handleRecoverPassword = async (email: string) => {
    const recoveryEmailResponse = await post('/auth/passwordRecovery', { email })
      .then(res => {
        return res.ok;
      })
      .catch(err => {
        console.error(`An unexpected error occurred: ${err}`);
        return false;
      });

    if (recoveryEmailResponse) {
      setStatusSended(true);
      setMessage('Se envió el correo con las instrucciones para recuperar tu contraseña');
    } else {
      setStatusSended(false);
      setMessage('Ocurrió un error inesperado. Por favor, intentá de nuevo más tarde');
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
      <Card style={{ width: '40%', paddingInline: '2rem', paddingBlock: '2rem' }}>
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
