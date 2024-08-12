import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { UserProfilePage } from '../pages/user-profile/UserProfilePage';
import { StudentLearningTypePage } from '../pages/user-profile/StudentLearningTypePage';
import { StudentLearningTypeForm } from '../pages/user-profile/StudentLearningTypeForm';
import { StudentLearningTypeResult } from '../pages/user-profile/StudentLearningTypeResult';

const ProfileRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="learning-type" element={<StudentLearningTypePage />} />
        <Route path="learning-type/test" element={<StudentLearningTypeForm />} />
        <Route path="learning-type/result" element={<StudentLearningTypeResult />} />
        <Route path="evaluations" element={<StudentLearningTypePage />} />
      </Routes>
  );
};

export default ProfileRouter;

