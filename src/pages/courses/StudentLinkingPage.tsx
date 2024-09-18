import { Button, Card, Table } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { get, post } from "../../utils/network";
import { useParams } from "react-router-dom";
import { ICourse } from "../../redux/slices/courses";
import Select from "react-select";

export const StudentLinkingPage = () => {

  const { courseId } = useParams<'courseId'>();
  const [course, setCourse] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [students, setStudents] = useState<any>([]);

  const addStudent = (student: any) => {
    post(`/courses/${courseId}/students`, { studentEmails: [selectedStudent.email] })
      .then(res => res.json()).then(res => {
        setCourse((course: any) => {
          return {
            ...course,
            students: [...course.students, selectedStudent]
          }
        }
        )
      })
  }

  useEffect(() => {
    get(`/courses/${courseId}`).then(res => res.json()).then(res => res.data).then(setCourse);
    get('/students').then(res => res.json()).then(res => res.data).then(setStudents);
  }, []);

  useEffect(() => {
    console.log(course);
  }, [course]);

  return (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',  /* Alinea el contenido al inicio, en lugar de al centro */
      height: '100vh',
      backgroundColor: '#f6effa',
      width: '100vw',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', /* Alinea el contenido al principio */
        padding: '20px',
        width: '100%',
        height: '100%',
      }}
    >
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
        <h2>Estudiantes</h2>
        <hr />
        <p>Aquí podrá agregar, eliminar o ver estudiantes al curso <b>{course?.title}</b>. Los alumnos podrán auto-matricularse utilizando el código: <b>{course?.matriculationCode}</b> </p>
        <div className="d-flex flex-column">
          <h5 style={{ fontWeight: 'bold' }}>Agregar estudiante</h5>
          <hr />
          <div className="d-flex flex-row align-items-center w-100 gap-2 mb-5">
            <Select
              className="w-100"
              placeholder="Buscar estudiante"
              isClearable
              isSearchable
              options={students}
              value={selectedStudent}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.email}`}
              getOptionValue={(option) => option.id}
              onChange={(value) => setSelectedStudent(value)}
            />
            <button className="btn-purple-1" onClick={() => addStudent(selectedStudent)}

            >Agregar</button>
          </div>

          <h5 style={{ fontWeight: 'bold' }}>Listado</h5>
          <hr />
          <Table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {course?.students?.map((student: any) => (
                <tr key={student.id}> {/* TODO: CHANGE */}
                  <td style={{ verticalAlign: 'middle' }}>{student.firstName}</td>
                  <td style={{ verticalAlign: 'middle' }}>{student.lastName}</td>
                  <td style={{ verticalAlign: 'middle' }}>{student.email}</td>
                  <td className="d-flex flex-row justify-content-end">
                    <Button className="me-3" style={{ background: 'green', border: 'green' }}>
                      <FontAwesomeIcon icon={faListCheck} />
                    </Button>
                    <Button style={{ background: 'red', border: 'red' }} onClick={() => {
                      setCourse((course: any) => {
                        return {
                          ...course,
                          students: course.students.filter((s: any) => s.id !== student.id)
                        }
                      }
                      )
                    }}>


                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>

              ))}

            </tbody>

          </Table>
        </div>
      </Card>
      </div>
    </div>
  );
};