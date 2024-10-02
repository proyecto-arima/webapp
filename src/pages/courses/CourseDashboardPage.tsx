import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardText, CardFooter } from 'reactstrap';
import { useDispatch } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

import { setCourses } from '../../redux/slices/courses';
import { RootState } from '../../redux/store';
import { SwalUtils } from '../../utils/SwalUtils';
import { del } from '../../utils/network';

import '../../assets/styles/CourseDashboardPage.css';

export const CourseDashboardPage = () => {
  const { courses } = useSelector((state: RootState) => state.courses);
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const history = useNavigate();

  useEffect(() => {
    if (user.surveyAvailable) {
      SwalUtils.infoSwal(
        "Encuesta disponible",
        "Hay una encuesta disponible para evaluar el contenido de la plataforma. ¿Deseas realizarla?",
        "Si",
        "No",
        () => history("/me/survey"),
      );
    }
  }, [user.surveyAvailable, history]);

  const handleViewCourse = (courseId: string) => {
    history(`/courses/${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/courses/${courseId}/edit`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    SwalUtils.infoSwal(
      '¿Estás seguro de que quieres eliminar este curso?',
      'Esta acción eliminará el curso y no podrá deshacerse.',
      'Sí',
      'No',
      async () => {
        await del(`/courses/${courseId}`);
        dispatch(setCourses(courses?.filter(course => course.id !== courseId)));
      }
    );
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
      <div className="course-dashboard-container">
        <Card style={{ paddingInline: '2rem', paddingBlock: '1rem', width: '100%', height: '100%' }}>
          <div className="course-detail-header">
            <h1>Mis Cursos</h1>
          </div>
          <hr />
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
            <div className='d-flex flex-row justify-content-center gap-3 flex-wrap'>
              {courses?.map(course => (
                <Card key={course.id} className="course-card">
                  <img src={course.image} alt={course.title} className="course-image" />
                  <CardBody>
                    <CardTitle tag="h5">{course.title}</CardTitle>
                    <CardText>{course.description}</CardText>
                  </CardBody>
                  <CardFooter style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backgroundColor: 'transparent',
                    gap: '0.5rem',
                  }}>
                    <button className='btn-purple-1' onClick={() => handleViewCourse(course.id)}>Ver Curso</button>
                    {user.role === 'TEACHER' && (
                      <>
                        <button className='btn-purple-2' onClick={() => handleEditCourse(course.id)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className='btn-purple-2' onClick={() => handleDeleteCourse(course.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
