import { useState, useEffect, ReactElement } from 'react';
import { Card, CardBody, CardFooter, CardTitle } from 'reactstrap';

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../../redux/store";
// import { get } from '../../../utils/network';

interface IOption {
  questionId: number,
  text: string;
  valueAsigned: number | null;
  check: boolean;
}

interface IQuestion {
  statement: string;
  statementId: number;
  options: IOption[];
}

interface ResultTextLearningType {
  learningType: string;
  message: string;
}

const testQuestions: IQuestion[] = [
  {
    statement: 'Cuando aprendo ...',
    statementId: 1,
    options: [
      {
        questionId: 1,
        text: 'Prefiero valerme de mis sensaciones y sentimientos',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'Prefiero mirar y atender',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Prefiero pensar en las ideas',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'Prefiero hacer cosas',
        valueAsigned: null,
        check: false
      }
    ]
  },
  {
    statement: 'Aprendo mejor cuando ...',
    statementId: 2,
    options: [
      {
        questionId: 1,
        text: 'Confío en mis corazonadas y sentimientos',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'Atiendo y observo cuidadosamente',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Confío en mis pensamientos lógicos',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'Trabajo duramente para que las cosas queden realizadas',
        valueAsigned: null,
        check: false
      }
    ]
  },
  {
    statement: 'Cuando estoy aprendiendo ...',
    statementId: 3,
    options: [
      {
        questionId: 1,
        text: 'Tengo sentimientos y reacciones fuertes',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'Soy reservado y tranquilo',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Busco razonar sobre las cosas que están sucediendo',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'Me siento responsable de las cosas',
        valueAsigned: null,
        check: false
      }
    ]
  },
  {
    statement: 'Aprendo a través de ...',
    statementId: 4,
    options: [
      {
        questionId: 1,
        text: 'Sentimientos',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'Observaciones',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Razonamientos',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'Acciones',
        valueAsigned: null,
        check: false
      }
    ]
  },
  {
    statement: 'Cuando aprendo ...',
    statementId: 5,
    options: [
      {
        questionId: 1,
        text: 'Estoy abierto a nuevas experiencias',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'Tomo en cuenta todos los aspectos relacionados',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Prefiero analizar las cosas dividiéndolas en sus partes componentes',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'Prefiero hacer las cosas directamente',
        valueAsigned: null,
        check: false
      }
    ]
  },
  {
    statement: 'Cuando estoy aprendiendo ...',
    statementId: 6,
    options: [
      {
        questionId: 1,
        text: 'Soy una persona intuitiva',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'Soy una persona observadora',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Soy una persona lógica',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'Soy una persona activa',
        valueAsigned: null,
        check: false
      }
    ]
  },
  {
    statement: 'Aprendo mejor a través de ...',
    statementId: 7,
    options: [
      {
        questionId: 1,
        text: 'Las relaciones con mis compañeros',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'La observación',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Teorías racionales',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'La práctica de los temas tratados',
        valueAsigned: null,
        check: false
      }
    ]
  },
  {
    statement: 'Cuando aprendo ...',
    statementId: 8,
    options: [
      {
        questionId: 1,
        text: 'Me siento involucrado en los temas tratados',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'Me tomo mi tiempo antes de actuar',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Prefiero las teorías y las ideas',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'Prefiero ver los resultados a través de mi propio trabajo',
        valueAsigned: null,
        check: false
      }
    ]
  },
  {
    statement: 'Aprendo mejor cuando ...',
    statementId: 9,
    options: [
      {
        questionId: 1,
        text: 'Me baso en mis intuiciones y sentimientos',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'Me baso en observaciones personales',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Tomo en cuenta mis propias ideas sobre el tema',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'Pruebo personalmente la tarea',
        valueAsigned: null,
        check: false
      }
    ]
  },
  {
    statement: 'Cuando estoy aprendiendo ...',
    statementId: 10,
    options: [
      {
        questionId: 1,
        text: 'Soy una persona abierta',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'Soy una persona reservada',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Soy una persona racional',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'Soy una persona responsable',
        valueAsigned: null,
        check: false
      }
    ]
  },
  {
    statement: 'Cuando aprendo ...',
    statementId: 11,
    options: [
      {
        questionId: 1,
        text: 'Me involucro',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'Prefiero observar',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Prefiero evaluar las cosas',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'Prefiero asumir una actitud activa',
        valueAsigned: null,
        check: false
      }
    ]
  },
  {
    statement: 'Aprendo mejor cuando ...',
    statementId: 12,
    options: [
      {
        questionId: 1,
        text: 'Soy receptivo y de mente abierta',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 2,
        text: 'Soy cuidadoso',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 3,
        text: 'Analizo las ideas',
        valueAsigned: null,
        check: false
      },
      {
        questionId: 4,
        text: 'Soy práctico',
        valueAsigned: null,
        check: false
      }
    ]
  }
];

