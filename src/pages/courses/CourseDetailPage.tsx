import React, { useEffect, useState } from 'react';
import { useCourseContext } from './contexts/CourseContext';
import { useParams } from 'react-router-dom';
import '../../assets/styles/CourseDetailPage.css';
import { useSectionContext } from './contexts/SectionContext';
import { API_URL } from '../../config';
import SidebarCourses from './SidebarCourses'; // Adjust the path as necessary

interface ICourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  matriculationCode: string;
  teacherId: string;
  students: Array<{ id: string; firstName: string; lastName: string }>;
  sections: Array<{
    id: string;
    title: string;
    description: string;
    visible: boolean;
  }>;
}

// Mock data
const mockCourse: ICourse = {
  id: '1',
  title: 'Curso de Node.js',
  description: 'Aprende los fundamentos de Node.js',
  imageUrl: 'https://via.placeholder.com/150',
  matriculationCode: 'NODEJS2023',
  teacherId: 'teacher123',
  students: [
    { id: 'student1', firstName: 'Juan', lastName: 'Pérez' },
    { id: 'student2', firstName: 'Ana', lastName: 'García' },
  ],
  sections: [
    {
      id: 'section1',
      title: 'Introducción',
      description: 'Introducción a Node.js',
      visible: true,
    },
    {
      id: 'section2',
      title: 'Asincronismo en Node.js',
      description: 'Aprende cómo manejar operaciones asíncronas',
      visible: true,
    },
  ],
};

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { sections, addSection } = useSectionContext();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [sectionsAdded, setSectionsAdded] = useState<boolean>(false); // Estado local para controlar si ya se añadieron las secciones

  useEffect(() => {
    const fetchCourse = async () => {
      // Usando el mock en lugar de una llamada real a la API
      if (courseId === mockCourse.id && !sectionsAdded) {
        setCourse(mockCourse);
        mockCourse.sections.forEach(section => addSection(section));
        setSectionsAdded(true); // Marcar que las secciones ya fueron añadidas
      } else {
        console.error('Curso no encontrado');
      }
    };

    fetchCourse();
  }, [courseId, sectionsAdded, addSection]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <SidebarCourses />
    <div className="course-detail">
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <div className="sections">
        {sections.map((section, index) => (
          <div key={index} className="section">
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};
