import { useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Progress
} from 'reactstrap';
import Swal from 'sweetalert2';
import AnimatedStar from './Star';

interface Answer { answer: string, justification: string }

interface Option {
  text: string;
  options: Answer[];
  correctAnswer: number;
}

interface Level {
  questions: Option[];
}

const levels: Level[] = [
  {
    "questions": [
      {
        "text": "¿Qué es un mito?",
        "options": [
          {
            "answer": "Una historia real que describe eventos históricos.",
            "justification": "Incorrecto. Un mito es una narración tradicional que no está basada en hechos reales, aunque puede estar inspirada en ellos."
          },
          {
            "answer": "Una narración fabulosa que explica el origen de algún fenómeno natural o cultural.",
            "justification": "Correcto. Los mitos suelen explicar fenómenos naturales o culturales utilizando seres sobrenaturales o divinos."
          },
          {
            "answer": "Un cuento infantil que enseña una lección.",
            "justification": "Incorrecto. Un cuento infantil puede tener elementos fantásticos, pero no cumple con las características de un mito."
          },
          {
            "answer": "Un relato corto que busca entretener.",
            "justification": "Incorrecto. Aunque los mitos pueden ser entretenidos, su propósito es más profundo, como explicar el origen del mundo o fenómenos naturales."
          }
        ],
        "correctAnswer": 1
      },
      {
        "text": "¿Cuál es la principal característica de un mito?",
        "options": [
          {
            "answer": "Está basado en hechos históricos.",
            "justification": "Incorrecto. Los mitos no están necesariamente basados en hechos históricos, aunque a veces pueden tener una base en ellos."
          },
          {
            "answer": "Tiene una función explicativa o simbólica.",
            "justification": "Correcto. La función de los mitos es explicar fenómenos y representar verdades simbólicas."
          },
          {
            "answer": "Siempre termina con una moraleja.",
            "justification": "Incorrecto. Las moralejas son más comunes en fábulas o cuentos, no necesariamente en mitos."
          },
          {
            "answer": "Son historias que siempre incluyen personajes humanos.",
            "justification": "Incorrecto. Los mitos pueden involucrar dioses, criaturas sobrenaturales y seres fantásticos."
          }
        ],
        correctAnswer: 1
      },
      {
        "text": "¿Qué suelen explicar los mitos?",
        "options": [
          {
            "answer": "Eventos históricos importantes.",
            "justification": "Incorrecto. Aunque algunos mitos pueden tener conexiones con la historia, su propósito principal es explicar el origen de fenómenos naturales o culturales."
          },
          {
            "answer": "El origen del mundo o de la humanidad.",
            "justification": "Correcto. Los mitos suelen abordar cuestiones fundamentales como el origen del mundo, la creación de la humanidad o fenómenos naturales."
          },
          {
            "answer": "La estructura social de una civilización.",
            "justification": "Incorrecto. Aunque algunos mitos pueden reflejar aspectos sociales, no es su principal objetivo."
          },
          {
            "answer": "Las costumbres cotidianas de las personas.",
            "justification": "Incorrecto. Las costumbres cotidianas pueden estar influenciadas por los mitos, pero los mitos generalmente explican fenómenos mucho más profundos."
          }
        ],
        "correctAnswer": 1
      }
    ]
  },
  {
    "questions": [
      {
        "text": "¿Qué papel juegan los dioses en los mitos?",
        "options": [
          {
            "answer": "Son siempre malvados y destructivos.",
            "justification": "Incorrecto. En los mitos, los dioses pueden ser tanto benevolentes como destructivos, dependiendo del contexto."
          },
          {
            "answer": "Controlan fuerzas de la naturaleza y del destino.",
            "justification": "Correcto. En muchos mitos, los dioses son responsables de controlar y representar aspectos de la naturaleza y el destino."
          },
          {
            "answer": "Siempre representan virtudes humanas.",
            "justification": "Incorrecto. Aunque algunos dioses pueden representar virtudes, otros representan aspectos más complejos como la ira, el caos o la muerte."
          },
          {
            "answer": "Son personajes secundarios.",
            "justification": "Incorrecto. En la mayoría de los mitos, los dioses juegan roles principales, siendo centrales en las narrativas."
          }
        ],
        "correctAnswer": 1
      },
      {
        "text": "¿Qué diferencia a un mito de una leyenda?",
        "options": [
          {
            "answer": "El mito se basa en hechos reales y la leyenda no.",
            "justification": "Incorrecto. Las leyendas pueden tener una base histórica, mientras que los mitos son puramente narrativos y simbólicos."
          },
          {
            "answer": "El mito involucra seres sobrenaturales y la leyenda puede basarse en personajes históricos.",
            "justification": "Correcto. Los mitos suelen incluir dioses o seres sobrenaturales, mientras que las leyendas a menudo se centran en personajes históricos o semihistóricos."
          },
          {
            "answer": "El mito siempre es parte de la religión y la leyenda es parte del folclore.",
            "justification": "Incorrecto. Aunque los mitos pueden tener conexiones con la religión, no todos los mitos son necesariamente religiosos, y las leyendas también pueden formar parte de tradiciones religiosas."
          },
          {
            "answer": "El mito enseña una lección moral y la leyenda no.",
            "justification": "Incorrecto. Ambos pueden enseñar lecciones morales, pero esa no es la principal diferencia entre los dos tipos de narrativas."
          }
        ],
        "correctAnswer": 1
      },
      {
        "text": "¿Cómo se transmitían tradicionalmente los mitos?",
        "options": [
          {
            "answer": "A través de textos sagrados escritos.",
            "justification": "Incorrecto. Aunque algunos mitos eventualmente fueron escritos, muchos fueron transmitidos oralmente mucho antes de ser registrados."
          },
          {
            "answer": "Por transmisión oral de generación en generación.",
            "justification": "Correcto. Los mitos se transmitían principalmente de manera oral antes de ser documentados."
          },
          {
            "answer": "A través de representaciones artísticas exclusivamente.",
            "justification": "Incorrecto. Las representaciones artísticas podían acompañar los mitos, pero la transmisión principal era oral."
          },
          {
            "answer": "Mediante rituales secretos que no se compartían con el público.",
            "justification": "Incorrecto. Aunque algunos mitos podían tener connotaciones rituales, eran narraciones populares compartidas con la comunidad."
          }
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    "questions": [
      {
        "text": "¿Cuál es una función común de los mitos en la sociedad?",
        "options": [
          {
            "answer": "Crear códigos legales para gobernar a las personas.",
            "justification": "Incorrecto. Aunque los mitos pueden influir en las normas culturales, no son creados con el propósito directo de establecer leyes."
          },
          {
            "answer": "Explicar el origen del universo y los fenómenos naturales.",
            "justification": "Correcto. Una de las principales funciones de los mitos es proporcionar explicaciones sobre la creación del mundo y fenómenos naturales."
          },
          {
            "answer": "Ofrecer entretenimiento y distracción.",
            "justification": "Incorrecto. Si bien los mitos pueden ser entretenidos, su propósito principal es simbólico y explicativo."
          },
          {
            "answer": "Documentar eventos históricos de manera precisa.",
            "justification": "Incorrecto. Los mitos no buscan ser una documentación precisa de hechos históricos."
          }
        ],
        "correctAnswer": 1
      },
      {
        "text": "¿Qué caracteriza a los héroes en los mitos?",
        "options": [
          {
            "answer": "Son siempre figuras históricas reales.",
            "justification": "Incorrecto. Los héroes míticos pueden ser figuras completamente ficticias o basadas en leyendas."
          },
          {
            "answer": "Tienen cualidades excepcionales o sobrenaturales.",
            "justification": "Correcto. Los héroes en los mitos suelen poseer habilidades sobrehumanas o virtudes excepcionales."
          },
          {
            "answer": "Nunca cometen errores o actos inmorales.",
            "justification": "Incorrecto. Los héroes míticos pueden cometer errores y actos inmorales, lo que a menudo forma parte de su desarrollo."
          },
          {
            "answer": "Siempre son recompensados al final de su viaje.",
            "justification": "Incorrecto. En muchos mitos, los héroes enfrentan tragedias o no logran sus objetivos a pesar de su valentía."
          }
        ],
        "correctAnswer": 1
      },
      {
        "text": "¿Qué es un mito cosmogónico?",
        "options": [
          {
            "answer": "Un mito que narra la creación del universo.",
            "justification": "Correcto. Los mitos cosmogónicos explican el origen del universo o el mundo."
          },
          {
            "answer": "Un mito sobre el fin del mundo.",
            "justification": "Incorrecto. Un mito sobre el fin del mundo se llama mito escatológico."
          },
          {
            "answer": "Un mito que describe la vida de un héroe.",
            "justification": "Incorrecto. Los mitos que tratan sobre héroes no son considerados cosmogónicos, ya que no explican la creación del universo."
          },
          {
            "answer": "Un mito relacionado con rituales religiosos.",
            "justification": "Incorrecto. Aunque algunos mitos cosmogónicos pueden estar relacionados con rituales, no todos los mitos relacionados con rituales son cosmogónicos."
          }
        ],
        "correctAnswer": 1
      }
    ]
  }
];

export default function Game() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currenttext, setCurrenttext] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleAnswer = (option: Answer, selectedAnswer: number) => {
    const correct = levels[currentLevel].questions[currenttext].correctAnswer === selectedAnswer;

    if (correct) {
      setScore(score + 1);
      Swal.fire({
        icon: 'success',
        title: 'Correcto!',
        showConfirmButton: true,
        confirmButtonText: 'Siguiente',
        text: option.justification

      }).then(() => {
        if (currenttext < 2) {
          setCurrenttext(currenttext + 1);
        } else if (currentLevel < 2) {
          setCurrentLevel(currentLevel + 1);
          setCurrenttext(0);
        } else {
          setGameOver(true);
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Incorrecto!',
        showConfirmButton: true,
        confirmButtonText: 'Intentar de nuevo',
        text: option.justification
      })
      return;
    }
  };

  const totaltexts = levels.length * 3;
  const progress = ((currentLevel * 3 + currenttext) / totaltexts) * 100;

  const currenttextData = levels[currentLevel].questions[currenttext];

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
        <h2>Vamos a jugar!</h2>
        <hr />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          gap: '1rem',
        }}>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'end',
              alignItems: 'flex-end',
            }}
          >
            <AnimatedStar fillProgress={currentLevel === 0 ? currenttext / 3 : 1} size={150} id='star1' />
            <AnimatedStar fillProgress={currentLevel === 2 ? (gameOver ? 1 : currenttext / 3) : 0} size={200} id='star2' />
            <AnimatedStar fillProgress={currentLevel === 1 ? currenttext / 3 : currentLevel === 0 ? 0 : 1} size={150} id='star3' />
          </div>
          <Card style={{ width: '90%' }}>
            <CardBody>
              <CardTitle tag="h5">Nivel {currentLevel + 1} - Pregunta {currenttext + 1}</CardTitle>
              <Progress value={gameOver ? 100 : progress} className="mb-3" />
              <p>{currenttextData.text}</p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {currenttextData.options.map((option, index) => (
                  <button
                    key={index}
                    className="mb-2 btn-purple-2"
                    onClick={() => handleAnswer(option, index)}
                  >
                    {option.answer}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

        </div>

      </Card>
    </div>
  </div>

}