const textBasedOnLearningType: ResultTextLearningType[] = [
  {
    learningType: 'CONVERGENTE',
    message: `Tu estilo de aprendizaje CONVERGENTE implica que asimilas mejor la información a través de la escucha.
      Probablemente prefieras recibir información de manera verbal y encuentres más efectivo escuchar explicaciones,
      participar en discusiones y debates para comprender el contenido. Tienes una gran capacidad para recordar diálogos y sonidos,
      y a menudo recurres a la repetición en voz alta y al diálogo interno como métodos de estudio.
  
      Además, eres especialmente sensible a los matices y tonos de voz, lo que te permite captar detalles adicionales en
      la comunicación.
  
      Es probable que disfrutes participar activamente en discusiones grupales y actividades auditivas,
      ya que estas te facilitan la consolidación de tu aprendizaje.`
  },
  {
    learningType: 'DIVERGENTE',
    message: `Tu estilo de aprendizaje DIVERGENTE implica que asimilas mejor la información a través de la observación.
      Probablemente prefieras recibir información de manera visual y encuentres más efectivo observar imágenes, diagramas y videos
      para comprender el contenido. Tienes una gran capacidad para recordar detalles visuales y a menudo recurres a la visualización
      mental y la creación de mapas conceptuales como métodos de estudio.
  
      Además, eres especialmente sensible a los colores y formas, lo que te permite captar detalles adicionales en la comunicación.
  
      Es probable que disfrutes participar activamente en actividades visuales y creativas,
      ya que estas te facilitan la consolidación de tu aprendizaje.`
  },
  {
    learningType: 'ACOMODADOR',
    message: `Tu estilo de aprendizaje ACOMODADOR implica que asimilas mejor la información a través de la acción.
      Probablemente prefieras recibir información de manera práctica y encuentres más efectivo realizar experimentos, actividades y
      ejercicios prácticos para comprender el contenido. Tienes una gran capacidad para recordar acciones y a menudo recurres a la
      experimentación y la resolución de problemas como métodos de estudio.
  
      Además, eres especialmente
      sensible a las texturas y movimientos, lo que te permite captar detalles adicionales en la comunicación.`
  },
  {
    learningType: 'ASIMILADOR',
    message: `Tu estilo de aprendizaje ASIMILADOR implica que asimilas mejor la información a través del razonamiento.
      Probablemente prefieras recibir información de manera lógica y encuentres más efectivo analizar teorías, conceptos y
      principios abstractos para comprender el contenido. Tienes una gran capacidad para recordar ideas y a menudo recurres a la
      reflexión y la conceptualización como métodos de estudio.`
  }
]

const onTestFinishComments = [
  "El test de kolb fue desarrollado en 1984",
  "El test te permite descubrir que forma de aprender es la que mejor se adapta a vos",
  "Podes repetir el test cuantas veces quieras!"
];

