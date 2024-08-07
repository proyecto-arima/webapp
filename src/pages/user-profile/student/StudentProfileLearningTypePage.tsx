import { Card, CardBody, CardTitle, Input } from 'reactstrap';
import { useState, useEffect } from 'react';

import { API_URL } from '../../../config';

import '../../../assets/styles/profile-page.css'


interface ICoursesStudent {
  id: string;
  name: string;
}

interface IStudent {
  id: string;
  learningProfile: string;
  courses: ICoursesStudent[];
}

interface IOption {
  text: string;
  valueAsigned: string;
}

interface IQuestion {
  statement: string;
  options: IOption[];
}

export const StudentProfileLearningTypePage = () => {
  const [testInProgress, setTestInProgress] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [testHasMoreQuestions, setTestHasMoreQuestions] = useState<boolean>(true);
  const [learningType, setLearningType] = useState<string>('');
  const [questionsMessageStatus, setQuestionsMessageStatus] = useState<string>('');
  const [showTestMessage, setShowTestMessage] = useState<boolean>(false);

  // TODO: Mocked user. Get from redux user ID
  const user: IStudent = {
    id: '1',
    learningProfile: '',
    courses: []
  };

  // TODO: Questions mocks
  const [questions, setQuestions] = useState<IQuestion[]>([
    {
      statement: 'Cuando aprendo ...',
      options: [
        {
          text: 'Prefiero valerme de mis sensaciones y sentimientos',
          valueAsigned: ''
        },
        {
          text: 'Prefiero mirar y atender',
          valueAsigned: ''
        },
        {
          text: 'Prefiero pensar en las ideas',
          valueAsigned: ''
        },
        {
          text: 'Prefiero hacer cosas',
          valueAsigned: ''
        }
      ]
    },
    {
      statement: 'Aprendo mejor cuando ...',
      options: [
        {
          text: 'Confío en mis corazonadas y sentimientos',
          valueAsigned: ''
        },
        {
          text: 'Atiendo y observo cuidadosamente',
          valueAsigned: ''
        },
        {
          text: 'Confío en mis pensamientos lógicos',
          valueAsigned: ''
        },
        {
          text: 'Trabajo duramente para que las cosas queden realizadas',
          valueAsigned: ''
        }
      ]
    },
    {
      statement: 'Cuando estoy aprendiendo ...',
      options: [
        {
          text: 'Tengo sentimientos y reacciones fuertes',
          valueAsigned: ''
        },
        {
          text: 'Soy reservado y tranquilo',
          valueAsigned: ''
        },
        {
          text: 'Busco razonar sobre las cosas que están sucediendo',
          valueAsigned: ''
        },
        {
          text: 'Me siento responsable de las cosas',
          valueAsigned: ''
        }
      ]
    },
    {
      statement: 'ULTIMA AFIRMACION',
      options: [
        {
          text: 'Tengo sentimientos y reacciones fuertes',
          valueAsigned: ''
        },
        {
          text: 'Soy reservado y tranquilo',
          valueAsigned: ''
        },
        {
          text: 'Busco razonar sobre las cosas que están sucediendo',
          valueAsigned: ''
        },
        {
          text: 'Me siento responsable de las cosas',
          valueAsigned: ''
        }
      ]
    }
  ]);

  useEffect(() => {
    // Mock learning profile
    user.learningProfile = 'Visualizador';
    if (!user.learningProfile) {
      fetch(`${API_URL}/students/${user.id}/learning-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())
        .then(res => res.data)
        .then(data => { setLearningType(data.learningProfile) });
    }
  });

  const doTest = () => {
    setTestInProgress(true);
  }

  const finishTest = () => {
    if(testCompleted) {
      setQuestionsMessageStatus('Test completado con éxito!');
      window.setTimeout(() => {
        setTestInProgress(false);
        setQuestionsMessageStatus('');
        setShowTestMessage(false);
        setTestCompleted(false);
      }, 3000);
      return;
    } else {
      setShowTestMessage(true);
      setQuestionsMessageStatus('Debes completar todas las preguntas');
      window.setTimeout(() => {
        setQuestionsMessageStatus('');
      }, 3000);
    }
  }

  const getQuestions = (questionsLeft: IQuestion[]) => {
  {/* TODO: mostrar de a 3 preguntas */}
  const sliceQuestions = () => {
    setQuestions(questions.slice(3));
  }

    const hasNextQuestions = (newQuestions: IQuestion[]) : boolean => {
      const hasMoreQuestions = newQuestions.slice(3).length > 0;
      setTestHasMoreQuestions(hasMoreQuestions);
      return hasMoreQuestions;
    }
  
    // TODO: Quiza ni es necesario
    const noMoreQuestions = () => {
      setShowTestMessage(true);
      setQuestionsMessageStatus('Estas son las ultimas preguntas');
      window.setTimeout(() => {
        setQuestionsMessageStatus('');
      }, 3000);
    }

    return (
      <div>
        {showTestMessage && <p className={testCompleted ? "text-success" : "text-danger"}>{questionsMessageStatus}</p>}
        {!questionsLeft  && <p className={testHasMoreQuestions && !testCompleted ? "text-success" : "text-danger"}>No hay mas preguntas</p>}
        <h2>Test de Kolb</h2>
        <p>Se puntúa con 1 la que menos te representa y con 4 la que más te representa</p>
        <p>Las 4 deben quedar con puntuación y no se pueden repetir valores.</p>
        <ul>
          {questionsLeft.slice(0,3).map((question, indexQuestions) => (
            <div key={indexQuestions}>
              <h3>{question.statement}</h3>
              <ul>
                {question.options.map((option, indexOptions) => (
                  <div key={indexOptions}>
                    <label>{option.text}</label>
                    <select
                      className='test-select'
                      onChange={(e) => {
                        questions[indexQuestions].options[indexOptions].valueAsigned = e.target.value;
                        
                        {/* DEBUG: Testing finish test */}
                        setTestCompleted(true);
                      }}
                      value={option.valueAsigned}
                    >
                      <option id={`question-${indexQuestions}-${indexOptions}`} value="1">1</option>
                      <option id={`question-${indexQuestions}-${indexOptions}`} value="2">2</option>
                      <option id={`question-${indexQuestions}-${indexOptions}`} value="3">3</option>
                      <option id={`question-${indexQuestions}-${indexOptions}`} value="4">4</option>
                    </select>
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </ul>
        <ul>
          <button className="btn-purple-primary" onClick={() => finishTest()}>
            Finalizar test
          </button>
        </ul>

        <ul>
          <button className="btn-purple-primary" onClick={() => history.go(0)}>
            Volver al inicio
          </button>

          <button className="btn-purple-primary" onClick={() => {
            if (hasNextQuestions(questions)) {
              sliceQuestions();
              // DEBUG
              console.log("Siguiente");
            } else {
              noMoreQuestions();
            }
          }}>
            Siguiente
          </button>
        </ul>
      </div>
    );
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
      {!testInProgress ?
        <div className="container">
          <div className="row">
            <ul>
              <h2>{learningType ? `Tu tipo de aprendizaje actualmente es ${learningType}` :
                "Comenza el test para descubrir tu tipo de aprendizaje, son menos de 5 minutos!"
              }</h2>
            </ul>
            <ul>
              <Card className='profile-card'>
                <CardTitle tag="h5">Consideraciones del test</CardTitle>
                <CardBody>
                  <div>
                    <Input type='checkbox' checked={true} />
                    <span>El test es una herramienta de autoconocimiento y no una verdad absoluta.</span>
                  </div>
                  <div>
                    <Input type='checkbox' checked={true} />
                    <span>El test no refleja la totalidad de tu personalidad o tu forma de estudiar</span>
                  </div>
                  <div>
                    <Input type='checkbox' checked={true} />
                    <span>El test esta pensado para adaptarte el contenido de la plataforma en base a tus preferencias</span>
                  </div>
                </CardBody>
              </Card>

            </ul>
            <ul>
              <Card className='profile-card'>
                <CardTitle tag="h5">Queres saber mas?</CardTitle>
                <CardBody>
                  <div>
                    <Input type='checkbox' checked={true} />
                    <span>El test de kolb fue desarrollado en 1984</span>
                  </div>
                  <div>
                    <Input type='checkbox' checked={true} />
                    <span>El test te permite descubrir que forma de aprender es la que mejor se adapta a vos</span>
                  </div>
                  <div>
                    <Input type='checkbox' checked={true} />
                    <span>Podes repetir el test cuantas veces quieras!</span>
                  </div>
                </CardBody>
              </Card>
            </ul>

            <ul>
              <button className="btn-purple-primary" onClick={() => doTest()}>
                Comenzar test
              </button>
            </ul>
          </div>
        </div> : getQuestions(questions)
      }
    </div>
  );
};
