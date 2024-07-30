import React, { useEffect, useState } from 'react';
import { useCourseContext } from './contexts/CourseContext';
import { useParams } from 'react-router-dom';
import './CourseDetailPage.css';
import { useSectionContext } from './contexts/SectionContext';
import { API_URL } from '../../config';


interface ICourse {
  title: string;
  description: string;
  imageUrl: string;
}

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { sections, addSection } = useSectionContext();
  const [course, setCourse] = useState<ICourse | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${API_URL}/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Error fetching course');
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    const fetchSections = async () => {
      try {
        const response = await fetch(`${API_URL}/courses/${courseId}/sections`);
        if (!response.ok) {
          throw new Error('Error fetching sections');
        }
        const data = await response.json();
        addSection(data);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchCourse();
    fetchSections();
  }, [courseId, addSection]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-detail">
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <div className="sections">
        {sections.map((section, index) => (
          <div key={index} className="section">
            <h2>{section.title}</h2>
            <p>{section.description}</p>
            {section.visible && <p>Visible</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
