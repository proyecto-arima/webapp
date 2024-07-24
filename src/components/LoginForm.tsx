import { useState } from "react";
import { Input, Label } from "reactstrap";
import './login-form.css';

interface ILoginFormProps {
  login: (email: string, password: string) => Promise<void>;
}

export default function LoginForm({ login }: ILoginFormProps) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      <div className="d-flex justify-content-between mt-4">
        <span className="text-muted">
          <a href="#forgot-password">Olvidé mi contraseña</a>
        </span>
        <button className="btn-purple-1" onClick={() => login(email, password)}>
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}
