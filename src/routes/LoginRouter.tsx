import { Route, Routes } from 'react-router-dom';
import NotImplemented from '../components/NotImplemented';
import RecoverPassword from '../pages/auth/RecoverPasswordPage';

export default function LoginRouter() {
  return (
    <Routes>
      {/* <Route path="/" element={<NotImplemented/>} /> */}
      <Route path="/recoverPassword" element={<RecoverPassword />} />
    </Routes>
  );
}
