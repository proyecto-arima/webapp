import { Route, Routes } from 'react-router-dom';

import './App.css';
import LoginPage from './pages/auth/LoginPage';
import RecoverPasswordPage from './pages/auth/RecoverPasswordPage';
import SetPasswordPage from './pages/auth/SetPasswordPage';
import { Index } from './pages/Index';


function App() {
  return (
    <div className='main-content'>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotPassword" element={<RecoverPasswordPage />} />
        <Route path="/recoverPassword" element={<SetPasswordPage />} />
        <Route path='/*' element={<Index />} />
      </Routes>

    </div>
  );
}

export default App;
