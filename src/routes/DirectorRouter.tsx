import { Route, Routes } from 'react-router-dom';
import { DirectorCreationPage } from '../pages/directors/DirectorCreationPage';
import { DirectorDashboardPage } from '../pages/directors/DirectorDashboardPage';

export default function DirectorRouter() {
  return (
    <Routes>
      <Route path="/" element={<DirectorDashboardPage />} />
      <Route path="/new" element={<DirectorCreationPage />} />
    </Routes>
  );
}