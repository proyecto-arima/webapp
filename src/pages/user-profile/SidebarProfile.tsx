import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import logo from '../../assets/images/horizontal_black.png';
import { API_URL } from "../../config";
import { logout } from "../../redux/slices/auth";

const studentCourses = [
  { to: '/courses/1', label: 'Historia' },
  { to: '/courses/2', label: 'Lengua' },
];

const links = [
  { to: '/me/evaluations/', label: 'Evaluaciones' },
  { to: '/me/learning-type/', label: 'Tipo de aprendizaje' },
];

export default function SidebarProfile() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signout = () => {
    // fetch(`${API_URL}/auth`, {
    //   method: 'DELETE',
    //   headers: { 'Content-Type': 'application/json' },
    //   credentials: 'include',
    // }).then(() => {
    //   dispatch(logout());
    //   navigate('/login');
    // });
    console.log('Signout');
    
  };

  return (
    <Nav vertical className='sidebar'>
      <img src={logo} alt="Proyecto Arima" className='sidebar-header' />
      <div className='sidebar-container'>
        <div className="w-100">
          <span className='sidebar-section-title'>Mis cursos favoritos</span>

          {studentCourses.map((link) => (
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

        <div className="w-100">
          <span className='sidebar-section-title'>Aprendizaje</span>
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

        <div className="w-100">
        <span className='sidebar-section-title'>Mi usuario</span>
        <NavLink to={'/me/profile'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
            <NavItem className='sidebar-navlink-item' onClick={() => navigate("/me/profile")}>
              <FontAwesomeIcon icon={faCircle} style={{
                width: '0.6rem',
                color: '#49454f',
              }} />
              <span>Perfil</span>
            </NavItem>
          </NavLink>
          <NavLink to={'/login'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
            <NavItem className='sidebar-navlink-item' onClick={signout}>
              <FontAwesomeIcon icon={faCircle} style={{
                width: '0.6rem',
                color: '#49454f',
              }} />
              <span>Salir</span>
            </NavItem>
          </NavLink>
        </div>

      </div>

    </Nav>
  )
}