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

const coursesManagmentSection = [
  { to: '/courses/create', label: 'Crear curso' },
  { to: '/courses/dashboard', label: 'Ver Cursos' },
];

const studentLearningSection = [
  { key: "1", to: '/me/learning-type', label: 'Test de aprendizaje' },
  // { key: "2", to: '/me/evaluations', label: 'Evaluaciones' },
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

          {user?.role === 'TEACHER' && (
            <div className="w-100">
              <span className='sidebar-section-title'>Gestión de Cursos</span>
              {coursesManagmentSection.map((link) => (
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

          {user?.role && ['STUDENT', 'TEACHER'].includes(user.role) && (
            <div className="w-100">
              <span className='sidebar-section-title'>Mis Cursos</span>
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
          )}

          {user?.role === 'STUDENT' && (
            <div className="w-100">
              <span className='sidebar-section-title'>Aprendizaje</span>
              {studentLearningSection.map((link) => (
                <NavLink end
                  to={link.to}
                  key={link.key}
                  className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}
                >
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

          {(user?.role === 'ADMIN') && (
            <div className="w-100">
              <span className='sidebar-section-title'>Instituciones</span>
              <NavLink to={'/institutes'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} style={{
                    width: '0.6rem',
                    color: '#49454f',
                  }} />
                  <span>Institutos</span>
                </NavItem>
              </NavLink>
              <NavLink to={'/institutes/new'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} style={{
                    width: '0.6rem',
                    color: '#49454f',
                  }} />
                  <span>Crear Instituto</span>
                </NavItem>
              </NavLink>
              <span className='sidebar-section-title'>Directivos</span>
              <NavLink to={'/directors'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} style={{
                    width: '0.6rem',
                    color: '#49454f',
                  }} />
                  <span>Directivos</span>
                </NavItem>
              </NavLink>
              <NavLink to={'/directors/new'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} style={{
                    width: '0.6rem',
                    color: '#49454f',
                  }} />
                  <span>Crear Directivo</span>
                </NavItem>
              </NavLink>
            </div>
          )}
          
          {( user?.role === 'DIRECTOR') && (
            <div className="w-100">
              <span className='sidebar-section-title'>Estudiantes</span>
              <NavLink to={'/students/'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} style={{
                    width: '0.6rem',
                    color: '#49454f',
                  }} />
                  <span>Estudiantes</span>
                </NavItem>
              </NavLink>
              <NavLink to={'/students/new'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} style={{
                    width: '0.6rem',
                    color: '#49454f',
                  }} />
                  <span>Crear Estudiante</span>
                </NavItem>
              </NavLink>
              <span className='sidebar-section-title'>Docentes</span>
              <NavLink to={'/teachers/'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} style={{
                    width: '0.6rem',
                    color: '#49454f',
                  }} />
                  <span>Docentes</span>
                </NavItem>
              </NavLink>
              <NavLink to={'/teachers/new'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
                <NavItem className='sidebar-navlink-item'>
                  <FontAwesomeIcon icon={faCircle} style={{
                    width: '0.6rem',
                    color: '#49454f',
                  }} />
                  <span>Crear Docente</span>
                </NavItem>
              </NavLink>
            </div>
          )}
        </div>

        <div className="w-100">
          <span className='sidebar-section-title'>Perfil</span>
          <NavLink to={'/me/profile'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'}>
            <NavItem className='sidebar-navlink-item'>
              <FontAwesomeIcon icon={faCircle} style={{
                width: '0.6rem',
                color: '#49454f',
              }} />
              <span>Datos personales</span>
            </NavItem>
          </NavLink>

          <NavLink to={'/login'} end className={({ isActive }) => isActive ? 'sidebar-navlink-active' : 'sidebar-navlink-inactive'} onClick={signout}>
            <NavItem className='sidebar-navlink-item'>
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
