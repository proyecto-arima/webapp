import { Route, Routes } from 'react-router-dom';
import { StudentCreationPage } from './StudentCreationPage';

export default function UserRouter() {
  return (
    <Routes>
      <Route path="/new" element={<StudentCreationPage />} />
    </Routes>
  );
}
