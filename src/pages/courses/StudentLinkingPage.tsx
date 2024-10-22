import { Card, Table } from "reactstrap";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { get, post } from "../../utils/network";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const StudentLinkingPage = () => {
  const { courseId } = useParams<'courseId'>();
  const [course, setCourse] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [availableStudents, setAvailableStudents] = useState<any>([]);

  const addStudent = (student: any) => {
    post(`/courses/${courseId}/students`, { studentEmails: [selectedStudent.email] })
      .then(res => res.json()).then(res => {
        setCourse((course: any) => ({
          ...course,
          students: [...course.students, selectedStudent]
        }));
      });
  };

  useEffect(() => {
    get(`/courses/${courseId}`).then(res => res.json()).then(res => res.data).then(setCourse);
    get('/students').then(res => res.json()).then(res => res.data).then(setAvailableStudents);
  }, []);

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
        <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
          <h2>Estudiantes</h2>
          <hr />
          <p>Aquí podrá agregar estudiantes al curso <b>{course?.title}</b>. Los alumnos podrán auto-matricularse utilizando el código: <b>{course?.matriculationCode}</b></p>
          <div className="d-flex flex-column">
            <h5 style={{ fontWeight: 'bold' }}>Agregar estudiante</h5>
            <hr />
            <div className="d-flex flex-row align-items-center w-100 gap-2 mb-5">
              <Select
                className="w-100"
                placeholder="Buscar estudiante"
                isClearable
                isSearchable
                // BUG: Revisar de no traer todos los estudiantes, se repiten y no deja borrarlos despues
                // options={ availableStudents && currentStudents ? availableStudents.filter((student: any) => currentStudents.some((s: any) => s.id === student.id)) : [] }
                options={availableStudents}
                noOptionsMessage={() => "No hay estudiantes disponibles para agregar"}
                value={selectedStudent}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.email}`}
                getOptionValue={(option) => option.id}
                onChange={(value) => setSelectedStudent(value)}
              />
              <button className="btn-purple-1" onClick={() => addStudent(selectedStudent)}>
                Agregar
              </button>
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
                  <tr key={student.userId}>
                    <td style={{ verticalAlign: 'middle' }}>{student.firstName}</td>
                    <td style={{ verticalAlign: 'middle' }}>{student.lastName}</td>
                    <td style={{ verticalAlign: 'middle' }}>{student.email}</td>
                    <td className="d-flex flex-row justify-content-end">
                      <button className='btn-purple-2'>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
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
