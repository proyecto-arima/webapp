import { Route, Routes } from 'react-router-dom';
import NotImplemented from '../../components/NotImplemented';

export default function LoggedInRouter() {
  return (
    <Routes>
      <Route path="/" element={<NotImplemented/>} />
    </Routes>
  );
}
