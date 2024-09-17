import { Card, CardBody, CardTitle, Input } from 'reactstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { get } from '../../utils/network';

import '../../assets/styles/LearningTypePage.css';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


const result: { [key: string]: { description: string; image: string } } = {
    'DIVERGENTE': {
        "description": "Se benefician del estudio de mapas conceptuales, las discusiones en grupo y las actividades prácticas. Prefieren materiales que les permitan explorar y colaborar",
        "image": 'https://blog.newportschool.edu.co/hubfs/Imported_Blog_Media/6-Feb-28-2024-05-08-47-7970-PM.png',
    },
    "CONVERGENTE": {
        "description": "Se benefician de problemas prácticos, hojas de trabajo y actividades interactivas. Prefieren materiales que les permitan aplicar conceptos teóricos a situaciones reales.",
        "image": 'https://blog.newportschool.edu.co/hubfs/Imported_Blog_Media/5-Feb-28-2024-05-08-44-6756-PM.png'
    },
    "ASIMILADOR": {
        "description": "Prefieren resúmenes, diagramas y presentaciones estructuradas. Les gustan los contenidos que proporcionan una visión detallada y lógica de los conceptos.",
        "image": "https://blog.newportschool.edu.co/hubfs/Imported_Blog_Media/7-Feb-28-2024-05-08-58-7610-PM.png",
    },
    "ACOMODADOR": {
        "description": 'Disfrutan de videos, talleres y proyectos prácticos. Les gusta el contenido que les permita experimentar y descubrir por sí mismos.',
        "image": 'https://blog.newportschool.edu.co/hubfs/Imported_Blog_Media/8-Feb-28-2024-05-08-49-5639-PM.png'
    },
}


export const StudentLearningTypeResult = () => {
    const [learningProfile, setLearningProfile] = useState<string | null>(null);
    const location = useLocation();
    
    useEffect(() => {
        // get(`/students/${user.id}/learning-profile`).then((res) => {
        //     setLearningProfile(res.data);
        // });
        setLearningProfile(location.state.profile as string ?? 'DIVERGENTE');

    }, []);

    return ( <div
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
        <h2>Resultado del test de aprendizaje</h2>
        <hr />
        {learningProfile ? (<>

        <h2>Según el test realizado, tu perfil de aprendizaje es <b>{learningProfile?.toLocaleLowerCase()}</b></h2>
        <span>Aquellas personas con tu perfil de aprendizaje:</span>
        <span>{(result[learningProfile]).description }</span>

        <img src={(result[learningProfile]).image} alt="learning-type" style={{ width: '70%', height: 'auto', alignSelf: 'center' }} />
        

        </>) : "Cargando..." }
      </Card>
    </div>
  </div>
    );
}
