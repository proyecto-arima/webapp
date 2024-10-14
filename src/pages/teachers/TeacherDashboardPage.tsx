import { useEffect, useState } from "react";
import { Card, Table } from "reactstrap";
import { get } from "../../utils/network";

interface ITeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}


export const TeacherDashboardPage = () => {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);

  useEffect(() => {
    get('/teachers')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: any[]) => {
        setTeachers(data.map(teacherObject => ({
          id: teacherObject.id,
          firstName: teacherObject.user.firstName,
          lastName: teacherObject.user.lastName,
          email: teacherObject.user.email,
        })));
      });
  }, []);


  return <div
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
      {/* BUG: NO MUESTRA LOS DOCENTES */}
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
        <h2>Docentes</h2>
        <hr />
        <Table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {teachers?.map(teacher => (
              <tr key={teacher.id}>
                <td>{teacher.firstName}</td>
                <td>{teacher.lastName}</td>
                <td>{teacher.email}</td>
              </tr>
            ))}
          </tbody>

        </Table>
      </Card>
    </div>
  </div>
};