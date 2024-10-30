import { useEffect, useState } from "react";
import { Card, CardHeader, Table } from "reactstrap";
import Select from 'react-select';

import { get } from "../../utils/network";
import { SwalUtils } from "../../utils/SwalUtils";

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

const studentsQuestions = [
  "1. La plataforma es fácil de usar",
  "2. La plataforma funciona de forma rápida",
  "3. El material proporcionado es cómodo a la hora de estudiar",
  "4. Usar el material de la plataforma me ha ayudado a obtener mejores resultados",
  "5. El uso de la plataforma colabora en la mejora de la enseñanza de mis docentes",
];

export const StudentsSurveyDashboardPage = () => {
  const [studentsSurveyData, setStudentsSurveyData] = useState<IQuestion | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [courseId, setCourseId] = useState<string>('');
  const [answers, setAnswers] = useState<IAnswerData[]>([]);
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  const fetchStudentsSurveyData = async () => {
    await get('/survey/student-results')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: IQuestion) => {
        setStudentsSurveyData(data);
      });
  }

  useEffect(() => {
    fetchStudentsSurveyDataFiltered();
  }, [courseId, dateFrom, dateTo]);

  const fetchStudentsSurveyDataFiltered = async () => {
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

    let endpoint = '/survey/student-results';
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
          setStudentsSurveyData(null);
          return;
        }
        setStudentsSurveyData(data);
        setAnswers(
          [
            {
              question: studentsQuestions[0],
              answers: questionsOptions.map((option, index) => ({
                id: index,
                option: questionsOptions[questionsOptions.length - 1 - index],
                value: data.question1[questionsOptions.length - 1 - index].toString()
              }))
            },
            {
              question: studentsQuestions[1],
              answers: questionsOptions.map((option, index) => ({
                id: index,
                option: questionsOptions[questionsOptions.length - 1 - index],
                value: data.question2[questionsOptions.length - 1 - index].toString()
              }))
            },
            {
              question: studentsQuestions[2],
              answers: questionsOptions.map((option, index) => ({
                id: index,
                option: questionsOptions[questionsOptions.length - 1 - index],
                value: data.question3[questionsOptions.length - 1 - index].toString()
              }))
            },
            {
              question: studentsQuestions[3],
              answers: questionsOptions.map((option, index) => ({
                id: index,
                option: questionsOptions[questionsOptions.length - 1 - index],
                value: data.question4[questionsOptions.length - 1 - index].toString()
              }))
            },
            {
              question: studentsQuestions[4],
              answers: questionsOptions.map((option, index) => ({
                id: index,
                option: questionsOptions[questionsOptions.length - 1 - index],
                value: data.question5[questionsOptions.length - 1 - index].toString()
              }))
            },
          ]
        );
      });
  }

  return <div
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
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%', overflow: 'scroll', }}>
        <div className="d-flex flex-column">
          <div>
            <div className="d-flex flex-row align-items-center w-50 gap-2 mb-3">
              <input
                type="date"
                className="form-control"
                placeholder="Fecha inicial"
                max={MAX_DATE}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <input
                type="date"
                className="form-control"
                placeholder="Fecha final"
                max={MAX_DATE}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '50%',
            }}>
              <Select
                options={courses.map(course => ({ value: course.id, label: course.courseName }))}
                noOptionsMessage={() => 'No hay cursos disponibles'}
                placeholder="Seleccionar curso"
                isClearable
                isSearchable
                onChange={(selectedOption) => {
                  setCourseId(selectedOption ? selectedOption.value : '');
                }}
              />
            </div>
            <hr />

            {answers.length > 0 && <>
              {studentsSurveyData && answers.map((answer: IAnswerData) => (
                <Card key={answer.question} style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', marginBlock: '1rem' }}>
                  <CardHeader tag='h4'>
                    {answer.question}
                  </CardHeader>
                  <Table>
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
                </Card>
              ))}
            </>
            }

            {!studentsSurveyData && <>
              <h2>Sin resultados</h2>
              <span>No encontramos resultados para mostrarte</span>
              <div style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              </div>
              <div className='d-flex flex-row justify-content-end gap-3' />
            </>
            }
          </div>
        </div>
      </Card>
    </div>
  </div>
};
