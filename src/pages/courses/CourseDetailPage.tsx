import React, { useEffect, useState } from 'react';
import { useCourseContext } from './contexts/CourseContext';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/styles/CourseDetailPage.css';
import { useSectionContext } from './contexts/SectionContext';
import { API_URL } from '../../config';
import SidebarCourses from './SidebarCourses';

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

// Mock data
const mockCourse: ICourse = {
  id: '1',
  title: 'Historia',
  description: 'Aprende Historia de la mejor manera posible',
  imageUrl: 'https://via.placeholder.com/150',
  matriculationCode: 'NODEJS2023',
  teacherId: 'teacher123',
  students: [
    { id: 'student1', firstName: 'Juan', lastName: 'Pérez' },
    { id: 'student2', firstName: 'Ana', lastName: 'García' },
  ],
  sections: [],
};

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { sections, addSection } = useSectionContext();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [sectionsAdded, setSectionsAdded] = useState<boolean>(false); // Local state to control if sections were already added
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      // Using the mock instead of a real API call
      if (courseId === mockCourse.id && !sectionsAdded) {
        setCourse(mockCourse);
        mockCourse.sections.forEach(section => addSection(section));
        setSectionsAdded(true); // Mark that sections were already added
      } else {
        console.error('Curso no encontrado');
      }
    };

    fetchCourse();
  }, [courseId, sectionsAdded, addSection]);

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
      <SidebarCourses />
      <div className="course-detail-container">
        <div className="course-detail-header">
          <h1>{course.title}</h1>
          <button onClick={handleNewSection} className="new-section-button">Nueva Sección</button>
        </div>
        <div className="sections-container">
          {sections.map((section) => (
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
