import { useEffect, useState } from "react";
import { Card, CardHeader, Table } from "reactstrap";
import { get } from "../../utils/network";
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface ICourse {
  id: string;
  teacherEmail: string;
  courseName: string;
}

interface ITeacher {
  id: string;
  courses: ICourse[];
}


export const StudentsSurveyDashboardPage = () => {

  const [initialDate, setInitialDate] = useState<any>();
  const [finalDate, setFinalDate] = useState<any>();
  const [courses, setCourses] = useState<ICourse[]>();
  const [options, setOptions] = useState<any[]>([]);


  useEffect(() => {
    get('/teachers').then(res => res.json()).then(res => res.data).then((data: any[]) => {
      setCourses(data.flatMap(teacherObject =>
        teacherObject.courses.map((course: ICourse) => ({
          id: course.id,
          teacherEmail: teacherObject.user.email,
          courseName: course.courseName,
        }))
      ));
    });
    setOptions([
      {
        id: '1',
        question: 'Muy buena',
        value: '20'
      },
      {
        id: '2',
        question: 'Buena',
        value: '30'
      },
      {
        id: '3',
        question: 'Regular',
        value: '40'
      },
      {
        id: '4',
        question: 'Mala',
        value: '10'
      },
      {
        id: '5',
        question: 'Muy mala',
        value: '20'
      }
    ]);
  }, []);


  function updateFilter(): void {
    console.log("updateFilter(). POR AHORA NADA");
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


          <div className="d-flex flex-row align-items-center w-50 gap-2 mb-3">
            <input
              type="date"
              className="form-control"
              placeholder="Fecha inicial"
              value={initialDate}
              onChange={(e) => setInitialDate(e.target.value)}
            />
            <input
              type="date"
              className="form-control"
              placeholder="Fecha final"
              value={finalDate}
              onChange={(e) => setFinalDate(e.target.value)}
            />
          </div>
          <div style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '50%',
          }}>
            <Select
              options={courses?.map((course: ICourse) => ({
                value: course.id,
                label: `${course.teacherEmail} - ${course.courseName}`,
              }))}
              placeholder="Curso"
              onChange={(e) => {
                console.log(e);
                console.log(courses);
              }}
            />
            <button
              className="btn-purple-1"
              onClick={updateFilter}
              style={{
                marginBlockStart: '1rem',
              }}
            >
              {/* <FontAwesomeIcon icon={faSearch} /> */}
              Filtrar
            </button>
          </div>

          <hr />

          <div>

            <CardHeader tag='h4'>
              Pregunta 1
            </CardHeader>

            <Table>
              <thead>
                <tr>
                  <th>Opción</th>
                  <th>Porcentaje (%)</th>
                </tr>
              </thead>
              <tbody>
                {options?.map((option: any) => (
                  <tr key={option.id}>
                    <th>{option.question}</th>
                    <td>{option.value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <CardHeader tag='h4'>
              Pregunta 2
            </CardHeader>

            <Table>
              <thead>
                <tr>
                  <th>Opción</th>
                  <th>Porcentaje (%)</th>
                </tr>
              </thead>
              <tbody>
                {options?.map((option: any) => (
                  <tr key={option.id}>
                    <th>{option.question}</th>
                    <td>{option.value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <CardHeader tag='h4'>
              Pregunta 3
            </CardHeader>

            <Table>
              <thead>
                <tr>
                  <th>Opción</th>
                  <th>Porcentaje (%)</th>
                </tr>
              </thead>
              <tbody>
                {options?.map((option: any) => (
                  <tr key={option.id}>
                    <th>{option.question}</th>
                    <td>{option.value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>


        </div>
      </Card>
    </div>
  </div>
};