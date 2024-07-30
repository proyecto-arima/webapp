import { Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/LoginPage';

export default function AuthRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}