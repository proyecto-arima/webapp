import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, CardTitle } from 'reactstrap';

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../../redux/store";
import { get, patch, post } from '../../../utils/network';

interface IOption {
  questionId: number,
  text: string;
  valueAsigned: number;
  check: boolean;
}

interface IQuestion {
  statement: string;
  statementId: number;
  options: IOption[];
}

const learningt = [
  "CONVERGENTE",
  "DIVERGENTE",
  "ACOMODADOR",
  "ASIMILADOR"
]

const mockedQuestions: IQuestion[] = [
  {
    statement: 'Cuando aprendo ...',
    statementId: 1,
    options: [
      {
        questionId: 1,
        text: 'Prefiero valerme de mis sensaciones y sentimientos',
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 2,
        text: 'Prefiero mirar y atender',
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 3,
        text: 'Prefiero pensar en las ideas',
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 4,
        text: 'Prefiero hacer cosas',
        valueAsigned: 1,
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
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 2,
        text: 'Atiendo y observo cuidadosamente',
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 3,
        text: 'Confío en mis pensamientos lógicos',
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 4,
        text: 'Trabajo duramente para que las cosas queden realizadas',
        valueAsigned: 1,
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
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 2,
        text: 'Soy reservado y tranquilo',
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 3,
        text: 'Busco razonar sobre las cosas que están sucediendo',
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 4,
        text: 'Me siento responsable de las cosas',
        valueAsigned: 1,
        check: false
      }
    ]
  },
  {
    statement: 'Ultima afirmación',
    statementId: 4,
    options: [
      {
        questionId: 1,
        text: 'Tengo sentimientos y reacciones fuertes',
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 2,
        text: 'Soy reservado y tranquilo',
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 3,
        text: 'Busco razonar sobre las cosas que están sucediendo',
        valueAsigned: 1,
        check: false
      },
      {
        questionId: 4,
        text: 'Me siento responsable de las cosas',
        valueAsigned: 1,
        check: false
      }
    ]
  }
];

