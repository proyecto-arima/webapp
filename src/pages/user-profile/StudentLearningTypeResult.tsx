import { Card } from 'reactstrap';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/LearningTypePage.css';

import acomodador from '../../assets/images/acomodador.png';
import asimilador from '../../assets/images/asimilador.png';
import convergente from '../../assets/images/convergente.png';
import divergente from '../../assets/images/divergente.png';
import { useDispatch } from 'react-redux';
import { setLearningProfile as setLearningProfileRedux } from '../../redux/slices/user';

const result: { [key: string]: { description: string; image: string; finalContent: string } } = {
  'SIN_PERFIL': {
    description: "",
    image: '',
    finalContent: ""
  },
  'DIVERGENTE': {
    description:
      "Las personas con aprendizaje divergente son muy buenas viendo una situación desde diferentes perspectivas. " +
      "Se caracterizan por ser creativos e imaginar distintas soluciones para el mismo problema. En general prefieren " +
      "actividades en las que puedan pensar y reflexionar sobre distintas posibilidades, así como también las asociadas " +
      "con el arte y temas humanos. Se destacan también por generar ideas nuevas y encontrar relaciones entre distintas cosas y situaciones.",
    image: divergente,
    finalContent: "mapas conceptuales",
  },
  'CONVERGENTE': {
    description:
      "El aprendizaje convergente es característico de personas que aprenden mejor al resolver problemas concretos. " +
      "Les gusta encontrar la respuesta correcta a las preguntas y suelen sentirse cómodos tomando decisiones. " +
      "A quienes tienen este tipo de aprendizaje les encanta usar la lógica y la razón para resolver desafíos, " +
      "por lo que prefieren trabajar con hechos y datos concretos en lugar de abstracciones. Frecuentemente, disfrutan de asignaturas " +
      "como matemáticas y ciencias duras.",
    image: convergente,
    finalContent: "juegos de preguntas y respuestas",
  },
  'ASIMILADOR': {
    description:
      "El aprendizaje asimilador representa a las personas que prefieren trabajar con conceptos, teorías y abstracciones. " +
      "Disfrutan organizar información, crear modelos y relacionar ideas. Son buenos para entender situaciones complejas " +
      "y disfrutan de temas que requieren mucha lectura y pensamiento. Prefieren la claridad y el análisis frente a la acción inmediata.",
    image: asimilador,
    finalContent: "resúmenes",
  },
  'ACOMODADOR': {
    description:
      "Las personas con estilo de aprendizaje acomodador aprenden mejor experimentando y probando diferentes formas de hacer las cosas. " +
      "Llevan la teoría a la acción y son buenos en la improvisación y resolución de problemas sobre la marcha. " +
      "Disfrutan las actividades prácticas y grupales.",
    image: acomodador,
    finalContent: "audios",
  },
};

export const StudentLearningTypeResult = () => {
  const [learningProfile, setLearningProfile] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const profile = location.state?.profile as string ?? 'SIN_PERFIL';
    setLearningProfile(profile);
    dispatch(setLearningProfileRedux(profile));
  }, []);

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '20px',
          width: '100%',
          height: '100%',
        }}
      >
        <Card style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '2rem 1rem', flex: '1' }}>
          <h2>Resultado del test de aprendizaje</h2>
          <hr />
          {learningProfile && learningProfile !== 'SIN_PERFIL' ? (
            <>
              <h2>Según el test realizado, tu perfil de aprendizaje es:</h2>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src={result[learningProfile].image}
                  alt="learning-type"
                  style={{ width: '40%', height: 'auto' }}
                />
              </div>

              <p style={{ textAlign: 'justify', marginTop: '1rem' }}>
                {result[learningProfile].description}
              </p>
              <p style={{ textAlign: 'justify' }}>
                Por lo tanto, AdaptarIA te ofrecerá <i>{result[learningProfile].finalContent}</i> en base al contenido que carguen tus docentes.
              </p>

              <h3 style={{ marginTop: '20px' }}>
                Algo más sobre el test 📚
              </h3>
              <p style={{ textAlign: 'justify' }}>
                El test de Kolb fue creado por David Kolb, un psicólogo estadounidense, con el objetivo de identificar los estilos de aprendizaje de las personas. 
                Según su teoría, las personas aprendemos mejor a través de la experiencia y existen cuatro tipos principales de aprendizaje: convergente, divergente, 
                acomodador y asimilador. Este test ayuda a estudiantes a descubrir su forma preferida de aprender y a mejorar sus métodos de estudio.
              </p>
            </>
          ) : (
            <>
              <h2>Todavía no hay resultados para el test de aprendizaje</h2>
              <p>Te sugerimos realizar el test para descubrir cuál es tu tipo</p>
            </>
          )}
          
          {/* Contenedor para los botones */}
          <div className='d-flex flex-row justify-content-end gap-3' style={{ marginTop: 'auto' }}>
            {learningProfile && learningProfile !== 'SIN_PERFIL' ? (
              <>
                <button
                  className="btn-purple-2"
                  onClick={() => navigate('/me/learning-type')}
                >
                  Repetir test
                </button>
                <button
                  className="btn-purple-1"
                  onClick={() => navigate('/courses/dashboard')}
                >
                  Finalizar
                </button>
              </>
            ) : (
              <button
                className="btn-purple-2"
                onClick={() => navigate('/me/learning-type')}
              >
                Comenzar test
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
