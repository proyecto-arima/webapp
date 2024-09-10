import { useEffect, useRef, useState } from 'react';
import { Card } from 'reactstrap';
import DragDropAgreement from './Kolb';



interface IQuestion {
  question: string;
  answers: string[];
}


const questions = [
  {
    "question": "Cuando aprendo:",
    "answers": [
      "Prefiero valerme de mis sensaciones y sentimientos",
      "Prefiero mirar y atender",
      "Prefiero pensar en las ideas",
      "Prefiero hacer cosas"
    ]
  },
  {
    "question": "Aprendo mejor cuando:",
    "answers": [
      "Confío en mis corazonadas y sentimientos",
      "Atiendo y observo cuidadosamente",
      "Confío en mis pensamientos lógicos",
      "Trabajo duramente para que las cosas queden realizadas"
    ]
  },
  {
    "question": "Cuando estoy aprendiendo:",
    "answers": [
      "Tengo sentimientos y reacciones fuertes",
      "Soy reservado y tranquilo",
      "Busco razonar sobre las cosas que están sucediendo",
      "Me siento responsable de las cosas"
    ]
  },
  {
    "question": "Aprendo a través de:",
    "answers": [
      "Sentimientos",
      "Observaciones",
      "Razonamientos",
      "Acciones"
    ]
  },
  {
    "question": "Cuando aprendo:",
    "answers": [
      "Estoy abierto a nuevas experiencias",
      "Tomo en cuenta todos los aspectos relacionados",
      "Prefiero analizar las cosas dividiéndolas en sus partes componentes",
      "Prefiero hacer las cosas directamente"
    ]
  },
  {
    "question": "Cuando estoy aprendiendo:",
    "answers": [
      "Soy una persona intuitiva",
      "Soy una persona observadora",
      "Soy una persona lógica",
      "Soy una persona activa"
    ]
  },
  {
    "question": "Aprendo mejor a través de:",
    "answers": [
      "Las relaciones con mis compañeros",
      "La observación",
      "Teorías racionales",
      "La práctica de los temas tratados"
    ]
  },
  {
    "question": "Cuando aprendo:",
    "answers": [
      "Me siento involucrado en los temas tratados",
      "Me tomo mi tiempo antes de actuar",
      "Prefiero las teorías y las ideas",
      "Prefiero ver los resultados a través de mi propio trabajo"
    ]
  },
  {
    "question": "Aprendo mejor cuando:",
    "answers": [
      "Me baso en mis intuiciones y sentimientos",
      "Me baso en observaciones personales",
      "Tomo en cuenta mis propias ideas sobre el tema",
      "Pruebo personalmente la tarea"
    ]
  },
  {
    "question": "Cuando estoy aprendiendo:",
    "answers": [
      "Soy una persona abierta",
      "Soy una persona reservada",
      "Soy una persona racional",
      "Soy una persona responsable"
    ]
  },
  {
    "question": "Cuando aprendo:",
    "answers": [
      "Me involucro",
      "Prefiero observar",
      "Prefiero evaluar las cosas",
      "Prefiero asumir una actitud activa"
    ]
  },
  {
    "question": "Aprendo mejor cuando:",
    "answers": [
      "Soy receptivo y de mente abierta",
      "Soy cuidadoso",
      "Analizo las ideas",
      "Soy práctico"
    ]
  }
]


export const StudentLearningTypeForm = () => {

  const [current, setCurrent] = useState(0);
  const [sliderValues, setSliderValues] = useState([
    0, 0, 0, 0
  ]);

  return <div
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
            <DragDropAgreement
              answers={questions[current].answers} question={questions[current].question}
            />
          </div>
          <div className='d-flex flex-row justify-content-end mt-5'>
            <button className='btn-purple-1'>
              Siguiente
            </button>
          </div>

        </div>
      </Card>
    </div>
  </div>


};


