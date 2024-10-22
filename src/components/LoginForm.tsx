import { useState } from "react";
import { Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import { FormValidators } from "../utils/FormValidators";
import { API_URL } from "../config";
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

      {showAlert &&
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            color: "red",
            marginBottom: "1rem",
          }}
        > {message}
        </div>
      }

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "60%",
          gap: "1rem",
          margin: "auto",
        }}
      >
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
          if (!authStatus) {
            setShowAlert(true);
            setMessage('Usuario o contraseña incorrecto');
            setTimeout(() => {
              setShowAlert(false);
              setMessage('');
            }, 3000);
          }
        }}>
          <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "10px" }} />
          Iniciar Sesión con email
        </button>

        <button className="btn-purple-2" onClick={() => { window.location.href = `${API_URL}/auth/google`; }}>
          <FontAwesomeIcon icon={faGoogle} style={{ marginRight: "10px" }} />
          Iniciar Sesión con Google
        </button>

        <button onClick={() => navigate("/forgotPassword")} style={{
          backgroundColor: "transparent",
          border: "none",
          color: "#6c757d",
          textDecoration: "none",
          cursor: "pointer",
        }}>
          Olvidé mi contraseña
        </button>

      </div>
    </div>
  );
}
