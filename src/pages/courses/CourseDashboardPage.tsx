import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardText, Button, CardFooter, CardHeader } from 'reactstrap';
import '../../assets/styles/CourseDashboardPage.css';
import { RootState } from '../../redux/store';

export const CourseDashboardPage = () => {
  const { courses } = useSelector((state: RootState) => state.courses);
  const history = useNavigate();

  const handleViewCourse = (courseId: string) => {
    history(`/courses/${courseId}`);
  };

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
            <div className='d-flex flex-row justify-content-center gap-3'>
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
                  }}>
                    <button className='btn-purple-1' onClick={() => handleViewCourse(course.id)}>Ver Curso</button>
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
