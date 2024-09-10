import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { Card, Button } from 'reactstrap';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import '../../assets/styles/CourseDetailPage.css';
import { get, del } from '../../utils/network';
import placeholder from '../../assets/images/placeholder.webp';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

interface ISection {
  id: string;
  name: string;
  description: string;
  visible: boolean;
}

interface ICourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  matriculationCode: string;
  teacherId: string;
  students: Array<{ id: string; firstName: string; lastName: string }>;
  sections: ISection[];
}

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const fetchCourses = () => get(`/courses/${courseId}`).then(res => res.json()).then(res => res.data).then((data: ICourse) => setCourse(data));

  useEffect(() => {
    fetchCourses();
  }, [courseId]);

  const handleNewSection = () => {
    navigate(`/courses/${courseId}/new-section`);
  };

  const toggleConfirm = () => setConfirmOpen(!confirmOpen);

  const handleDeleteSection = (sectionId: string) => {
    setSelectedSection(sectionId);
    toggleConfirm();
  };

  const confirmDelete = async () => {
    if (selectedSection) {
      await del(`/courses/${courseId}/sections/${selectedSection}`);
      await fetchCourses();
    }
    toggleConfirm();
  };

  const handleEditSection = (sectionId: string) => {
    // Redirigir a la pantalla de edición de sección con los datos precargados
    setSelectedSection(sectionId);
    navigate(`/courses/${courseId}/sections/${sectionId}/edit`);
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
      <div className="course-detail-container">
        <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%', maxWidth: 'calc(100vw - 25rem)' }}>
          <div className="course-detail-header">
            <h1>{course?.title}</h1>
            <div className='d-flex flex-row gap-3'>
              <button onClick={handleNewSection} className="new-section-button">Nueva Sección</button>
              <button className='students-button' onClick={() => {
                navigate(`/courses/${courseId}/students`);
              }}>Estudiantes</button>
            </div>
          </div>
          <hr />
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
            <Slider
              dots
              infinite={course?.sections && course?.sections.length > 1}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              arrows
              autoplaySpeed={3000}
              centerMode
              className='section-slider'
              useTransform={false}
              variableWidth={false}
            >
              {course?.sections.map(section => (
                <Card key={section.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  padding: '1rem',
                }}
                  className="section-card"
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '30rem',
                  }}>
                    <img src={placeholder}
                      alt="Section"
                      style={{
                        width: '100%',
                        borderRadius: '0.5rem',
                        objectFit: 'cover',
                        overflow: 'hidden',
                      }}
                    />
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingInline: '1rem',
                    paddingTop: '1rem',
                  }}>
                    <div style={{
                      width: '90%',
                      flexGrow: 1,
                    }}>
                      <h2>{section.name}</h2>
                      <div>
                        <span>{section.description}</span>
                      </div>
                    </div>
                    <div
                      className='d-flex flex-row gap-3'
                    >
                      {/* Botón Ver Sección */}
                      <button className='btn-purple-1' onClick={() => navigate(`/courses/${courseId}/sections/${section.id}`)}>Ver Sección</button>
                      <Button color="primary" onClick={() => handleEditSection(section.id)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button color="danger" onClick={() => handleDeleteSection(section.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </Slider>
          </div>
        </Card>
      </div>

      {/* Confirmación para eliminar la sección */}
      <ConfirmDialog
        isOpen={confirmOpen}
        toggle={toggleConfirm}
        onConfirm={confirmDelete}
        onCancel={toggleConfirm}
        message="¿Estás seguro de que quieres eliminar esta sección?"
      />
    </div>
  );
};
