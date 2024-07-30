import React from 'react';
import { useCourseContext } from './contexts/CourseContext';
import { Card, CardBody, CardText, CardTitle, Button } from 'reactstrap';
import {useNavigate, useParams} from 'react-router-dom';
import SidebarCourses from './SidebarCourses';
import './CourseDashboardPage.css';

export const CourseDashboardPage = () => {
  const { courses } = useCourseContext();
  const history = useNavigate();

  const handleViewCourse = (courseId: string) => {
    history(`/courses/${courseId}`);
  };
  
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
      <div className="course-dashboard">
      <div className="course-list">
        {courses.map(course => (
          <Card key={course.title} className="course-card">
            <img src={course.imageUrl} alt={course.title} className="course-image" />
            <CardBody>
              <CardTitle tag="h5">{course.title}</CardTitle>
              <CardText>{course.description}</CardText>
              <Button color="primary" onClick={() => handleViewCourse(course.title)}>Ver Curso</Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
    </div>

    
    );
};
