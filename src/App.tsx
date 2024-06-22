import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AuthRouter from './pages/auth/AuthRouter';
import LoggedInRouter from './pages/auth/LoggedInRouter';

function App() {

  return (
    <BrowserRouter>
      <AuthRouter />
      <LoggedInRouter />
    </BrowserRouter>
  );
}

export default App;
