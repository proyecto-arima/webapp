import { Card, Table } from "reactstrap";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import { get, post, del } from "../../utils/network";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SwalUtils } from "../../utils/SwalUtils";

export const StudentLinkingPage = () => {
  const { courseId } = useParams<'courseId'>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [availableStudents, setAvailableStudents] = useState<any>([]);

  const fetchCourse = async () => {
    const updatedCourse = await get(`/courses/${courseId}`).then(res => res.json()).then(res => res.data);
    setCourse(updatedCourse);
  };

  const addStudent = async (student: any) => {
    await post(`/courses/${courseId}/students`, { studentEmails: [student.email] });
    // Re-obtener el curso después de agregar
    await fetchCourse();
    setAvailableStudents((prevStudents: any) =>
      prevStudents.filter((s: any) => s.id !== student.id)
    );
    setSelectedStudent(null);
  };

  const removeStudent = async (userId: string) => {
    const studentToRemove = course.students.find((student: any) => student.userId === userId);
  
    SwalUtils.infoSwal(
      '¿Estás seguro de que quieres eliminar este estudiante?',
      'Esta acción eliminará al estudiante del curso y no podrá deshacerse.',
      'Sí',
      'No',
      async () => {
        await del(`/courses/${courseId}/users/${userId}`);
        // Agregar el estudiante de nuevo a la lista de disponibles
        setAvailableStudents((prevStudents: any) => [...prevStudents, studentToRemove]);
        // Re-obtener el curso después de eliminar
        await fetchCourse();
        SwalUtils.successSwal(
          'Estudiante eliminado',
          'El estudiante ha sido eliminado con éxito.',
          'Aceptar',
          () => navigate(`/courses/${courseId}/students`),
          () => navigate(`/courses/${courseId}/students`)
        );
      }
    );
  };
  

  useEffect(() => {
    fetchCourse();
    get('/students')
      .then(res => res.json())
      .then(res => res.data)
      .then(setAvailableStudents);
  }, [courseId]);

  // Filtrar estudiantes disponibles para eliminar los que ya están matriculados
  const filteredStudents = availableStudents.filter((student: any) =>
    !course?.students?.some((s: any) => s.userId === student.id)
  );

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
                options={filteredStudents}
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
                      <button className='btn-purple-2' onClick={() => removeStudent(student.userId)}>
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
