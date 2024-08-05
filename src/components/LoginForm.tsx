import { useState } from "react";
import { Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

import '../App.css';

interface ILoginFormProps {
  login: (email: string, password: string) => Promise<void>;
}

export default function LoginForm({ login }: ILoginFormProps) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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

        <button className="btn-purple-2" onClick={() => navigate("/forgotPassword")}>
          Olvidé mi contraseña
        </button>
        <button className="btn-purple-1" onClick={() => email && password && login(email, password)}>
          Iniciar Sesión
        </button>

      </div>
    </div>
  );
}
