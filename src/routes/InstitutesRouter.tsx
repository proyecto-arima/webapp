import { Route, Routes } from 'react-router-dom';
import { InstitutesCreationPage } from '../pages/institutes/InstitutesCreationPage';
import { InstitutesDashboardPage } from '../pages/institutes/InstitutesDashboardPage';

export default function InstitutesRouter() {
  return (
    <Routes>
      <Route path="/" element={<InstitutesDashboardPage />} />
      <Route path="/new" element={<InstitutesCreationPage/>} />
    </Routes>
  );
}