import { Route, Routes } from 'react-router-dom';
import { StudentCreationPage } from '../pages/students/StudentCreationPage';
import { StudentDashboardPage } from '../pages/students/StudentDashboardPage';
import { StudentsSurveyDashboardPage } from '../pages/students/StudentsSurveyDashboardPage';

export default function UserRouter() {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboardPage />} />
      <Route path="/new" element={<StudentCreationPage />} />
      <Route path="/survey" element={<StudentsSurveyDashboardPage />} />
    </Routes>
  );
}