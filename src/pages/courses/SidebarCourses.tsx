import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import logo from '../../assets/images/horizontal_black.png';
import { API_URL } from "../../config";
import { logout } from "../../redux/slices/auth";

const links = [
  { to: '/courses/create', label: 'Crear curso' },
  { to: '/courses/dashboard', label: 'Ver Cursos' },
];

export default function SidebarCourses() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signout = () => {
    fetch(`${API_URL}/auth`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then(() => {
      dispatch(logout());
      navigate('/login');
    });
  };

  return (
    <Nav vertical className='sidebar'>
      <img src={logo} alt="Proyecto Arima" className='sidebar-header' />
      <div className='sidebar-container'>
        <div className="w-100">
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

        <div className="w-100">
          <span className='sidebar-section-title'>Opciones</span>
          <NavLink to={'/login'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
            <NavItem className='sidebar-navlink-item' onClick={signout}>
              <FontAwesomeIcon icon={faCircle} style={{
                width: '0.6rem',
                color: '#49454f',
              }} />
              <span>Cerrar sesión</span>
            </NavItem>
          </NavLink>
        </div>

      </div>

    </Nav>
  )
}