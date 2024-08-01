import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CourseProvider } from '../pages/courses/contexts/CourseContext';
import { CourseCreationPage } from '../pages/courses/CourseCreationPage';
import { CourseDashboardPage } from '../pages/courses/CourseDashboardPage';
import { CourseDetailPage } from '../pages/courses/CourseDetailPage';
import { SectionProvider } from '../pages/courses/contexts/SectionContext';

const CourseRoutes: React.FC = () => {
  return (
    <CourseProvider>
      <SectionProvider>
      <Routes>
        <Route path="/" element={<CourseDashboardPage />} />
        <Route path="create" element={<CourseCreationPage />} />
        <Route path="dashboard" element={<CourseDashboardPage />} />
        <Route path=":courseId" element={<CourseDetailPage />} />
      </Routes>
      </SectionProvider>
    </CourseProvider>
  );
};

export default CourseRoutes;
