import { useEffect, useState } from "react"
import { Card, Table } from "reactstrap"
import { get } from "../../utils/network"

export const DirectorDashboardPage = () => {

  const [directors, setDirectors] = useState([])

  useEffect(() => {
    get('/directors').then(res => res.json()).then(res => setDirectors(res.data))
  }, [])


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
            <th>Instituto</th>
          </tr>
        </thead>
        <tbody>
          {directors.map((director: any) => (
            <tr key={director.id}>
              <td>{director.user.firstName}</td>
              <td>{director.user.lastName}</td>
              <td>{director.user.email}</td>
              <td>{director.institute.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  </div>
}