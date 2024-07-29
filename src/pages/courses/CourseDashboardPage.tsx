// src/pages/courses/CourseDashboardPage.tsx
import React from 'react';
import { useCourseContext } from './contexts/CourseContext';
import SidebarCourses from './SidebarCourses';

export const CourseDashboardPage = () => {
  const { courses } = useCourseContext();

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
      <div className="container">
        <div className="row">
          {courses.map((course, index) => (
            <div className="col-md-4 p-2" key={index}>
              <div className="card">
                <img src={course.imageUrl} className="card-img-top" alt={course.title} />
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                </div>
                <div className="card-footer">
                  <button className="btn btn-danger" onClick={() => console.log(`Eliminar curso ${course.title}`)}>Eliminar</button>
                  <button className="btn btn-primary m-1" onClick={() => console.log(`Editar curso ${course.title}`)}>Editar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
