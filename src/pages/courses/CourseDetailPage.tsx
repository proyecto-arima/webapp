import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { Card } from 'reactstrap';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import '../../assets/styles/CourseDetailPage.css';
import { get } from '../../utils/network';
import placeholder from '../../assets/images/placeholder.webp';

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
  //const { sections, addSection } = useSectionContext();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [sectionsAdded, setSectionsAdded] = useState<boolean>(false); // Local state to control if sections were already added
  const navigate = useNavigate();

  useEffect(() => {
    get(`/courses/${courseId}`).then(res => res.json()).then(res => res.data).then((data: ICourse) => setCourse(data));
  }, [courseId]);

  const handleNewSection = () => {
    navigate(`/courses/${courseId}/new-section`);
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
              infinite
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              arrows
              autoplaySpeed={3000}
              centerMode
              className='section-slider'
              useTransform={false}
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
                  <h2>{section.name}</h2>
                  <p>{section.description}</p>
                </Card>
              ))}
            </Slider>
          </div>

        </Card>
      </div>
    </div>
  );
};
