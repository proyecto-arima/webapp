import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CourseDashboardPage } from '../pages/courses/CourseDashboardPage';
import { CourseCreationPage } from '../pages/courses/CourseCreationPage';
import { CourseDetailPage } from '../pages/courses/CourseDetailPage';

import { SectionCreationPage } from '../pages/courses/SectionCreationPage';
import { SectionContentCreation } from '../pages/sections/SectionContentCreation';

import { EditContentPage } from '../pages/sections/EditContentPage';
import { EditCoursePage } from '../pages/courses/EditCoursePage';
import { EditSectionPage } from '../pages/courses/EditSectionPage';

import { StudentLinkingPage } from '../pages/courses/StudentLinkingPage';

import { GeneratedContentView } from '../pages/sections/text/GeneratedContentView';
import { GeneratedContentView as MarkmapView } from '../pages/sections/markmap/GeneratedContentView';
import { RawContentView } from '../pages/sections/RawContentView';
import { SectionContentDashboard } from '../pages/sections/SectionContentDashboardPage';
import Game from '../pages/sections/game/GeneratedContentView';
import GeneratedContentViewAudio from '../pages/sections/audio/GeneratedContentView';
import ContentSelectionForTeacher from '../pages/sections/ContentSelectionForTeacher';
import GameEditionPage from '../pages/sections/game/GameEdition';

const CourseRoutes: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<CourseDashboardPage />} />
        <Route path="create" element={<CourseCreationPage />} />
        <Route path="dashboard" element={<CourseDashboardPage />} />
        <Route path=":courseId" element={<CourseDetailPage />} />
        <Route path=":courseId/edit" element={<EditCoursePage />} />
        <Route path=":courseId/new-section" element={<SectionCreationPage />} />
        <Route path=":courseId/students" element={<StudentLinkingPage />} />
        <Route path=":courseId/sections/:sectionId" element={<SectionContentDashboard/>} />
        <Route path=":courseId/sections/:sectionId/new" element={<SectionContentCreation/>} /> {/* TODO: FIX */}
        <Route path="/courses/:courseId/sections/:sectionId/edit" element={<EditSectionPage />} />
        <Route path=":courseId/sections/:sectionId/edit" element={<EditSectionPage />} />
        <Route path=":courseId/sections/:sectionId/content/:contentId" element={<RawContentView/>} />
        <Route path=":courseId/sections/:sectionId/content/:contentId/summary" element={<GeneratedContentView/>} />
        <Route path=":courseId/sections/:sectionId/content/:contentId/map" element={<MarkmapView/>} />
        <Route path=":courseId/sections/:sectionId/content/:contentId/game" element={<Game/>} />
        <Route path=":courseId/sections/:sectionId/content/:contentId/audio" element={<GeneratedContentViewAudio/>} />
        <Route path=":courseId/sections/:sectionId/content/:contentId/review" element={<ContentSelectionForTeacher/>} />
        <Route path=":courseId/sections/:sectionId/contents/:contentId/edit-title" element={<EditContentPage />} />
        <Route path=":courseId/sections/:sectionId/content/:contentId/game/edit" element={<GameEditionPage/>} />
      </Routes>
  );
};

export default CourseRoutes;
