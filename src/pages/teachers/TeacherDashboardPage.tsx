import { useEffect, useState } from "react";
import { Card, Table } from "reactstrap";
import { get } from "../../utils/network";

export const TeacherDashboardPage = () => {

  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    get('/teachers').then(res => res.json()).then(res => res.data).then((data: any[]) => setTeachers(data));
  }, []);


  return <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',  /* Alinea el contenido al inicio, en lugar de al centro */
      height: '100vh',
      backgroundColor: '#f6effa',
      width: '100vw',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', /* Alinea el contenido al principio */
        padding: '20px',
        width: '100%',
        height: '100%',
      }}
    >
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