export const StudentLearningTypeForm = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<IQuestion[]>(testQuestions);
  const [questionsLeft, setQuestionsLeft] = useState<IQuestion[]>(questions);
  const [currentQuestions, setCurrentQuestions] = useState<IQuestion[]>(questionsLeft.slice(0, 2));

  const [isTestInProgress, setIsTestInProgress] = useState(true);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState(false);
  const [testHasMoreQuestions, setTestHasMoreQuestions] = useState<boolean>(true);

  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {

    // TODO: geet student ID or get learning profile from redux

    // get(`/students/${testID}/learning-profile`)
    //   .then(async (res) => {
    //     if (res.ok) {
    //       return res.json();
    //     } else {
    //       console.error('Error fetching learning profile');
    //       return Promise.reject(res);
    //     }
    //   }).
    //   then(async (res) => {
    //     if (res.data) {
    //       setLearningType(res.data.learningProfile);
    //     } else {
    //       console.error('Error fetching data from learning profile');
    //       return Promise.reject(res);
    //     }
    //   }).
    //   catch((err) => console.error(`An error ocurred while fetching learning profile: ${err}`));
    console.log(user.learningProfile);
    return;
  }, []);

  const sendTestResults = () => {

    // TODO: Pending backend request
    console.info('Sending test results');

    // if (user.learningProfile === '') {
    //   // First time doing the test
    //   post(`/students/${user.id}/learning-profile`, { questions })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       if (res.ok) {
    //         // TODO: Set learningProfile attribute
    //         // setLearningType(res.data.learningProfile);
    //         console.log("Student learning profile set successfully");
    //       } else {
    //         console.error("Error setting student learning profile");
    //         return;
    //       }
    //     })
    //     .catch((err) => console.error(`An error ocurred while setting learning profile: ${err}`));
    // } else {
    //   // Test already done, doing it again
    //   patch(`/students/${user.id}/learning-profile`, { questions })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       if (res.ok) {
    //         // TODO: Set learningProfile attribute
    //         // setLearningType(res.data.learningProfile);
    //         console.log("Student learning profile set successfully");
    //       } else {
    //         console.error("Error setting student learning profile");
    //         return;
    //       }
    //     })
    //     .catch((err) => console.error(`An error ocurred while setting learning profile: ${err}`));
    // }
  }

  const finishTest = () => {
    if (allQuestionsAnswered(currentQuestions) && allQuestionsWithValidAnswers(currentQuestions)) {
      setShowAlertMessage(true);
      setAlertMessage('Test completado con éxito! Estamos procesando tus respuestas, aguarda un momento');

      sendTestResults();

      window.setTimeout(() => {
        setShowAlertMessage(false);
      }, 4000);

      setIsTestCompleted(true);

      window.setTimeout(() => {
        setIsTestInProgress(false);
      }, 4000);

      return;
    } else {
      setIsTestCompleted(false);
      setShowAlertMessage(true);
      setAlertMessage('El test no está completado o las opciones resultan incorrectas, por favor responde todas las preguntas y espera unos segundos');

      window.setTimeout(() => {
        setAlertMessage('');
        setShowAlertMessage(false);
      }, 5000);

      return;
    }
  }

  const restartTest = (): void => {
    setQuestions(testQuestions);
    setQuestionsLeft(testQuestions);

    // TODO: Reset questions to default values
    setQuestions(questions.map((question) => {
      question.options = question.options.map((option) => {
        option.valueAsigned = null;
        option.check = false;
        return option;
      });
      return question;
    }));
    console.info('Test restarted');
    navigate('/me/learning-type');
  }

  const setActiveOptions = (disabled: boolean) => {
    const selectToReset = document.getElementsByClassName('profile-learningtype-actions');
    for (let i = 0; i < selectToReset.length; i++) {
      (selectToReset[i] as HTMLSelectElement).disabled = disabled;
    }
  }

  const allQuestionsAnswered = (questions: IQuestion[]): boolean => {
    return true;
    const areQuestionsAnswered = questions.every(question =>
      question.options.every(option => option.check && option.valueAsigned !== null)
    );
    if (!areQuestionsAnswered) {
      setAlertMessage('Por favor, termina de responder todas las preguntas antes de continuar');
      setShowAlertMessage(true);
      setActiveOptions(true);
      console.warn('Not all questions have been answered');
      window.setTimeout(() => {
        setShowAlertMessage(false);
        setActiveOptions(false);
      }, 5000);
    }
    return areQuestionsAnswered;
  }

  const allQuestionsWithValidAnswers = (questions: IQuestion[]): boolean => {
    return true;
    const areQuestionsValid = questions.every((question, index) => {
      const optionsSelectedOnQuestion = question.options.map(option => option.valueAsigned);
      const uniqueOptions = new Set(optionsSelectedOnQuestion);
      if (uniqueOptions.size !== optionsSelectedOnQuestion.length) {
        setAlertMessage(`Por favor, revisa las respuestas de la pregunta ${questions[index].statementId} ya que hay opciones repetidas`);
        setShowAlertMessage(true);
        setActiveOptions(true);
        console.warn('Not all questions have valid answers');
        window.setTimeout(() => {
          setAlertMessage('');
          setShowAlertMessage(false);
          setActiveOptions(false);
        }, 5000);
        return false;
      } else {
        return true;
      }
    });
    return areQuestionsValid;
  }

  const setNextQuestionsForm = (): boolean => {
    const updatedQuestionsLeft = questionsLeft.slice(2);
    const updatedCurrentQuestions = updatedQuestionsLeft.slice(0, 2);

    setQuestionsLeft(updatedQuestionsLeft);
    setCurrentQuestions(updatedCurrentQuestions);

    const hasMoreQuestions = updatedQuestionsLeft.length > 2;
    setTestHasMoreQuestions(hasMoreQuestions);

    const selectToReset = document.getElementsByClassName('profile-learningtype-actions');
    for (let i = 0; i < selectToReset.length; i++) {
      (selectToReset[i] as HTMLSelectElement).value = 'DEF';
    }

    return true;
  }

  // const getPreviousQuestions = (): ReactElement => {
  //   console.log('Getting previous questions');
  //   return (
  //     <div>
  //     </div>
  //   );
  // }

  const getQuestions = (): ReactElement => {
    return (
      <div className='container'>
        <Card
          style={{
            width: '100%',
            maxWidth: '1000px',
            padding: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <CardTitle tag="h2"
            style={{
              padding: '10px'
            }}
          >Test de aprendizaje</CardTitle>
          <CardBody>
            {currentQuestions.map((question, indexQuestions) => (
              <div key={indexQuestions} style={
                { padding: '5px', marginBlock: '10px' }
              }>
                <ul style={{
                  padding: '5px'
                }}
                >
                  <Card>
                    <CardTitle tag="h4" style={
                      { padding: '10px' }
                    }>
                      {question.statement}
                    </CardTitle>
                    <CardBody>
                      {question.options.map((option, indexOptions) => (
                        <div
                          key={indexOptions}
                          style={{
                            padding: '4px'
                          }}
                        >
                          <select
                            className='profile-learningtype-actions'
                            key={`${indexQuestions}-${indexOptions}`}
                            defaultValue={'DEF'}
                            onChange={(e) => {
                              currentQuestions[indexQuestions].options[indexOptions].valueAsigned = parseInt(e.target.value);
                              currentQuestions[indexQuestions].options[indexOptions].check = true;
                              const updatedQuestions = questions.map((q) => {
                                if (q.statementId === question.statementId) {
                                  q.options = q.options.map((o) => {
                                    if (o.questionId === option.questionId) {
                                      o.valueAsigned = parseInt(e.target.value);
                                      o.check = true;
                                    }
                                    return o;
                                  });
                                }
                                return q;
                              });
                              setQuestions(updatedQuestions);
                            }}
                          >
                            <option value="DEF" disabled></option>
                            {
                              ['1', '2', '3', '4'].map((value, index) => (
                                <option
                                  key={`${indexQuestions}-${indexOptions}-${index}`}
                                  value={value}
                                >
                                  {value}
                                </option>
                              ))
                            }
                          </select>
                          <label>{option.text}</label>
                        </div>
                      ))}

                    </CardBody>
                  </Card>
                </ul>

              </div>
            ))}

            {/* TODO: Deberia volver a la pregunta anterior */}
            {/* {isTestInProgress && questionsLeft.length <= 2 &&
              <ul>
                <div>
                  <button className="profile-learningtype-actions" onClick={() => getPreviousQuestions()}>
                    Atras
                  </button>
                </div>
              </ul>
            } */}

          </CardBody>
          <CardFooter style={{
            display: 'flex',
            justifyContent: 'start',
            backgroundColor: 'inherit',
          }}>
            {isTestInProgress &&
              <button className="profile-learningtype-actions" onClick={() => restartTest()}>
                Cancelar test
              </button>
            }

            {testHasMoreQuestions && questionsLeft.length > 2 &&
              <button className='profile-learningtype-actions' onClick={
                () =>
                  allQuestionsAnswered(currentQuestions) &&
                  allQuestionsWithValidAnswers(currentQuestions) &&
                  setNextQuestionsForm() &&
                  getQuestions()
              }>
                Siguiente
              </button>
            }

            {isTestInProgress && questionsLeft.length <= 2 && !testHasMoreQuestions &&
              <button className="btn-purple-primary" onClick={() => finishTest()}>
                Finalizar test
              </button>
            }
          </CardFooter>
        </Card>

      </div>
    )
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
      <br />
      <div className='container'>
        {showAlertMessage &&
          <div>
            <ul>
              <p className={isTestCompleted ? "text-success" : "text-danger"}>{alertMessage}</p>
            </ul>
          </div>
        }
        {isTestInProgress &&
          <ul>
            {getQuestions()}
          </ul>
        }
        {!isTestInProgress && isTestCompleted &&
          <div>
            <div className="container">
              <ul>
                <Card className='profile-card-init'
                  style={{
                    width: '100%',
                    maxWidth: '1000px'
                  }}
                >
                  <CardTitle tag="h1">Tu resultado</CardTitle>
                  <CardBody
                    style={{
                      textAlign: 'start',
                    }}
                  >{textBasedOnLearningType.find((text) => text.learningType === user.learningProfile)?.message}</CardBody>
                </Card>
              </ul>

              <ul>
                <Card className='profile-card-init'>
                  <CardTitle tag="h5">Queres saber mas?</CardTitle>
                  <CardBody>
                    <ol>
                      {onTestFinishComments.map((comment, index) => (
                        <div key={index}>
                          <li>{comment}</li>
                        </div>
                      ))}
                    </ol>
                  </CardBody>
                </Card>
              </ul>

              <ul>
                <button className="btn-purple-primary" onClick={() => { window.location.href = '/me/learning-type'; }}>
                  Volver
                </button>
              </ul>
            </div>
          </div>
        }
      </div>
    </div>
  );
};
