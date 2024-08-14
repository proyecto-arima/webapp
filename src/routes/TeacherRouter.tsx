import { Route, Routes } from "react-router-dom";
import { TeacherCreationPage } from "../pages/teachers/TeacherCreationPage";
import { TeacherDashboardPage } from "../pages/teachers/TeacherDashboardPage";

export const TeacherRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<TeacherDashboardPage />} />
      <Route path="/new" element={<TeacherCreationPage />} />
    </Routes>
  );
};