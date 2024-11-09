import { useEffect, useRef, useState } from 'react';
import { Card, Progress } from 'reactstrap';
import DragDropAgreement from './Kolb';
import Swal from 'sweetalert2';
import { post } from '../../utils/network';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';


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
  const [testResponses, setTestResponses] = useState<number[][]>([]);
  const navigate = useNavigate();

  return <PageWrapper title="Test de Aprendizaje">
    <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          gap: '1rem',
          overflowY: 'auto'
          
        }}>
          <div style={{
            flex: '1',
          }}>
            <DragDropAgreement
              current={current}
              total={questions.length}
              answers={questions[current].answers} question={questions[current].question} next={(responses) => {
                if (current < questions.length - 1) {
                  setCurrent(current + 1);
                  setTestResponses([...testResponses, responses]);
                  return;
                }

                const finalResponses = [...testResponses, responses].map((response) => response.map((answer) => answer + 1));
                post('/test', { answers: finalResponses }).then(res => res.json()).then((res) => {

                  console.log(res)
                  const profile = res.data;
                  console.log(res.data)

                  Swal.fire({
                    title: '¡Completaste el test de aprendizaje!',
                    text: '¿Querés conocer los resultados?',
                    icon: 'success',
                    confirmButtonText: '¡Sí!'
                  }).then((result) => {
                    navigate('/me/learning-type/result', { state: { profile }})
                  })
                })
              }}

            />
          </div>

        </div>
  </PageWrapper>


};


