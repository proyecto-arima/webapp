import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import logo from '../assets/images/horizontal_black.png';
import { logout } from "../redux/slices/auth";
import { ICourse } from "../redux/slices/courses";
import { reset } from "../redux/slices/user";
import { RootState } from "../redux/store";
import { del } from "../utils/network";

const coursesManagementLinks = [
  { to: '/courses/create', label: 'Crear curso' },
  { to: '/courses/dashboard', label: 'Ver Cursos' },
];

export default function Sidebar() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const courses = useSelector((state: RootState) => state.courses.courses);

  const signout = () => {
    del('/auth').then(() => {
      dispatch(logout());
      dispatch(reset());
      navigate('/login');
    });
  };

  return (
    <Nav vertical className='sidebar'>
      <img src={logo} alt="Proyecto Arima" className='sidebar-header' />
      <div className='sidebar-container'>
        <div className="w-100 d-flex flex-column gap-3">
          {user.role === 'TEACHER' && (
            <div className="w-100">
              <span className='sidebar-section-title'>Gestión de Cursos</span>
              {coursesManagementLinks.map((link) => (
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
          )}

          <div className="w-100">
            <span className='sidebar-section-title'>Mis Cursos</span>
            {/* Mostrar los cursos en el sidebar */}
            {courses?.map((course: ICourse) => (
            <NavLink 
              end 
              to={`/courses/${course.id}`} 
              key={course.id} 
              className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
              <NavItem className='sidebar-navlink-item'>
                <FontAwesomeIcon icon={faCircle} style={{
                  width: '0.6rem',
                  color: '#49454f',
                }} />
                <span>{course.title}</span>
              </NavItem>
            </NavLink>
          ))}
          </div>
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