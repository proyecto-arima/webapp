import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CourseDashboardPage } from '../pages/courses/CourseDashboardPage';
import { CourseCreationPage } from '../pages/courses/CourseCreationPage';
import { CourseDetailPage } from '../pages/courses/CourseDetailPage';
import { SectionCreationPage } from '../pages/courses/SectionCreationPage';
import { StudentLinkingPage } from '../pages/courses/StudentLinkingPage';
import { EditSectionPage } from '../pages/courses/EditSectionPage';

import { SectionContentCreation } from '../pages/sections/SectionContentCreation';
import { EditContentPage } from '../pages/sections/EditContentPage';
import { GeneratedContentView } from '../pages/sections/text/GeneratedContentView';
import { GeneratedContentView as MarkmapView } from '../pages/sections/markmap/GeneratedContentView';
import { RawContentView } from '../pages/sections/RawContentView';
import { SectionContentDashboard } from '../pages/sections/SectionContentDashboardPage';

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
        <Route path="/courses/:courseId/sections/:sectionId/edit" element={<EditSectionPage />} />
        <Route path=":courseId/sections/:sectionId/edit" element={<EditSectionPage />} />
        <Route path=":courseId/sections/:sectionId/content/:contentId" element={<RawContentView/>} />
        <Route path=":courseId/sections/:sectionId/content/:contentId/summary" element={<GeneratedContentView/>} />
        <Route path=":courseId/sections/:sectionId/content/:contentId/map" element={<MarkmapView/>} />
        <Route path=":courseId/sections/:sectionId/contents/:contentId/edit-title" element={<EditContentPage />} />
      </Routes>
  );
};

export default CourseRoutes;
