import { useEffect, useState } from "react";
import { Card, Table } from "reactstrap";
import { get } from "../../utils/network";

export const TeachersSurveyDashboardPage = () => {

  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    // get('/students').then(res => res.json()).then(res => res.data).then((data: any[]) => setStudents(data));
    get('/teachers').then(res => res.json()).then(res => res.data).then((data: any[]) => {
      // console.log(data);
    });
    get('/users/66e3abfd888691f9e9368663').then(res => res.json()).then(res => res.data).then((data: any[]) => {
      console.log(data);
    });
    setStudents([
      {
        id: '1',
        firstName: 'Ricardo',
        lastName: 'Monzon',
        email: 'rmongozn@gmail.com'
      },
    ]);
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
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
        <h2>Estudiantes</h2>
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