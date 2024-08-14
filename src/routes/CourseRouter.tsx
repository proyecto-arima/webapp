import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CourseCreationPage } from '../pages/courses/CourseCreationPage';
import { CourseDashboardPage } from '../pages/courses/CourseDashboardPage';
import { CourseDetailPage } from '../pages/courses/CourseDetailPage';
import { SectionCreationPage } from '../pages/courses/SectionCreationPage';
import { StudentLinkingPage } from '../pages/courses/StudentLinkingPage';
import { GeneratedContentView } from '../pages/sections/GeneratedContentView';
import { RawContentView } from '../pages/sections/RawContentView';
import { SectionContentCreation } from '../pages/sections/SectionContentCreation';
import { SectionContentDashboard } from '../pages/sections/SectionContentDashboard';

const CourseRoutes: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<CourseDashboardPage />} />
        <Route path="create" element={<CourseCreationPage />} />
        <Route path="dashboard" element={<CourseDashboardPage />} />
        <Route path=":courseId" element={<CourseDetailPage />} />
        <Route path=":courseId/new-section" element={<SectionCreationPage />} />
        <Route path=":courseId/students" element={<StudentLinkingPage />} />
        <Route path=":courseId/sections/:sectionId" element={<SectionContentDashboard/>} />
        <Route path=":courseId/sections/:sectionId/new" element={<SectionContentCreation/>} /> {/* TODO: FIX */}
        <Route path=":courseId/sections/:sectionId/content/:contentId" element={<RawContentView/>} />
        <Route path=":courseId/sections/:sectionId/content/:contentId/view" element={<GeneratedContentView/>} />
      </Routes>
  );
};

export default CourseRoutes;
