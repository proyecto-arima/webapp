import { useEffect, useState } from "react";
import { Card, Table } from "reactstrap";
import { get } from "../../utils/network";
import { useNavigate } from "react-router-dom";

export const StudentDashboardPage = () => {

  const [students, setStudents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    get('/students').then(res => res.json()).then(res => res.data).then((data: any[]) => setStudents(data));
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
      <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}>
          <h2>Estudiantes</h2>
          <button className="btn-purple-1" onClick={() => {
            navigate('/students/new');
          }}>Crear estudiante</button>
        </div>
        <hr />
        <div style={{ overflow: 'auto'}}>
        <Table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students?.map(student => (
              <tr key={student.id}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>

        </Table>
        </div>
      </Card>
    </div>
  </div>
};