import { useState } from "react";
import { Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

import '../App.css';

interface IResetPasswordFormProps {
  recoverPassword: (email: string) => Promise<void>;
  statusSended: boolean;
  statusMessage: string;
}

export default function RecoverPasswordForm({ recoverPassword: recoverPassword, statusSended, statusMessage }: IResetPasswordFormProps) {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="mb-3">
        <Label htmlFor="email" className="form-label">Ingresa la dirección de correo asociada a la plataforma</Label>
        <Input type="email" id="email" placeholder="Ingresá tu correo registrado" onChange={(e) => setEmail(e.target.value)} />
        {statusMessage && <p className={statusSended ? "text-success" : "text-danger"}>{statusMessage}</p>}
      </div>
      <p className="text-muted">Te enviaremos a tu correo electrónico un enlace que te permitirá restablecer tu contraseña</p>
      <div className="d-flex justify-content-between mt-4">
        <button onClick={() => navigate('/login')} style={{
          backgroundColor: "transparent",
          border: "none",
          color: "#6c757d",
          textDecoration: "underline",
          cursor: "pointer",
        }}>
          Volver
        </button>
        <button className="btn-purple-1" onClick={() => email && recoverPassword(email)}>
          Recuperar contraseña
        </button>
      </div>
    </div>
  );
}