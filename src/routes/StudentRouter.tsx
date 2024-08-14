import { Route, Routes } from 'react-router-dom';
import { StudentCreationPage } from '../pages/students/StudentCreationPage';
import { StudentDashboardPage } from '../pages/students/StudentDashboardPage';

export default function UserRouter() {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboardPage />} />
      <Route path="/new" element={<StudentCreationPage />} />
    </Routes>
  );
}