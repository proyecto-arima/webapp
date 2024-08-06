import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import '../../assets/styles/CourseDashboardPage.css';
import { RootState } from '../../redux/store';

export const CourseDashboardPage = () => {
  const { courses } = useSelector((state: RootState) => state.courses);
  const history = useNavigate();

  const handleViewCourse = (courseId: string) => {
    history(`/courses/${courseId}`);
  };

  return (
    <div className="course-dashboard-container">
      <div className="course-list-container">
        <div className="course-list">
          {!courses?.length ? (
            <h2>No hay cursos disponibles</h2>
          ) : (
            courses?.map(course => (
              <Card key={course.id} className="course-card">
                <img src={course.image} alt={course.title} className="course-image" />
                <CardBody>
                  <CardTitle tag="h5">{course.title}</CardTitle>
                  <CardText>{course.description}</CardText>
                  <Button color="primary" onClick={() => handleViewCourse(course.id)}>Ver Curso</Button>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
