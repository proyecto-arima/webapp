import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import { API_URL } from './config';

import AuthRouter from './pages/auth/AuthRouter';
import UserRouter from './pages/students/StudentRouter';
import { login } from './redux/slices/auth';
import { RootState } from './redux/store';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  console.log(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      fetch(`${API_URL}/auth`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }).then(res => {
        if (res.ok) {
          dispatch(login());
        }
      })
    }
  }, [isAuthenticated])

  return (
    <BrowserRouter>
      <div className='main-content'>

        {isAuthenticated && <Sidebar />}
        <AuthRouter />
        
        <Routes>
          <Route path='/students/*' element={<ProtectedRoute><UserRouter /></ProtectedRoute>} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;
