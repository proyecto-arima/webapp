import { useEffect, useState } from "react";
import { get, patch } from "../../../utils/network";
import { useParams } from "react-router-dom";
import { Card, Input, InputGroup, InputGroupText, Label } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCross, faSave, faX } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import PageWrapper from "../../../components/PageWrapper";

interface Level {
  questions: Option[];
}

interface Answer { answer: string, justification: string }

interface Option {
  text: string;
  options: Answer[];
  correctAnswer: string;
}

export default function GameEditionPage() {

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  const { courseId, sectionId, contentId } = useParams<{ courseId: string, sectionId: string, contentId: string }>();

  useEffect(() => {
    get(`/contents/${contentId}/gamification`).then(response => response.json()).then((response) => {
      setLevels(JSON.parse(response.data.content));
      setTitle(response.data.title);
      setLoading(false);
    });
  }, []);

  const markCorrect = (levelIndex: number, questionIndex: number, optionIndex: number) => {
    const newLevels = [...levels];
    newLevels[levelIndex].questions[questionIndex].correctAnswer = `${optionIndex}`;
    setLevels(newLevels);
  }

  const onChangeQuestion = (levelIndex: number, questionIndex: number, text: string) => {
    const newLevels = [...levels];
    newLevels[levelIndex].questions[questionIndex].text = text;
    setLevels(newLevels);
  }

  const onChangeOption = (levelIndex: number, questionIndex: number, optionIndex: number, text: string) => {
    const newLevels = [...levels];
    newLevels[levelIndex].questions[questionIndex].options[optionIndex].answer = text;
    setLevels(newLevels);
  }

  const onChangeJustification = (levelIndex: number, questionIndex: number, optionIndex: number, text: string) => {
    const newLevels = [...levels];
    newLevels[levelIndex].questions[questionIndex].options[optionIndex].justification = text;
    setLevels(newLevels);
  }

  const onSave = () => {
    patch(`/contents/${contentId}/gamification`, {
      newContent: JSON.stringify(levels),
    }).then(res => res.json()).then(res => {
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Contenido actualizado',
          text: 'El contenido fue actualizado correctamente'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el contenido'
        })
      }
    });

  }

  return <PageWrapper title="Configurar juego" goBackUrl={`/courses/${courseId}/sections/${sectionId}/content/${contentId}/review`} loading={loading}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      gap: '1rem',
      overflowY: 'scroll',
      scrollbarWidth: 'none',
    }}>
      <h3>{title}</h3>
      {levels.map((level, levelIndex) => (
        <div key={'level' + levelIndex} style={{ width: '100%', paddingInline: '2rem', paddingBlock: '0.5rem' }}>
          <h3>Nivel {levelIndex + 1}</h3>
          <hr />
          {level.questions.map((question, questionIndex) => (
            <Card key={'question' + questionIndex} style={{ width: '100%', paddingBlock: '1rem', paddingInline: '2rem', marginBlock: '1rem', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
              <h4>Pregunta {questionIndex + 1}</h4>
              <hr />

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                width: '100%',
                height: '100%',
              }}>

                <Input type="text" value={question.text} style={{
                  fontWeight: 'bold',
                }}
                  onChange={e => onChangeQuestion(levelIndex, questionIndex, e.target.value)}
                />


                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                  }}
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={'options' + optionIndex} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}>
                      <InputGroup>
                        <InputGroupText>Opción #{optionIndex + 1}</InputGroupText>
                        <Input type="text" value={option.answer}
                          onChange={e => onChangeOption(levelIndex, questionIndex, optionIndex, e.target.value)}
                        />
                        <InputGroupText
                          style={{
                            color: 'white',
                          }}
                        >
                          <Input type="checkbox"
                            style={{
                              cursor: 'pointer',
                            }}
                            checked={question.correctAnswer === `${optionIndex}`}
                            onChange={() => markCorrect(levelIndex, questionIndex, optionIndex)}
                          />
                        </InputGroupText>
                      </InputGroup>
                      <InputGroup>
                        <InputGroupText>Justificación</InputGroupText>
                        <Input value={option.justification}
                          onChange={e => onChangeJustification(levelIndex, questionIndex, optionIndex, e.target.value)}
                        />
                      </InputGroup>
                    </div>
                  ))}
                </div>

              </div>
            </Card>
          ))}
        </div>

      ))}
      <div className="d-flex flex-row justify-content-end w-100">
        <button className="btn-purple-1" onClick={onSave}>
          <FontAwesomeIcon icon={faSave} />
          {' '}
          Guardar
        </button>
      </div>
    </div>
  </PageWrapper>

}