import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { Card, CardBody, CardGroup } from "reactstrap";

import { SwalUtils } from "../utils/SwalUtils";
import { post } from "../utils/network";
import { useNavigate } from "react-router";
import { redirect } from "react-router-dom";

interface SurveyQuestion {
  question: string;
  options?: Array<string>;
  type: string;
  mandatory: boolean;
}

const surveyAdvices = [
  "Esta encuesta tiene solo 6 preguntas.",
  "Es importante que lo respondas con sinceridad ya que las respuestas se evalúan para mejorar la plataforma.",
  "Las primeras cinco preguntas son obligatorias y consisten en afirmaciones para las cuales se debe indicar el nivel de acuerdo con la misma",
  "La sexta y última pregunta es para que escribas tu opinión y no es obligatoria."
];

const questionsOptions = [
  "Totalmente de acuerdo",
  "Algo de acuerdo",
  "Ni de acuerdo ni en desacuerdo",
  "Algo en desacuerdo",
  "Totalmente en desacuerdo"
];

const optionsMap = questionsOptions.map((option, index) => ({
  id: questionsOptions.length - index,
  value: option
}));

const questionsStudent: SurveyQuestion[] = [
  {
    question: "1. La plataforma es fácil de usar",
    options: questionsOptions,
    type: "radio",
    mandatory: true
  },
  {
    question: "2. La plataforma funciona de forma rápida",
    type: "radio",
    options: questionsOptions,
    mandatory: true
  },
  {
    question: "3. El material proporcionado es cómodo a la hora de estudiar",
    type: "radio",
    options: questionsOptions,
    mandatory: true
  },
  {
    question: "4. Usar el material de la plataforma me ha ayudado a obtener mejores resultados",
    type: "radio",
    options: questionsOptions,
    mandatory: true
  },
  {
    question: "5. El uso de la plataforma colabora en la mejora de la enseñanza de mis docentes",
    type: "radio",
    options: questionsOptions,
    mandatory: true
  },
  {
    question: "6. Contanos tu opinión sobre AdaptarIA",
    type: "textarea",
    mandatory: false
  },
];

const questionsTeacher: SurveyQuestion[] = [
  {
    question: "1. La plataforma es fácil de usar",
    options: questionsOptions,
    type: "radio",
    mandatory: true
  },
  {
    question: "2. La plataforma funciona de forma rápida",
    type: "radio",
    options: questionsOptions,
    mandatory: true
  },
  {
    question: "3. A menudo debo modificar el contenido generado por la plataforma",
    type: "radio",
    options: questionsOptions,
    mandatory: true
  },
  {
    question: "4. El uso de la plataforma colabora con mi tarea docente",
    type: "radio",
    options: questionsOptions,
    mandatory: true
  },
  {
    question: "5. El uso de la plataforma colabora en la mejora del aprendizaje de mis alumnos.",
    type: "radio",
    options: questionsOptions,
    mandatory: true
  },
  {
    question: "6. Contanos tu opinión sobre AdaptarIA",
    type: "textarea",
    mandatory: false
  },
];

