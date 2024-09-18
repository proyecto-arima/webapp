import { Card, CardBody, CardTitle, Input } from 'reactstrap';
import { useNavigate } from "react-router-dom";

import '../../assets/styles/LearningTypePage.css'

const testPreviousComments = [
  "Ubicate en un lugar tranquilo con conexión a internet",
  "Podes poner música de fondo",
  "Te llevará entre 3 y 7 minutos realizar todo el test",
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
      alignItems: 'flex-start',  /* Alinea el contenido al inicio, en lugar de al centro */
      height: '100vh',
      backgroundColor: '#f6effa',
      width: '100vw',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', /* Alinea el contenido al principio */
        padding: '20px',
        width: '100%',
        height: '100%',
      }}
    >
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
        <h2>Test de Aprendizaje</h2>
        <hr />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          gap: '1rem',
        }}>
          <div>
            <CardTitle>
              <h3>Antes de comenzar...</h3>
            </CardTitle>
            <CardBody>
              <ul>
                {testPreviousComments.map((comment, index) => (
                  <li key={index}>{comment}</li>
                ))}
              </ul>
            </CardBody>
          </div>
          <div className='d-flex flex-row w-100 justify-content-end'>
            <button className="btn-purple-1" onClick={doTest}>Comenzar</button>
          </div>
        </div>
      </Card>
    </div>
  </div>

  );
};
