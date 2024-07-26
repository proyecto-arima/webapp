import { Route, Routes } from 'react-router-dom';
import { CourseCreationPage } from './CourseCreationPage';

export default function UserRouter() {
  return (
    <Routes>
      <Route path="/new" element={<CourseCreationPage />} />
    </Routes>
  );
}