import { useEffect, useState } from "react";
import { Card, Table } from "reactstrap";
import { get, patch } from "../../utils/network";
import { useNavigate } from "react-router-dom";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import PageWrapper from "../../components/PageWrapper";

interface ITeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const TeacherDashboardPage = () => {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

 
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

    fetchTeachers().then(() => setLoading(false));
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
      customClass: {
        confirmButton: 'btn-purple-1',
        cancelButton: 'btn-purple-2'
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
    <PageWrapper title="Docentes"
      loading={loading}
      skeletonType="table"
      columnsCount={4}
      buttons={
        <button className="btn-purple-1" onClick={() => navigate('/teachers/new')}>
          Crear docente
        </button>
      }
    >
      
      <Table style={{
        overflow: 'auto',
        fontSize: 'small',
      }}>
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
    </PageWrapper>
  );
};
