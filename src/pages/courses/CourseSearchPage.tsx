import React, { useState, useEffect } from 'react';
import { Table, Card, CardHeader } from 'reactstrap';
import Swal from 'sweetalert2';
import { get, post } from '../../utils/network';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../redux/store";
import { useNavigate } from 'react-router-dom';
import { SwalUtils } from '../../utils/SwalUtils';
import { addCourse, setCourses } from '../../redux/slices/courses';

interface ICourse {
  id: string;
  courseName: string;
  matriculationCode?: string;
}

export const CourseSearchPage = () => {
  const [courses, setLocalCourses] = useState<ICourse[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const studentEmail = useSelector((state: RootState) => state.user.email);

  useEffect(() => {
    fetchCoursesToMatriculate();
  }, []);

  const fetchCoursesToMatriculate = () => 
    get('/students/me/courses-to-matriculate')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: ICourse[]) => {
        setLocalCourses(data);
        setFilteredCourses(data); // Inicialmente, mostrar todos los cursos
      });

  const handleSearch = () => {
    const result = courses.filter((course) =>
      course.courseName.toLowerCase().includes(searchCode.toLowerCase())
    );
    setFilteredCourses(result);
  };

  const handleEnroll = async (courseId: string) => {
    const { value: matriculationCode } = await Swal.fire({
      title: 'Ingrese el código de matriculación provisto por el docente',
      input: 'text',
      inputLabel: 'Código de matriculación',
      confirmButtonText: 'Confirmar matriculación',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    });

    if (matriculationCode) {
      try {
        const response = await post(`/courses/${courseId}/matriculation`, {
          matriculationCode,
          studentEmail,
        });

        if (!response.ok) {
          throw new Error('Matriculation failed');
        }

        // Mostrar alerta de éxito
        SwalUtils.successSwal(
          '¡Éxito!',
          'Te has matriculado correctamente.',
          'Aceptar',
          async () => {
            // Actualizar el estado de Redux
            const enrolledCourse = courses.find(course => course.id === courseId);
            if (enrolledCourse) {
              dispatch(addCourse(enrolledCourse));
            }

            // Llamar a la API para obtener los cursos actualizados
            const updatedCoursesResponse = await get('/students/me/courses');
            const updatedCoursesData = await updatedCoursesResponse.json();
            dispatch(setCourses(updatedCoursesData.data));

            // Redirigir al dashboard
            navigate('/courses/dashboard');
          },
          () => {
            navigate('/courses/dashboard');
          }
        );
      } catch (error) {
        Swal.fire('Error', 'Código de matriculación incorrecto. Valide con el docente a cargo.', 'error');
      }
    }
  };

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
        <Card style={{ width: '100%', padding: '20px', height: '100%', overflow: 'auto' }}>
          <h2>Buscar Curso</h2>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Ingrese parte del nombre del curso"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              style={{ padding: '10px', width: '100%', borderRadius: '4px', marginRight: '10px' }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                backgroundColor: '#6f2c91',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Buscar
            </button>
          </div>

          <Card>
            <CardHeader tag='h4'>Resultados</CardHeader>
            {filteredCourses.length > 0 ? (
              <Table striped responsive>
                <thead>
                  <tr>
                    <th style={{ verticalAlign: 'middle' }}>Título del Curso</th>
                    <th style={{ verticalAlign: 'middle', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id}>
                      <td style={{ verticalAlign: 'middle' }}>{course.courseName}</td>
                      <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                        <button
                          onClick={() => handleEnroll(course.id)}
                          style={{
                            padding: '10px 20px',
                            borderRadius: '4px',
                            backgroundColor: '#9b59b6',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            marginRight: '10px',
                          }}
                        >
                          Matricularme
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '1.2rem' }}>
                <strong>No se encontraron cursos.</strong>
              </div>
            )}
          </Card>
        </Card>
      </div>
    </div>
  );
};

export default CourseSearchPage;
