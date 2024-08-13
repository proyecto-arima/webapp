import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/CourseDashboardPage.css';
import { useState } from 'react';
import { RootState } from '../../redux/store';
import { del } from '../../utils/network'; // Asegúrate de importar tu método delete
import { removeCourse } from '../../redux/slices/courses'; // Asegúrate de importar tu action creator
import { useDispatch } from 'react-redux';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { setCourses } from '../../redux/slices/courses';

export const CourseDashboardPage = () => {
  const { courses } = useSelector((state: RootState) => state.courses);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useNavigate();

  const handleViewCourse = (courseId: string) => {
    history(`/courses/${courseId}`);
  };

  const toggleConfirm = () => setConfirmOpen(!confirmOpen);

  const handleDeleteCourse = async (courseId: string) => {
    toggleConfirm();
    setSelectedCourse(courseId);
  };

  const confirmDelete = async () => {
    if (selectedCourse) {
      await del(`/courses/${selectedCourse}`);
      dispatch(setCourses(courses?.filter(course => course.id !== selectedCourse)));
    }
    toggleConfirm();
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
                  <div className="d-flex justify-content-between">
                    <Button color="primary" onClick={() => handleViewCourse(course.id)}>Ver Curso</Button>
                    <Button color="danger" onClick={() => handleDeleteCourse(course.id)}>Eliminar Curso</Button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        toggle={toggleConfirm}
        onConfirm={confirmDelete}
        onCancel={() => history('/courses')}
        message="¿Estás seguro de que quieres eliminar este curso?"
      />
    </div>
  );
};
