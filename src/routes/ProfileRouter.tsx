import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { UserProfilePage } from '../pages/user-profile/UserProfilePage';
import { StudentProfileLearningTypePage } from '../pages/user-profile/StudentProfileLearningTypePage';

const ProfileRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="learning-type" element={<StudentProfileLearningTypePage />} />
        <Route path="evaluations" element={<StudentProfileLearningTypePage />} />
      </Routes>
  );
};

export default ProfileRouter;

