import { useEffect, useState } from "react";
import { Card, Table } from "reactstrap";
import { get, patch } from "../../utils/network";
import { useNavigate } from "react-router-dom";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import PageWrapper from "../../components/PageWrapper";
import Select from "react-select";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

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
    let selectedRole = "";
  
    const SelectComponent = () => {
      const options = [
        { value: "STUDENT", label: "Estudiante" },
        { value: "DIRECTOR", label: "Director" },
      ];
  
      return (
        <div>
          <Select
            options={options}
            placeholder="Seleccionar nuevo rol"
            isSearchable={false}
            onChange={(selectedOption) => {
              selectedRole = selectedOption?.value || "";
            }}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Asegura que se muestre encima de todo
              menu: (base) => ({
                ...base,
                zIndex: 9999,
                position: "absolute", // Despliega el menú sobre otros elementos
              }),
              menuList: (base) => ({
                ...base,
                maxHeight: "none", // Muestra todas las opciones
              }),
            }}
            menuPortalTarget={document.body} // Muestra el menú fuera del contenedor
          />
        </div>
      );
    };
  
    const { isConfirmed } = await MySwal.fire({
      title: "Modificar rol de usuario",
      html: <SelectComponent />,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        if (!selectedRole) {
          Swal.fire("Error", "Debés seleccionar un rol", "error");
        }
        return selectedRole; // Devuelve el valor seleccionado
      },
    });
  
    if (isConfirmed && selectedRole) {
      try {
        await patch(`/users/${teacher.id}/role`, { newRole: selectedRole });
  
        if (selectedRole === "STUDENT" || selectedRole === "DIRECTOR") {
          setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));
        } else {
          setTeachers((prev) =>
            prev.map((t) => (t.id === teacher.id ? { ...t, role: selectedRole } : t))
          );
        }
  
        Swal.fire("Éxito", "Rol actualizado correctamente", "success");
      } catch (error) {
        console.error("Error updating role:", error);
        Swal.fire("Error", "Hubo un error al actualizar el rol", "error");
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
      <div style={{
          height: '100%',      // Usa toda la altura disponible en la Card
          overflowY: 'auto',   // Activa el scroll vertical si el contenido excede la altura
        }}>
        <Table style={{
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
      </div>
    </PageWrapper>
  );
};
