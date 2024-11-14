import React, { useState, useEffect } from 'react';
import { Table, Card, CardHeader, Input, Label } from 'reactstrap';
import Swal from 'sweetalert2';
import { get, post } from '../../utils/network';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../redux/store";
import { useNavigate } from 'react-router-dom';
import { SwalUtils } from '../../utils/SwalUtils';
import { addCourse, setCourses } from '../../redux/slices/courses';
import PageWrapper from '../../components/PageWrapper';
import TableSkeleton from '../../components/TableSkeleton';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoursesToMatriculate().then(() => setLoading(false));
  
    const interval = setInterval(() => {
      fetchCoursesToMatriculate();
    }, 5000); // Cada 5 segundos
  
    return () => clearInterval(interval); // Limpia el intervalo al desmontar
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
      title: 'Ingresá el código de matriculación provisto por el docente',
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
        Swal.fire('Error', 'Código de matriculación incorrecto. Validá con el docente a cargo.', 'error');
      }
    }
  };

  return (
    <PageWrapper title="Buscar cursos">
      <div className="d-flex flex-row align-items-center w-100 gap-2 mb-5">
          <Input 
            name="title" 
            type="text" 
            placeholder="Ingresá parte del nombre del curso" 
            className="w-100" 
            onChange={(e) => setSearchCode(e.target.value)} 
            style={{ flex: 1, marginRight: '10px' }}
          />
            <button className="btn-purple-1" onClick={handleSearch}>
              Buscar Curso
            </button>
          </div>

          <h5 style={{ fontWeight: 'bold' }}>Cursos disponibles</h5>
            <hr />
            
            {loading ? <div style={{ opacity: '0.5'}}><TableSkeleton columnsCount={1}/></div> : filteredCourses.length > 0 ? (
              <Table>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id}>
                      <td style={{ verticalAlign: 'middle' }}>{course.courseName}</td>
                      <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                        <div className='d-flex flex-row justify-content-end'>
                          <button className='btn-purple-1' onClick={() => handleEnroll(course.id)} >Matricularme</button>
                        </div>
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
          </PageWrapper>
  );
};

export default CourseSearchPage;
