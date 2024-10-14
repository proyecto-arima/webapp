import { useEffect, useState } from "react";
import { Card, CardHeader, Table } from "reactstrap";
import Select from 'react-select';

import { get } from "../../utils/network";


interface ICourse {
  id: string;
  title: string;
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
  "Totalmente de acuerdo",
  "Algo de acuerdo",
  "Ni de acuerdo ni en desacuerdo",
  "Algo en desacuerdo",
  "Totalmente en desacuerdo"
];

export const TeacherStudentsSurveyDashboardPage = () => {
  const [courses, setCourses] = useState<ICourse[]>();
  const [answers, setAnswers] = useState<IAnswerData[]>([]);

  const [courseId, setCourseId] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<any>('');
  const [dateTo, setDateTo] = useState<any>('');

  const [studentsSurveyData, setStudentsSurveyData] = useState<IQuestion>();

  useEffect(() => {
    get('/teachers/me/courses/')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: any[]) => {
        setCourses(data.map((course: ICourse) => ({
          id: course.id,
          title: course.title,
        })));
      });
    fetchStudentsSurveyData();
  }, []);

  useEffect(() => {
    // console.log(`Filters: courseId=${courseId}, dateFrom=${dateFrom}, dateTo=${dateTo}`);
    updateFilter();
  }, [courses, courseId, dateFrom && dateTo]);

  const fetchStudentsSurveyData = async () => {
    let endpoint = '/survey/student-results';
    if (courseId || dateFrom || dateTo) {
      endpoint += '?';
    }

    if (courseId) {
      endpoint += `courseId=${courseId}`;
    }

    if (dateFrom) {
      endpoint += `&dateFrom=${dateFrom}`;
    }

    if (dateTo) {
      endpoint += `&dateTo=${dateTo}`;
    }

    await get(endpoint)
      .then(res => res.json())
      .then(res => res.data)
      .then((data: IQuestion) => {
        setStudentsSurveyData(data);
      });
  }

  const updateFilter = () => {
    fetchStudentsSurveyData();
    if (studentsSurveyData) {
      console.info('Found data for students survey');
      setAnswers(
        [
          {
            question: '1. La plataforma es fácil de usar',
            answers: questionsOptions.map((option, index) => ({
              id: index,
              option: option,
              value: studentsSurveyData.question1[index].toString()
            }))
          },
          {
            question: '2. La plataforma funciona de forma rápida',
            answers: questionsOptions.map((option, index) => ({
              id: index,
              option: option,
              value: studentsSurveyData?.question2[index].toString()
            }))
          },
          {
            question: '3. El material proporcionado es cómodo a la hora de estudiar',
            answers: questionsOptions.map((option, index) => ({
              id: index,
              option: option,
              value: studentsSurveyData?.question3[index].toString()
            }))
          },
          {
            question: '4. Usar el material de la plataforma me ha ayudado a obtener mejores resultados',
            answers: questionsOptions.map((option, index) => ({
              id: index,
              option: option,
              value: studentsSurveyData?.question4[index].toString()
            }))
          },
          {
            question: '5. El uso de la plataforma colabora en la mejora de la enseñanza de mis docentes',
            answers: questionsOptions.map((option, index) => ({
              id: index,
              option: option,
              value: studentsSurveyData?.question5[index].toString()
            }))
          },
        ]
      );
    }
  };

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
            {answers.length > 0 && <>
              <div className="d-flex flex-row align-items-center w-50 gap-2 mb-3">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fecha inicial"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fecha final"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '50%',
              }}>
                <Select
                  options={[
                    { value: '', label: 'Todos los cursos' },
                    ...(courses?.map((course: ICourse) => ({
                      value: course.id,
                      label: `${course.title}`,
                    })) || [])
                  ]}
                  noOptionsMessage={() => 'No hay cursos disponibles'}
                  placeholder="Curso"
                  onChange={(selectedOption) => {
                    setCourseId(selectedOption ? selectedOption.value : '');
                  }}
                />
                {/* <button
                  className="btn-purple-1"
                  onClick={updateFilter}
                  style={{
                    marginBlockStart: '1rem',
                  }}
                >
                  Filtrar
                </button> */}
              </div>
              <hr />

              {answers.map((answer: IAnswerData) => (
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

            {answers.length === 0 && <>
              <h2>Sin resultados</h2>
              <span>Todavía no hay resultados para mostrar</span>
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
