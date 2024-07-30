import { useState } from "react";
import { Input, Label } from "reactstrap";
import '../assets/styles/auth-forms.css';
import { useNavigate } from "react-router-dom";

interface IResetPasswordFormProps {
  recoverPassword: (email: string) => Promise<void>;
}

export default function RecoverPasswordForm({ recoverPassword: recoverPassword }: IResetPasswordFormProps) {

  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-3">
        <Label htmlFor="email" className="form-label">¿Olvidates tu contraseña?</Label>
        <Input type="email" id="email" placeholder="Ingresá tu correo registrado" onChange={(e) => setEmail(e.target.value)} />
      </div>
      <p className="text-muted">Te enviaremos a tu correo electrónico un enlace que te permitirá restablecer tu contraseña</p>
      <div className="d-flex justify-content-between mt-4">
        <button className="btn-purple-secondary" onClick={() => navigate('/login')}>
          Volver
        </button>
        <button className="btn-purple-1" onClick={() => recoverPassword(email)}>
          Confirmar
        </button>
      </div>
    </div>
  );
}