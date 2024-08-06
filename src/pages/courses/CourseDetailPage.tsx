import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/CourseDetailPage.css';
import { get } from '../../utils/network';

interface ISection {
  id: string;
  title: string;
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

  if (!course) {
    return <div>Loading...</div>;
  }

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
        <div className="course-detail-header">
          <h1>{course.title}</h1>
          <button onClick={handleNewSection} className="new-section-button">Nueva Sección</button>
        </div>
        <div className="sections-container">
          {course.sections.map((section) => (
            <div key={section.id} className="section-card">
              <h2>{section.title}</h2>
              <p>{section.description}</p>
              <div className="section-actions">
                <button className="edit-button">Editar</button>
                <button className="delete-button">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
