import { useEffect, useState } from "react";
import { Table } from "reactstrap";
import Select from 'react-select';

import { get } from "../../utils/network";
import { SwalUtils } from "../../utils/SwalUtils";
import PageWrapper from "../../components/PageWrapper";

const MAX_DATE: string = (new Date(Date.now() - (new Date()).getTimezoneOffset())).toISOString().slice(0, -1).split('T')[0].toString();

interface ICourse {
  id: string;
  courseName: string;
}

interface IAnswer {
  id: number;
  option: string;
  value: string;
}

interface IAnswerData {
  question: string;
  answers: IAnswer[];
}

interface IQuestion {
  question1: number[],
  question2: number[],
  question3: number[],
  question4: number[],
  question5: number[]
}

const questionsOptions = [
  "Totalmente en desacuerdo",
  "Algo en desacuerdo",
  "Ni de acuerdo ni en desacuerdo",
  "Algo de acuerdo",
  "Totalmente de acuerdo"
];

const teacherQuestions = [
  "1. La plataforma es fácil de usar",
  "2. La plataforma funciona de forma rápida",
  "3. A menudo debo modificar el contenido generado por la plataforma",
  "4. El uso de la plataforma colabora con mi tarea docente",
  "5. El uso de la plataforma colabora en la mejora del aprendizaje de mis alumnos.",
];

export const TeachersSurveyDashboardPage = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [courseId, setCourseId] = useState<string>('');
  const [answers, setAnswers] = useState<IAnswerData[]>([]);
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [teachersSurveyData, setTeachersSurveyData] = useState<IQuestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    get('/directors/courses/')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: ICourse[]) => {
        const allCoursesOption = { id: '', courseName: 'Todos los cursos' };
        setCourses([allCoursesOption, ...data.map((course: ICourse) => ({
          id: course.id,
          courseName: course.courseName,
        }))]);
      });
    fetchStudentsSurveyData();
    setLoading(false);
  }, []);

  const fetchStudentsSurveyData = async () => {
    setLoading(true);
    await get('/survey/teacher-results')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: IQuestion) => {
        setTeachersSurveyData(data);
      });
  };

  useEffect(() => {
    fetchStudentsSurveyDataFiltered();
  }, [courseId, dateFrom, dateTo]);

  const fetchStudentsSurveyDataFiltered = async () => {
    setLoading(true);
    if (dateFrom && dateTo) {
      const tmpDateFrom = new Date(dateFrom);
      const tmpDateTo = new Date(dateTo);

      if (tmpDateTo < tmpDateFrom) {
        SwalUtils.warningSwal(
          "Rango de fechas inválido",
          "La fecha final debe ser mayor o igual a la fecha inicial.",
          "Continuar",
          () => { console.warn('Invalid date range'); }
        );
      }
    };

    let endpoint = '/survey/teacher-results';
    const queryParams: string[] = [];

    if (courseId) {
      queryParams.push(`courseId=${courseId}`);
    }

    if (dateFrom && dateTo) {
      queryParams.push(`dateFrom=${dateFrom}`);
      queryParams.push(`dateTo=${dateTo}`);
    }
    if (queryParams.length > 0) {
      endpoint += `?${queryParams.join('&')}`;
    }

    await get(endpoint)
      .then(res => res.json())
      .then(res => res.data)
      .then((data: IQuestion | null) => {
        if (!data) {
          setTeachersSurveyData(null);
          return;
        }
        setTeachersSurveyData(data);
        setAnswers([
          {
            question: teacherQuestions[0],
            answers: questionsOptions.map((option, index) => ({
              id: index,
              option: questionsOptions[questionsOptions.length - 1 - index],
              value: data.question1[questionsOptions.length - 1 - index].toString()
            }))
          },
          {
            question: teacherQuestions[1],
            answers: questionsOptions.map((option, index) => ({
              id: index,
              option: questionsOptions[questionsOptions.length - 1 - index],
              value: data.question2[questionsOptions.length - 1 - index].toString()
            }))
          },
          {
            question: teacherQuestions[2],
            answers: questionsOptions.map((option, index) => ({
              id: index,
              option: questionsOptions[questionsOptions.length - 1 - index],
              value: data.question3[questionsOptions.length - 1 - index].toString()
            }))
          },
          {
            question: teacherQuestions[3],
            answers: questionsOptions.map((option, index) => ({
              id: index,
              option: questionsOptions[questionsOptions.length - 1 - index],
              value: data.question4[questionsOptions.length - 1 - index].toString()
            }))
          },
          {
            question: teacherQuestions[4],
            answers: questionsOptions.map((option, index) => ({
              id: index,
              option: questionsOptions[questionsOptions.length - 1 - index],
              value: data.question5[questionsOptions.length - 1 - index].toString()
            }))
          },
        ]);
      });
    setLoading(false);
  };

  return (
    <PageWrapper title="Encuestas de docentes">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        height: '100%',
      }}>
        <div className="d-flex flex-row align-items-center w-100 gap-2 mb-3" style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
          <div className="d-flex flex-column w-100">
            <label>Fecha Desde</label>
            <input
              type="date"
              className="form-control"
              placeholder="Fecha inicial"
              max={MAX_DATE}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="d-flex flex-column w-100">
            <label>Fecha Hasta</label>
            <input
              type="date"
              className="form-control"
              placeholder="Fecha final"
              max={MAX_DATE}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

        </div>
        <hr />

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>      
        {loading ? (
          <div style={{ textAlign: 'left', padding: '20px' }}>
            <strong>Cargando...</strong>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem',
          }}>
            {answers.length > 0 && <>
              {teachersSurveyData && answers.map((answer: IAnswerData) => (
                <div key={answer.question} style={{ width: '100%', border: '1px solid #ccc', padding: '1rem' }}>
                  <h4>{answer.question}</h4>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Respuesta</th>
                        <th>Porcentaje (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {answer.answers.map((answer: IAnswer) => (
                        <tr key={answer.id}>
                          <th>{answer.option}</th>
                          <th>{answer.value}</th>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ))}
            </>}

            {!teachersSurveyData && <>
              <h4>Sin resultados</h4>
              <span>No encontramos resultados para mostrarte</span>
              <div style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }} />
              <div className='d-flex flex-row justify-content-end gap-3' />
            </>}
          </div>
        )}
        </div>
      </div>
    </PageWrapper>
  );
};
