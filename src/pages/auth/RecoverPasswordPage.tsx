
import logo from '../../assets/images/logo_black.png';
import { useNavigate } from "react-router-dom";
import { Card, } from "reactstrap";
import { API_URL } from "../../config";
import RecoverPasswordForm from "../../components/RecoverPasswordForm";

const RecoverPassword = () => {

  const recoverPassword = async (email: string) => {
    // const res = await fetch(`${API_URL}/auth`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    //   credentials: 'include',
    // });

    // if (res.ok) {
    //   navigate('/students/new');
    // }
    console.log("testing");
    
  }

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
        <RecoverPasswordForm recoverPassword={recoverPassword}/>
      </Card>

    </div>
  );
};

export default RecoverPassword;
