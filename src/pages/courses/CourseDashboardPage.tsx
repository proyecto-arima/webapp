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
import placeholder from '../../assets/images/placeholder.webp';
import empty from '../../assets/images/empty.svg';

export const CourseDashboardPage = () => {
  const { courses } = useSelector((state: RootState) => state.courses);
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const history = useNavigate();

  useEffect(() => {
    if (user.requiresSurvey) {
      SwalUtils.infoSwal(
        "Encuesta disponible",
        "Hay una encuesta disponible para evaluar el contenido de la plataforma. ¿Deseas realizarla?",
        "Si",
        "No",
        () => history("/me/survey"),
      );
    }
  }, [user.requiresSurvey, history]);

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
        try {
          await del(`/courses/${courseId}`);
          dispatch(setCourses(courses?.filter(course => course.id !== courseId)));

          // Mensaje de éxito al eliminar el curso
          SwalUtils.successSwal(
            'Curso eliminado',
            'El curso ha sido eliminado exitosamente.',
            'Aceptar',
            () => navigate('/courses'),
            () => navigate('/courses')
          );
        } catch (error) {
          // Mensaje de error en caso de que algo falle
          SwalUtils.errorSwal(
            'Error',
            'Hubo un problema al eliminar el curso. Inténtalo de nuevo más tarde.',
            'Aceptar',
            () => navigate('/courses')
          );
        }
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
          {/* <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflowY: 'auto',
          }}>

            <div className='d-flex flex-row justify-content-center gap-3 flex-wrap h-100'>
              {courses?.map(course => (
                <Card key={course.id} className="course-card">
                  <img src={course.image} alt={course.title} className="course-image" />
                  <CardBody>
                    <CardTitle tag="h5">{course.title}</CardTitle>
                    <CardText>{course.description}</CardText>

                    {user.role === 'TEACHER' && (
                      <CardText>
                        Clave de Matriculación: <span style={{ fontWeight: 'bold' }}>{course.matriculationCode}</span>
                      </CardText>
                    )}
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

          </div> */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            overflowY: 'auto',
          }}>
            {courses?.length ? (
              <div className="container" style={{
                marginTop: 'auto',
                marginBottom: 'auto',
              }}>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
                  {courses.map((course) => (
                    <div key={course.id} className="col">
                      <div className="card h-100">
                        <div className="card-img-container position-relative" style={{ paddingBottom: '66.67%', overflow: 'hidden' }}>
                          <img
                            src={course.image ? course.image : placeholder}
                            className="card-img-top position-absolute top-0 start-0 w-100 h-100"
                            alt={course.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center'
                            }}
                          />
                        </div>
                        <div className="card-body">
                          <h5 className="card-title fs-4 fs-md-3 mb-3">{course.title}</h5>
                          <p className="card-text flex-grow-1 fs-6 fs-md-5">{course.description}</p>
                          {user.role === 'TEACHER' && (
                            <CardText>
                              Clave de Matriculación: <span style={{ fontWeight: 'bold' }}>{course.matriculationCode}</span>
                            </CardText>
                          )}
                        </div>
                        <div className="card-footer d-flex flex-column flex-md-row justify-content-end align-items-center gap-3">
                          <button className='btn-purple-1 w-100 w-md-auto' onClick={() => handleViewCourse(course.id)}>Ver curso</button>
                          {user.role === 'TEACHER' && (
                            <div className='d-flex gap-3 flex-column flex-md-row'>
                              <button className='btn-purple-2 w-100 w-md-auto' onClick={() => handleEditCourse(course.id)}><FontAwesomeIcon icon={faEdit} /></button>
                              <button className='btn-purple-2 w-100 w-md-auto' onClick={() => handleDeleteCourse(course.id)}><FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='d-flex flex-column justify-content-center align-items-center'>
                <img src={empty} alt="No sections available" />
                {user.role === 'STUDENT' ? (
                  <>
                    <h3>Parece que aún no te has matriculado a ningún curso.</h3>
                    <h4>Por favor matriculate a un curso para poder ver el contenido. </h4>
                  </>
                ) : (
                  <>
                    <h3>Parece que aún no has creado ningún curso.</h3>
                    <h4>Por favor crea un curso para comenzar a añadir secciones y contenido.</h4>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
