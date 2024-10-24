import { useNavigate } from 'react-router-dom';
import { Card } from 'reactstrap';

import logo_black_only from '../assets/images/logo_black_only.png';

export default function NotImplementedPage() {

  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <Card style={{
          padding: '2rem',
        }}>
          <img src={logo_black_only} className="App-logo" alt="logo" />
          <p>
            Coming Soon!
          </p>
          <button className='btn-purple-1' onClick={() => navigate('/login')}>Volver</button>
        </Card>
      </header>
    </div>
  );
}