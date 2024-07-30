import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CourseProvider } from '../pages/courses/contexts/CourseContext';
import { CourseCreationPage } from '../pages/courses/CourseCreationPage';
import { CourseDashboardPage } from '../pages/courses/CourseDashboardPage';

const CourseRoutes: React.FC = () => {
  return (
    <CourseProvider>
      <Routes>
        <Route path="/" element={<CourseDashboardPage />} />
        <Route path="new" element={<CourseCreationPage />} />
        <Route path="dashboard" element={<CourseDashboardPage />} />
      </Routes>
    </CourseProvider>
  );
};

export default CourseRoutes;
