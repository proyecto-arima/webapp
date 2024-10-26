import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { UserPersonalDataPage } from '../pages/user-profile/UserPersonalDataPage';
import { StudentLearningTypePage } from '../pages/user-profile/StudentLearningTypePage';
import { StudentLearningTypeForm } from '../pages/user-profile/StudentLearningTypeForm';
import { StudentLearningTypeResult } from '../pages/user-profile/StudentLearningTypeResult';
import { SurveyPage } from '../pages/SurveyPage';
import { UserCreationMassivePage } from '../pages/teachers/UserCreationMassivePage';

const ProfileRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="profile" element={<UserPersonalDataPage />} />
        <Route path='survey' element={<SurveyPage/>} />
        <Route path="learning-type" element={<StudentLearningTypePage />} />
        <Route path="learning-type/test" element={<StudentLearningTypeForm />} />
        <Route path="learning-type/result" element={<StudentLearningTypeResult />} />
        <Route path="/users/bulk" element={<UserCreationMassivePage />} />
      </Routes>
  );
};

export default ProfileRouter;

