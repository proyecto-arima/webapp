import { useState } from "react";
import { Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

import { FormValidators } from "../utils/FormValidators";
import '../App.css';

interface ILoginFormProps {
  login: (email: string, password: string) => Promise<boolean>;
}

export default function LoginForm({ login }: ILoginFormProps) {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div>
      <div className="mb-3">
        <Label htmlFor="email" className="form-label">Correo Electrónico</Label>
        <Input type="email" id="email" placeholder="jdoe@frba.utn.edu.ar" onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <Label htmlFor="password" className="form-label">Contraseña</Label>
        <Input type="password" id="password" placeholder="**************" onChange={(e) => setPassword(e.target.value)} />
      </div>
      {showAlert && <div className="text-danger"> {message} </div>}
      <div className="d-flex justify-content-between mt-4">

        <button onClick={() => navigate("/forgotPassword")} style={{
          backgroundColor: "transparent",
          border: "none",
          color: "#6c757d",
          textDecoration: "underline",
          cursor: "pointer",
        }}>
          Olvidé mi contraseña
        </button>
        <button className="btn-purple-1" onClick={async () => {
          if (!FormValidators.isValidEmail(email)) {
            setShowAlert(true);
            setMessage('El email ingresado no es válido.');
            setTimeout(() => {
              setShowAlert(false);
              setMessage('');
            }, 4000);
            return;
          }
          const authStatus = await login(email, password);
          if(!authStatus) {
            setShowAlert(true);
            setMessage('Usuario o contraseña incorrecto');
            setTimeout(() => {
              setShowAlert(false);
              setMessage('');
            }, 3000);
          }
        }}>
          Iniciar Sesión
        </button>

      </div>
    </div>
  );
}