export const StudentLearningTypeForm = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<IQuestion[]>(mockedQuestions);
  const [questionsLeft, setQuestionsLeft] = useState<IQuestion[]>(questions);
  const [currentQuestions, setCurrentQuestions] = useState<IQuestion[]>(questionsLeft.slice(0, 2));

  const [isTestInProgress, setIsTestInProgress] = useState(true);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState(false);
  const [testHasMoreQuestions, setTestHasMoreQuestions] = useState<boolean>(true);

  const [learningType, setLearningType] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    // TODO: Mocked user learning profile. Get from redux
    get(`/students/${user.id}/learning-profile`)
    .then(async (res) => {
      console.log("RES");
      console.log(res);
      if (res.ok) {
        return res.json();
      } else {
        console.error('Error fetching learning profile');
        return Promise.reject(res);
      }
    }).
    then(async (res) => {
      console.log("DATA");
      console.log(res.data);
      
      if (res.data) {
        setLearningType(res.data.learningProfile);
      } else {
        console.error('Error fetching data from learning profile');
        return Promise.reject(res);
      }
    }).
    catch((err) => console.error(`An error ocurred while fetching learning profile: ${err}`));
    setLearningType("VISUALIZADOR");
    return;

    // TODO: Fetch questions from backend
    get(`/learning-profile/questions`)
      .then(res => { return res.ok ? res.json() : Promise.reject(res) })
      .then(res => { return res.data ? setQuestions(res.data) : Promise.reject(res) })
      .catch(err => console.error(`An error ocurred while fetching questions: ${err}`));
  }, []);

  // Test validations and navigation
  const sendTestResults = () => {
    // TODO: Pending backend response
    console.log('Sending test results');

    if (learningType === '') {
      // First time doing the test
      post(`/students/${user.id}/learning-profile`, { questions })
        .then((res) => res.json())
        .then((res) => {
          if (res.ok) {
            // TODO: Set learningProfile attribute
            // setLearningType(res.data.learningProfile);
            console.log("Student learning profile set successfully");
          } else {
            console.error("Error setting student learning profile");
            return;
          }
        })
        .catch((err) => console.error(`An error ocurred while setting learning profile: ${err}`));
    } else {
      // Test already done, doing it again
      patch(`/students/${user.id}/learning-profile`, { questions })
        .then((res) => res.json())
        .then((res) => {
          if (res.ok) {
            // TODO: Set learningProfile attribute
            // setLearningType(res.data.learningProfile);
            console.log("Student learning profile set successfully");
          } else {
            console.error("Error setting student learning profile");
            return;
          }
        })
        .catch((err) => console.error(`An error ocurred while setting learning profile: ${err}`));
    }
  }

  const finishTest = () => {
    if (allQuestionsAnswered(currentQuestions)) {
      setIsTestCompleted(true);
      setShowAlertMessage(true);
      setAlertMessage('Test completado con éxito! Estamos procesando tus respuestas, aguarda un momento');
      sendTestResults();
      window.setTimeout(() => {
        setIsTestInProgress(false);
        setShowAlertMessage(false);
        navigate('/me/learning-type/result');
      }, 5000);

      return;
    } else {
      setIsTestCompleted(false);
      setShowAlertMessage(true);
      setAlertMessage('El test no está completado, por favor responde todas las preguntas y espera unos segundos');
      window.setTimeout(() => {
        setAlertMessage('');
        setShowAlertMessage(false);
      }, 3000);
      return;
    }
  }

  const restartTest = (): void => {
    setQuestions(mockedQuestions);
    setQuestionsLeft(mockedQuestions);
    window.location.reload();
  }

  // Form validations and navigation
  const allQuestionsAnswered = (questions: IQuestion[]): boolean => {
    const areQuestionsAnswered = questions.every(question =>
      question.options.every(option => option.check)
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

  const nextQuestionsForm = (): boolean => {
    const updatedQuestionsLeft = questionsLeft.slice(2);
    const updatedCurrentQuestions = updatedQuestionsLeft.slice(0, 2);
    setQuestionsLeft(updatedQuestionsLeft);
    setCurrentQuestions(updatedCurrentQuestions);
    const hasMoreQuestions = updatedQuestionsLeft.length > 2;
    setTestHasMoreQuestions(hasMoreQuestions);
    return true;
  }

  const getQuestions = () => {
    return (
      <div className='container'>
        <div className='row'>
          <ul>
            <Card className='profile-card-questions'>
              <CardBody>
                <ul>
                  {currentQuestions.map((question, indexQuestions) => (
                    <div key={indexQuestions} style={
                      { display: 'flex', flexDirection: 'column', padding: '5px' }
                    }>

                      <ul>
                        <Card>
                          <CardTitle tag="h4" style={
                            { display: 'flex', justifyContent: 'start', padding: '10px' }
                          }>
                            {question.statement}
                          </CardTitle>
                          <CardBody>
                            {question.options.map((option, indexOptions) => (
                              <div
                                key={indexOptions}
                                style={{
                                  display: 'flex', padding: '2px', alignItems: 'center'
                                }}
                              >
                                <select
                                  className='profile-learningtype-actions'
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
                                    {/* BUG: No se actualiza en el front el valor de la opción seleccionada luego de las primeras 2 preguntas */}
                                    {/* <option value="" disabled selected></option> */}
                                    {
                                    ['1', '2', '3', '4'].map((value, index) => (
                                      <option
                                      key={`${indexQuestions}-${indexOptions}-${index}`}
                                      value={value}
                                      defaultValue={option.valueAsigned}
                                      // selected={option.valueAsigned === parseInt(value)}
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
                          </ul>

                          {/* BUG: Deberia volver a la pregunta anterior */}
                {isTestInProgress && questionsLeft.length <= 2 &&
                  <ul>
                    <div>
                      {/* <button className="profile-learningtype-actions" onClick={() => console.trace('back')}>
                        Atras
                      </button> */}

                    </div>
                  </ul>
                }

              </CardBody>
              <CardFooter style={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: 'inherit',
              }}>
                <button className="profile-learningtype-actions" onClick={() => restartTest()}>
                  Volver al inicio
                </button>

                {testHasMoreQuestions && questionsLeft.length > 2 &&
                  <button className='profile-learningtype-actions' onClick={() => allQuestionsAnswered(currentQuestions) && nextQuestionsForm() && getQuestions()}>
                    Siguiente
                  </button>
                }

                {isTestInProgress && questionsLeft.length <= 2 &&
                  <ul>
                    <button className="btn-purple-primary" onClick={() => finishTest()}>
                      Finalizar test
                    </button>
                  </ul>
                }
              </CardFooter>
            </Card>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div>
        <ul>
          <h2>Test de aprendizaje</h2>
        </ul>

        <ul>
          {showAlertMessage &&
            <div>
              <p className={isTestCompleted ? "text-success" : "text-danger"}>{alertMessage}</p>
            </div>
          }
        </ul>
        {isTestInProgress &&
          <ul>
            {getQuestions()}
          </ul>
        }

      </div>
    </div>
  );
};


