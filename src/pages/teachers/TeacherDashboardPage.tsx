import { useEffect, useState } from "react";
import { Card, Table } from "reactstrap";
import { get, patch } from "../../utils/network";
import { useNavigate } from "react-router-dom";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';

interface ITeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const TeacherDashboardPage = () => {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await get('/teachers');
        const data = await res.json();

        // Verifica la estructura de data
        if (data && data.data) {
          setTeachers(data.data.map((teacherObject: any) => ({
            id: teacherObject.user._id,
            firstName: teacherObject.user.firstName,
            lastName: teacherObject.user.lastName,
            email: teacherObject.user.email,
          })));
        } else {
          console.error("No se encontraron docentes");
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleEditRole = async (teacher: ITeacher) => {
    const { value: newRole } = await Swal.fire({
      title: 'Modificar rol de usuario',
      input: 'select',
      inputOptions: {
        STUDENT: 'Estudiante',
        TEACHER: 'Docente',
        DIRECTOR: 'Director',	
      },
      inputPlaceholder: 'Seleccionar nuevo rol',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: (role) => {
        if (!role) {
          Swal.showValidationMessage('Debes seleccionar un rol');
        }
      }
    });

    if (newRole) {
      try {
        await patch(`/users/${teacher.id}/role`, { newRole });

        if (newRole === "STUDENT" || newRole === "DIRECTOR") {
          setTeachers(prev => prev.filter(t => t.id !== teacher.id));
        } else {
          setTeachers(prev => prev.map(t => t.id === teacher.id ? { ...t, role: newRole } : t));
        }

        Swal.fire('Éxito', 'Rol actualizado correctamente', 'success');
      } catch (error) {
        console.error('Error updating role:', error);
        Swal.fire('Error', 'Hubo un error al actualizar el rol', 'error');
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '20px',
          width: '100%',
          height: '100%',
        }}
      >
        <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
            <h2>Docentes</h2>
            <button className="btn-purple-1" onClick={() => navigate('/teachers/new')}>
              Crear docente
            </button>
          </div>
          <hr />
          <Table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Editar Rol</th>
              </tr>
            </thead>
            <tbody>
              {teachers?.map(teacher => (
                <tr key={teacher.id}>
                  <td>{teacher.firstName}</td>
                  <td>{teacher.lastName}</td>
                  <td>{teacher.email}</td>
                  <td>
                    <button className='btn-purple-2' onClick={() => handleEditRole(teacher)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
};
