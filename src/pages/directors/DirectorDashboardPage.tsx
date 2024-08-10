import { Card, Table } from "reactstrap"

export const DirectorDashboardPage = () => {
  return <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f6effa',
      width: '100vw',
    }}
  >
    <Card style={{ width: '90%', paddingInline: '2rem', paddingBlock: '1rem', height: '90%' }}>
      <h2>Directivos</h2>
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
          <tr>
            <td>John</td>
            <td>Doe</td>
            <td>director@proyectoarima.tech</td>
          </tr>
        </tbody>
      </Table>
    </Card>
  </div>
}