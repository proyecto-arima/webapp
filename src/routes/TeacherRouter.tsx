import { Route, Routes } from "react-router-dom";
import { TeacherCreationPage } from "../pages/teachers/TeacherCreationPage";
import { TeacherDashboardPage } from "../pages/teachers/TeacherDashboardPage";
import { TeachersSurveyDashboardPage } from "../pages/teachers/TeachersSurveyDashboardPage";

export const TeacherRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<TeacherDashboardPage />} />
      <Route path="/new" element={<TeacherCreationPage />} />
      <Route path="/survey" element={<TeachersSurveyDashboardPage />} />
    </Routes>
  );
};