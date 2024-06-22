import { useNavigate } from "react-router-dom";
import { Input, Label } from "reactstrap";
import './login-form.css';

export default function LoginForm() {


  const navigate = useNavigate();

  return (
    // <Form>
    //   <Form.Group className="mb-3" controlId="formBasicEmail">
    //     <Form.Label>Correo Electrónico</Form.Label>
    //     <Form.Control type="email" placeholder="jdoe@frba.utn.edu.ar" />
    //   </Form.Group>
    //   <Form.Group className="mb-3" controlId="formBasicPassword">
    //     <Form.Label>Contraseña</Form.Label>
    //     <Form.Control type="password" placeholder="**************" />
    //   </Form.Group>
    //   <div className="d-flex justify-content-between mt-4">
    //     <Form.Text className="text-muted">
    //       <a href="#forgot-password">Olvidé mi contraseña</a>
    //     </Form.Text>
    //     <Button variant="primary" type="submit">
    //       Iniciar Sesión
    //     </Button>
    //   </div>
    // </Form>
    <div>
      <div className="mb-3">
        <Label htmlFor="email" className="form-label">Correo Electrónico</Label>
        <Input type="email" id="email" placeholder="jdoe@frba.utn.edu.ar" />
      </div>
      <div className="mb-3">
        <Label htmlFor="password" className="form-label">Contraseña</Label>
        <Input type="password" id="password" placeholder="**************" />
      </div>
      <div className="d-flex justify-content-between mt-4">
        <span className="text-muted">
          <a href="#forgot-password">Olvidé mi contraseña</a>
        </span>
        <button className="btn-purple-1" onClick={() => navigate('/')}>
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}
