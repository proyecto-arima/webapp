import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import './App.css';
import logo from './assets/horizontal_black.png';
import AuthRouter from './pages/auth/AuthRouter';
import CourseRouter from './pages/courses/CourseRouter';

function App() {
  const links = [
    { to: '/courses/new', label: 'Crear Curso' },
    { to: '/courses', label: 'Ver Cursos' },
  ];

  return (
    <BrowserRouter>
      <AuthRouter />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: '#f7f2fa',
      }}>
        <Nav vertical className='sidebar'>
          <img src={logo} alt="Proyecto Arima" className='sidebar-header'/>
          <div className='sidebar-container'>
            <span className='sidebar-section-title'>Gestión de Cursos</span>

            {links.map((link) => (
              <NavLink end to={link.to} key={link.to} className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} style={{
                    width: '0.6rem',
                    color: '#49454f',
                  }} />
                  <span>{link.label}</span>
                </NavItem>
              </NavLink>
            ))}

          </div>

        </Nav>

        <Routes>
          <Route path="/courses/*" element={<CourseRouter />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;
