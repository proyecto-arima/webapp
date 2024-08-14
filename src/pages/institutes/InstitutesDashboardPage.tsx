import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Button, Card, Table } from "reactstrap"
import { get } from "../../utils/network"

export const InstitutesDashboardPage = () => {

  const [institutes, setInstitutes] = useState([])

  useEffect(() => {
    get('/institutes').then(res => res.json()).then(res => setInstitutes(res.data))
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
      <h2>Instituciones</h2>
      <hr />
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {institutes.map((institute: any) => (
            <tr key={institute.id}>
              <td>{institute.name}</td>
              <td>{institute.address}</td>
              <td>{institute.phone}</td>
              <td className="d-flex flex-row justify-content-end">
                <Button style={{ background: 'red', border: 'red' }}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  </div>
}