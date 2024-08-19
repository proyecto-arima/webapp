import { Button, Card, Table } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { get, post, del } from "../../utils/network";
import { useParams } from "react-router-dom";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import Select from "react-select";
import { useDispatch } from 'react-redux';
import { removeStudentFromCourse } from '../../redux/slices/courses';

export const StudentLinkingPage = () => {
  const { courseId } = useParams<'courseId'>();
  const [course, setCourse] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [students, setStudents] = useState<any>([{
    id: '66b91f41b38b4ceb0d97a59a',
    firstName: 'Nacho',
    lastName: 'García',
    email: 'nachoestudiante@gmail.com',
  }, {
    id: '66b7df41b4233e9e6de95960',
    firstName: 'Nacho',
    lastName: 'García',
    email: 'nachoestudiante2@gmail.com',
  }
  ]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const dispatch = useDispatch();

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

  const deleteStudent = (userId: string) => {
    del(`/users/${userId}/courses/${courseId}`).then(() => {
      setCourse((prevCourse: any) => ({
        ...prevCourse,
        students: prevCourse.students.filter((s: any) => s.id !== userId)
      }));
      dispatch(removeStudentFromCourse({ courseId, userId }));
      toggleConfirm(); // Cierra el cuadro de confirmación
    });
  };

  const toggleConfirm = () => setConfirmOpen(!confirmOpen);

  const handleDeleteStudent = (student: any) => {
    setStudentToDelete(student);
    toggleConfirm();
  };

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
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <Card style={{ width: '90%', paddingInline: '2rem', paddingBlock: '1rem', height: '90%' }}>
        <h2>Estudiantes</h2>
        <hr />
        <p>Aquí podrá agregar, eliminar o ver estudiantes al curso <b>{course?.title}</b>. Los alumnos podrán auto-matricularse utilizando el código: <b>{course?.matriculationCode}</b> </p>
        <div className="d-flex flex-column">
          <h5 style={{ fontWeight: 'bold' }}>Agregar estudiante</h5>
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
            <button className="btn-purple-1" onClick={() => addStudent(selectedStudent)}>Agregar</button>
          </div>

          <h5 style={{ fontWeight: 'bold' }}>Listado</h5>
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
                <tr key={student.id}>
                  <td style={{ verticalAlign: 'middle' }}>{student.firstName}</td>
                  <td style={{ verticalAlign: 'middle' }}>{student.lastName}</td>
                  <td style={{ verticalAlign: 'middle' }}>{student.email}</td>
                  <td className="d-flex flex-row justify-content-end">
                    <Button className="me-3" style={{ background: 'green', border: 'green' }}>
                      <FontAwesomeIcon icon={faListCheck} />
                    </Button>
                    <Button
                      style={{ background: 'red', border: 'red' }}
                      onClick={() => handleDeleteStudent(student)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={confirmOpen}
        toggle={toggleConfirm}
        onConfirm={() => deleteStudent(studentToDelete.id)}
        onCancel={toggleConfirm}
        message={`¿Estás seguro de que quieres eliminar a ${studentToDelete?.firstName} ${studentToDelete?.lastName} del curso?`}
      />
    </div>
  );
};