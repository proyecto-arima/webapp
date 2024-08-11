import { Card, CardBody, CardTitle, Input } from 'reactstrap';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { get } from '../../utils/network';

import '../../assets/styles/LearningTypePage.css'

interface IOption {
  text: string;
  valueAsigned: string;
}

interface IQuestion {
  statement: string;
  options: IOption[];
}

const testPreviousComments = [
  "Ubicate en un lugar tranquilo con conexión a internet",
  "Podes poner música de fondo",
  "Te llevará entre X y X minutos realizar todo el text",
  "Al finalizar el resultado aparecerá en pantalla y quedará asociado a tu usuario",
  "Es importante que lo respondas con sinceridad ya que el contenido de la plataforma se adaptará en función del resultado  obtenido"
];

const testPostComments = [
  "El test de kolb fue desarrollado en 1984",
  "El test te permite descubrir que forma de aprender es la que mejor se adapta a vos",
  "Podes repetir el test cuantas veces quieras!"
];

export const StudentProfileLearningTypePage = () => {
  const [isTestInProgress, setTestInProgress] = useState<boolean>(false);
  const [isTestCompleted, setTestCompleted] = useState<boolean>(false);
  const [testHasMoreQuestions, setTestHasMoreQuestions] = useState<boolean>(true);

  const [showAlertMessage, setShowAlertMessage] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const [learningType, setLearningType] = useState<string>('');
  const user = useSelector((state: RootState) => state.user);
  
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
      // TODO: Mocked user learning profile. Get from redux
    setLearningType("VISUALIZADOR");
    return;

    // TODO: Fetch learning profile from backend
    if (!learningType) {
      get(`/students/${user.id}/learning-profile`)
        .then(res => { return res.ok ? res.json() : Promise.reject(res) })
        // TODO: Set learningProfile attribute
        .then(res => { return res.data ? setLearningType(res.data.learningProfile) : Promise.reject(res) })
        .catch(err => console.error(`An error ocurred while fetching learning profile: ${err}`));
    }
  });

  const doTest = () => {
    setTestInProgress(true);
    setTestHasMoreQuestions(true);
  }

  function allQuestionsAnswered(questionsLeft: IQuestion[]) {
    const areQuestionsAnswered = questionsLeft.every(question =>
      question.options.every(option => option.valueAsigned !== '')
    );
    if (!areQuestionsAnswered) {
      setAlertMessage('Termina de responder estas preguntas antes de continuar');
      setShowAlertMessage(true);
      window.setTimeout(() => {
        setShowAlertMessage(false);
      }, 3000);
    }
    return areQuestionsAnswered;
  }

  const finishTest = () => {
    setTestCompleted(allQuestionsAnswered(questions));
    if (isTestCompleted) {
      setTestCompleted(true);
      setAlertMessage('Test completado con éxito!');
      window.setTimeout(() => {
        setTestInProgress(false);
        setShowAlertMessage(false);
      }, 3000);
      return;
    } else {
      setAlertMessage('El test no esta completado, por favor responde todas las preguntas');
      setShowAlertMessage(true);
      window.setTimeout(() => {
        setShowAlertMessage(false);
      }, 3000);
      return;
    }
  }

  const getQuestions = (questionsLeft: IQuestion[]) => {
    const nextQuestionsForm = (newQuestions: IQuestion[]): boolean => {
      const hasMoreQuestions = newQuestions.slice(3).length > 0;
      setTestHasMoreQuestions(hasMoreQuestions);
      if (hasMoreQuestions) {
        setQuestions(questions.slice(3));
      }
      return hasMoreQuestions;
    }



    return (
      <div>
        {showAlertMessage && <p className={isTestCompleted ? "text-success" : "text-danger"}>{alertMessage}</p>}
        <div>
          <h2>Test de aprendizaje</h2>
          <Card className='profile-card-questions'>
            <CardBody>
              <ul>
                {questionsLeft.slice(0, 3).map((question, indexQuestions) => (
                  <div key={indexQuestions}>
                    <h3>{question.statement}</h3>
                    <ul>
                      {question.options.map((option, indexOptions) => (
                        <div key={indexOptions}>
                          <label>{option.text}</label>
                          <select
                            className='profile-learningtype-actions'
                            onChange={(e) => {

                              questions[indexQuestions].options[indexOptions].valueAsigned = e.target.value;
                            }}
                            // value={option.valueAsigned}
                            defaultValue={option.valueAsigned}
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
                {isTestInProgress && questionsLeft.length <= 3 &&
                  <div>
                    {/* BUG: Deberia volver a las pregunta anterior */}
                    <button className="btn-purple-primary" onClick={() => history.back()}>
                      Atras
                    </button>

                    <button className="btn-purple-primary" onClick={() => finishTest()}>
                      Finalizar test
                    </button>
                  </div>
                }
              </ul>

              <ul>
                {/* BUG: Deberia volver a la pantalla de aprendizaje */}
                <button className="btn-purple-primary" onClick={() => history.back()}>
                  Volver al inicio
                </button>

                {testHasMoreQuestions && questionsLeft.length > 3 &&
                  <button className='btn-purple-primary' onClick={() => nextQuestionsForm(questionsLeft) && getQuestions(questionsLeft)}>
                    Siguiente
                  </button>
                }
              </ul>
            </CardBody>
          </Card>
        </div>
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
      {!isTestInProgress ?
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
        </div> : isTestCompleted ?
          <div>
            <ul>
              <Card className='profile-card-init'>
                <CardTitle tag="h1">Tu resultado</CardTitle>
                <CardBody>
                  Tu estilo de aprendizaje <strong>{learningType}</strong> implica que asimilas mejor la información a través de la escucha.
                  Probablemente prefieras recibir información de manera verbal y encuentres más efectivo escuchar explicaciones,
                  participar en discusiones y debates para comprender el contenido. Tienes una gran capacidad para recordar diálogos y sonidos,
                  y a menudo recurres a la repetición en voz alta y al diálogo interno como métodos de estudio.

                  Además, eres especialmente sensible a los matices y tonos de voz, lo que te permite captar detalles adicionales en
                  la comunicación.

                  Es probable que disfrutes participar activamente en discusiones grupales y actividades auditivas,
                  ya que estas te facilitan la consolidación de tu aprendizaje.
                </CardBody>
              </Card>
            </ul>

            <ul>
              <Card className='profile-card-init'>
                <CardTitle tag="h5">Queres saber mas?</CardTitle>
                <CardBody>
                  {testPostComments.map((comment, index) => (
                    <div key={index}>
                      <Input type='checkbox' defaultChecked/>
                      <span>{comment}</span>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </ul>

          </div> : isTestCompleted ? <h3>Test finalizado!</h3> : getQuestions(questions)
      }
    </div>
  );
};
