import { Card, CardBody, CardTitle } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import { RootState } from '../../../redux/store';

import '../../../assets/styles/LearningTypePage.css';

const testPreviousComments = [
  "Ubicate en un lugar tranquilo con conexión a internet",
  "Podes poner música de fondo",
  "Te llevará entre X y X minutos realizar el test",
  "Al finalizar el resultado aparecerá en pantalla y quedará asociado a tu usuario",
  "Responde con sinceridad ya que el contenido de la plataforma se adaptará en función del resultado obtenido",
  "[IMPORTANTE] Por cada pregunta tenes que seleccionar una opción numericamente del 1 a 4 SIN REPETIR",
];

export const StudentLearningTypePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

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
        <div className="row">
          <ul>
            <Card className='profile-card-init'
            style={{
              width: '100%',
              maxWidth: '1100px',
              padding: '20px',
            }}
            >
              <CardTitle tag="h3">Consideraciones antes de realizar el test</CardTitle>
              <CardBody>
                <ol>
                  {testPreviousComments.map((comment, index) => (
                    <div key={index}>
                      <li>{comment}</li>
                    </div>
                  ))}
                </ol>
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
