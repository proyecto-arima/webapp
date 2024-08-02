import { useCourseContext } from './contexts/CourseContext';
import { Card, CardBody, CardText, CardTitle, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import SidebarCourses from './SidebarCourses';
import '../../assets/styles/CourseDashboardPage.css';

export const CourseDashboardPage = () => {
  const { courses } = useCourseContext();
  const history = useNavigate();

  const handleViewCourse = (courseId: string) => {
    history(`/courses/${courseId}`);
  };

  return (
    <div className="course-dashboard-container">
      <SidebarCourses />
      <div className="course-list-container">
        <div className="course-list">
          {!courses.length ? (
            <h2>No hay cursos disponibles</h2>
          ) : (
            courses.map(course => (
              <Card key={course.id} className="course-card">
                <img src={course.imageUrl} alt={course.title} className="course-image" />
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
