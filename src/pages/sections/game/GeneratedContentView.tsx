import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Progress
} from 'reactstrap';
import Swal from 'sweetalert2';
import AnimatedStar from './Star';
import { useNavigate, useParams } from 'react-router-dom';
import { get } from '../../../utils/network';
import Reactions from '../../../components/Reactions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PageWrapper from '../../../components/PageWrapper';

interface Answer { answer: string, justification: string }

interface Option {
  text: string;
  options: Answer[];
  correctAnswer: string;
}

interface Level {
  questions: Option[];
}

export default function Game() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currenttext, setCurrenttext] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { courseId, sectionId, contentId } = useParams<{ courseId: string, sectionId: string, contentId: string }>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(`/contents/${contentId}/gamification`).then(response => response.json()).then((response) => {
      setLevels(JSON.parse(response.data.content));
      setLoading(false);
    });
  }, []);

  const handleAnswer = (option: Answer, selectedAnswer: number) => {
    const correct = levels[currentLevel].questions[currenttext].correctAnswer === `${selectedAnswer}`;

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
          Swal.fire({
            icon: 'success',
            title: '¡Felicidades!',
            showConfirmButton: true,
            text: `Pasaste al siguiente nivel! Continuemos jugando`,
            confirmButtonText: 'Siguiente nivel'
          }).then(() => {
            setCurrentLevel(currentLevel + 1);
            setCurrenttext(0);
          });
        } else {
          setGameOver(true);
          Swal.fire({
            icon: 'success',
            title: '¡Felicidades!',
            showConfirmButton: true,
            text: `¡Has completado el juego!`,
            confirmButtonText: 'Continuar con otro contenido'
          }).then(() => {
            navigate(`/courses/${courseId}/sections/${sectionId}`);
          });
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

  const currenttextData = levels?.[currentLevel]?.questions?.[currenttext];

  return <PageWrapper title="Vamos a jugar!"
    goBackUrl={`/courses/${courseId}/sections/${sectionId}`}
  >
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      gap: '1rem',
    }}>
      {!loading && <>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'end',
            alignItems: 'flex-end',
          }}
        >
          <AnimatedStar fillProgress={currentLevel === 0 ? currenttext / 3 : 1} size={'15vh'} id='star1' shouldShowConfeti={false} />
          <AnimatedStar fillProgress={currentLevel === 2 ? (gameOver ? 1 : currenttext / 3) : 0} size={'20vh'} id='star2' shouldShowConfeti />
          <AnimatedStar fillProgress={currentLevel === 1 ? currenttext / 3 : currentLevel === 0 ? 0 : 1} size={'15vh'} id='star3' shouldShowConfeti={false} />
        </div>
        <Card style={{ width: '90%', fontSize: '2vmin' }}>
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
      </>}

    </div>
    {user.role === 'STUDENT' && <Reactions />}
  </PageWrapper>

}