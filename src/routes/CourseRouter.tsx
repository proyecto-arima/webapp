import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CourseCreationPage } from '../pages/courses/CourseCreationPage';
import { CourseDashboardPage } from '../pages/courses/CourseDashboardPage';
import { CourseDetailPage } from '../pages/courses/CourseDetailPage';
import { SectionCreationPage } from '../pages/courses/SectionCreationPage';
import { StudentLinkingPage } from '../pages/courses/StudentLinkingPage';

const CourseRoutes: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<CourseDashboardPage />} />
        <Route path="create" element={<CourseCreationPage />} />
        <Route path="dashboard" element={<CourseDashboardPage />} />
        <Route path=":courseId" element={<CourseDetailPage />} />
        <Route path=":courseId/new-section" element={<SectionCreationPage />} />
        <Route path=":courseId/students" element={<StudentLinkingPage />} />
      </Routes>
  );
};

export default CourseRoutes;
