import { Route, Routes } from 'react-router-dom';
import { StudentCreationPage } from '../pages/students/StudentCreationPage';

export default function UserRouter() {
  return (
    <Routes>
      <Route path="/" element={<StudentCreationPage />} />
      <Route path="/new" element={<StudentCreationPage />} />
    </Routes>
  );
}