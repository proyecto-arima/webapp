import Select from "react-select";
import { useEffect, useState } from "react";
import { Card, Table } from "reactstrap";
import { get, patch } from "../../utils/network";
import { useNavigate } from "react-router-dom";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import PageWrapper from "../../components/PageWrapper";

const MySwal = withReactContent(Swal);

export const StudentDashboardPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await get("/students");
      const data = await res.json();
      setStudents(data.data);
    };

    fetchStudents().then(() => setLoading(false));
  }, []);

  const handleEditRole = async (student: any) => {
    let selectedRole = "";

    const SelectComponent = () => {
      const options = [
        { value: "STUDENT", label: "Estudiante" },
        { value: "TEACHER", label: "Docente" },
      ];
      return (
        <div>
          <Select
            options={[
              { value: "TEACHER", label: "Docente" },
            ]}
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
        await patch(`/users/${student.id}/role`, { newRole: selectedRole });

        if (selectedRole === "TEACHER") {
          setStudents((prev) => prev.filter((s) => s.id !== student.id));
        } else {
          setStudents((prev) =>
            prev.map((s) => (s.id === student.id ? { ...s, role: selectedRole } : s))
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
    <PageWrapper
      title="Estudiantes"
      buttons={
        <button className="btn-purple-1" onClick={() => navigate("/students/new")}>
          Crear estudiante
        </button>
      }
      loading={loading}
      skeletonType="table"
      columnsCount={4}
    >
      <div style={{ overflow: "auto", fontSize: "small" }}>
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
            {students?.map((student) => (
              <tr key={student.id}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.email}</td>
                <td>
                  <button
                    className="btn-purple-2"
                    onClick={() => handleEditRole(student)}
                  >
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