export const SurveyPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const questions = user.surveyAvailable && user.role === 'STUDENT' ? questionsStudent : user.role === 'TEACHER' ? questionsTeacher : undefined;
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    if (!user.surveyAvailable) {
      navigate('/courses/dashboard', { replace: true });
    };
  }, [user]); 

  const validateCompletedQuestions = (questions: Array<SurveyQuestion>) => {
    const questionsCompleted = questions.filter(q => q.mandatory).every(q => {
      const questionIndex = questions.indexOf(q);
      const question = document.querySelector(`input[name="question-${questionIndex}"]:checked`);
      return question;
    });
    const surveyCompleted = questionsCompleted;

    if (!surveyCompleted) {
      SwalUtils.warningSwal(
        "Encuesta incompleta",
        "Por favor, completa todas las preguntas antes de finalizar la encuesta.",
        "Lo haré",
        () => { console.warn('Survey not completed') },
      );
    }
    return surveyCompleted;
  }

  const sendSurvey = async (questions: SurveyQuestion[]) => {
    const surveyAnswers = {
      answers: questions.map((q, questionIndex) => {  
      if (q.type === 'radio') {
        const question = (document.querySelector(`input[name="question-${questionIndex}"]:checked`) as HTMLInputElement)?.value;
        const option = optionsMap.find((opt) => opt.value === question);
        return option ? option.id : null;
      } else {
        return null;
      }
      }).filter(answer => answer !== null),
      free: (document.querySelector('textarea[name="opinion"]') as HTMLTextAreaElement)?.value || ''
    };

    await post('/survey', surveyAnswers)
      .then((res) => {
        console.log("RES");
        console.log(res);
        return res;
      })
      .then((res) => {
        if(res.ok) {
          // TODO
          // el post tiene que desactivar user.surveyAvailable para que no la vuelva a ver el usuario despues de un tiempo o dada otra condición
          SwalUtils.successSwal(
            "Gracias por tu tiempo",
            "Encuesta enviada 🚀. Gracias por tu opinión, estamos trabajando permanentemente para mejorar AdaptarIA",
            "Aceptar",
            () => navigate('/courses/dashboard'),
            () => navigate('/courses/dashboard')
          );
        } else {
          SwalUtils.errorSwal(
            "Error al enviar la encuesta",
            "Hubo un error al enviar la encuesta. Por favor, intenta mas tarde",
            undefined,
            () => { console.error(`Survey not sent. Error status ${res.status}`) },
          );
        }
      })
      .catch((error) => {
        SwalUtils.errorSwal(
          "Error al enviar la encuesta",
          "Hubo un error al enviar la encuesta. Por favor, intenta mas tarde",
          undefined,
          () => { console.error(`Survey not sent. Error: ${error}`) },
        );
      });
    return;
  }

  return (
    <div
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
        {!showSurvey && (
          <>
            <Card
              style={{
                paddingInline: '2rem',
                paddingBlock: '1rem',
                marginBottom: '20px',
                backgroundColor: '#f6eff',
                borderRadius: '10px',
              }}
            >
              <CardBody>
                <strong
                  style={{
                    fontSize: '1.2rem',
                  }}
                >Valoramos mucho tu opinión sobre AdaptarIA y es por eso que te pedimos que nos ayudes respondiendo una breve encuesta de satisfacción 🎯</strong>
              </CardBody>

            </Card>
            <Card
              style={{
                paddingInline: '2rem',
                paddingBlock: '1rem',
                marginBottom: '20px',
                backgroundColor: '#f6eff',
                borderRadius: '10px',
              }}
            >
              <CardBody>
                <h3>
                  <strong>Consideraciones antes de realizar la encuesta</strong>
                </h3>

                <ul>
                  {surveyAdvices.map((advice, index) => (
                    <li key={index}>{advice}</li>
                  ))}
                </ul>

              </CardBody>

            </Card>
            <button
              className="btn-purple-1"
              style={{
                width: '200px',
                height: '50px',
                marginTop: '20px',
                marginBottom: '20px',
                borderRadius: '10px',
              }}
              onClick={() => {
                setShowSurvey(true);
              }}
            >Iniciar encuesta</button>
          </>
        )}

        {showSurvey && questions && (
          <>
            <CardGroup
              style={{
                flexDirection: 'column',
                height: '90%',
              }}
            >
              {questions.map((q, questionIndex) => (
                <div key={questionIndex} style={{ marginBottom: '20px' }}>
                  <Card
                    style={{
                      paddingInline: '2rem',
                      paddingBlock: '1rem',
                      backgroundColor: '#f6eff',
                      borderRadius: '10px',
                      marginLeft: '10px',
                    }}
                  >
                    <CardBody>
                      <strong>{q.question}</strong>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          marginTop: '10px',
                        }}
                      >
                        {q.options && q.options.map((option, optionIndex) => (
                          <div key={optionIndex}
                            style={{
                              marginBottom: '5px',
                            }}
                          >
                            {q.type === 'radio' &&
                              <div>
                                <input type="radio" name={`question-${questionIndex}`} value={option} />
                                <label style={{ marginLeft: '10px' }}>{option}</label>
                              </div>
                            }
                          </div>
                        ))}

                        {q.type === 'textarea' &&
                          <textarea
                            style={{
                              resize: 'none',
                              height: '130px',
                            }}
                            name="opinion"
                            placeholder="Escribe algún comentario"
                            className="mb-3 form-control"
                          />
                        }
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </CardGroup>
            <div style={{ marginLeft: '10px' }}>
              <button className="btn-purple-1" onClick={() => validateCompletedQuestions(questions) && sendSurvey(questions)}>Finalizar encuesta</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
