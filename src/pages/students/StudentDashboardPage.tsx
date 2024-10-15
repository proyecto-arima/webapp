import { useEffect, useState } from "react";
import { Card, Table, Button } from "reactstrap";
import { get, patch } from "../../utils/network";
import { useNavigate } from "react-router-dom";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';

export const StudentDashboardPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await get('/students');
      const data = await res.json();
      setStudents(data.data);
    };

    fetchStudents();
  }, []);

  const handleEditRole = async (student: any) => {
    const { value: newRole } = await Swal.fire({
      title: 'Modificar rol de usuario',
      input: 'select',
      inputOptions: {
        STUDENT: 'Estudiante',
        TEACHER: 'Docente',
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
        await patch(`/users/${student.id}/role`, { newRole });

        if (newRole === "TEACHER") {
          setStudents(prev => prev.filter(s => s.id !== student.id));
        } else {
          setStudents(prev => prev.map(s => s.id === student.id ? { ...s, role: newRole } : s));
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
            <h2>Estudiantes</h2>
            <Button className="btn-purple-1" onClick={() => navigate('/students/new')} style={{ backgroundColor: '#8e44ad', borderColor: '#8e44ad' }}>
              Crear estudiante
            </Button>
          </div>
          <hr />
          <div style={{ overflow: 'auto' }}>
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
                {students?.map(student => (
                  <tr key={student.id}>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.email}</td>
                    <td>
                      <button className='btn-purple-2' onClick={() => handleEditRole(student)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};
