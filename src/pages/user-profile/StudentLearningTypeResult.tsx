import { Card } from 'reactstrap';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/LearningTypePage.css';

import acomodador from '../../assets/images/acomodador.png';
import asimilador from '../../assets/images/asimilador.png';
import convergente from '../../assets/images/convergente.png';
import divergente from '../../assets/images/divergente.png';


const result: { [key: string]: { description: string; image: string } } = {
  'SIN_PERFIL': {
    "description": "",
    "image": '',
  },
  'DIVERGENTE': {
    "description": "Se benefician del estudio de mapas conceptuales, las discusiones en grupo y las actividades prácticas. Prefieren materiales que les permitan explorar y colaborar",
    "image": divergente,
  },
  "CONVERGENTE": {
    "description": "Se benefician de problemas prácticos, hojas de trabajo y actividades interactivas. Prefieren materiales que les permitan aplicar conceptos teóricos a situaciones reales.",
    "image": convergente,
  },
  "ASIMILADOR": {
    "description": "Prefieren resúmenes, diagramas y presentaciones estructuradas. Les gustan los contenidos que proporcionan una visión detallada y lógica de los conceptos.",
    "image": asimilador,
  },
  "ACOMODADOR": {
    "description": 'Disfrutan de videos, talleres y proyectos prácticos. Les gusta el contenido que les permita experimentar y descubrir por sí mismos.',
    "image": acomodador,
  },
}

export const StudentLearningTypeResult = () => {
  const [learningProfile, setLearningProfile] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // get(`/students/${user.id}/learning-profile`).then((res) => {
    //     setLearningProfile(res.data);
    // });
    // console.log(location.state);
    setLearningProfile(location.state?.profile as string ?? 'SIN_PERFIL');
  }, []);

  return (<div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: '100vh',
      backgroundColor: '#f6effa',
      width: '100vw',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '20px',
        width: '100%',
        height: '100%',
      }}
    >
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
        <h2>Resultado del test de aprendizaje</h2>
        <hr />
        {learningProfile && learningProfile !== 'SIN_PERFIL' ? (<>

          <h2>Según el test realizado, tu perfil de aprendizaje es <b>{learningProfile?.toLocaleLowerCase()}</b></h2>
          <span>Aquellas personas con tu perfil de aprendizaje:</span>
          <span>{(result[learningProfile]).description}</span>

          <div style={{
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <img src={(result[learningProfile]).image} alt="learning-type" style={{ width: '70%', height: 'auto', alignSelf: 'center' }} />
          </div>
          <div className='d-flex flex-row justify-content-end gap-3'>
            <button className="btn-purple-2" onClick={() => {
              navigate('/me/learning-type');
            }}>Repetir test</button>
            <button className="btn-purple-1" onClick={() => {
              navigate('/courses/dashboard');
            }}>Finalizar</button>
          </div>
        </>) :
          (<>
            <h2>Todavía no hay resultados para el test de aprendizaje</h2>
            <span>Te sugerimos realizar el test para descubrir cual es tu tipo</span>
            <div style={{
              flex: '1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            </div>
            <div className='d-flex flex-row justify-content-end gap-3'>
              <button className="btn-purple-2" onClick={() => {
                navigate('/me/learning-type');
              }}>Comenzar test</button>
            </div>
          </>)
        }
      </Card>
    </div>
  </div>
  );
}
