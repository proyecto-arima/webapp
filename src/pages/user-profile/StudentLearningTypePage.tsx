import { Card, CardBody, CardTitle, Input } from 'reactstrap';
import { useNavigate } from "react-router-dom";

import '../../assets/styles/LearningTypePage.css'

const testPreviousComments = [
  "Ubicate en un lugar tranquilo con conexión a internet",
  "Podes poner música de fondo",
  "Te llevará entre X y X minutos realizar todo el text",
  "Al finalizar el resultado aparecerá en pantalla y quedará asociado a tu usuario",
  "Es importante que lo respondas con sinceridad ya que el contenido de la plataforma se adaptará en función del resultado  obtenido"
];

export const StudentLearningTypePage = () => {
  const navigate = useNavigate();

  const doTest = () => {
    navigate('/me/learning-type/test');
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
      <div className="container">
        <div className='profile-learningtype-page-container'>
          <h1>Test de aprendizaje</h1>
        </div>

        <div className="row">
          <ul>
            <Card className='profile-card-init'>
              <CardTitle tag="h5">Consideraciones antes de realizar el test</CardTitle>
              <CardBody>
                {testPreviousComments.map((comment, index) => (
                  <div key={index}>
                    <Input type='checkbox' defaultChecked />
                    <span>{comment}</span>
                  </div>
                ))}
              </CardBody>
            </Card>

          </ul>
          <ul>
            <button className="btn-purple-primary" onClick={() => doTest()}>
              Comenzar test
            </button>
          </ul>
        </div>
      </div>
    </div>
  );
};
