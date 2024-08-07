import { Card, CardBody, CardTitle, Input, Label } from 'reactstrap';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  learningType: string;
  rol: string;
}

export const StudentProfilePage = () => {
  const data: Profile = {
    firstName: "John",
    lastName: "Doe",
    email: "jdoe@frba.utn.edu.ar",
    institution: "Universidad Tecnológica de Buenos Aires",
    learningType: "Asimilador",
    rol: "Estudiante"
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <div className="container">
        <div className="row">
          <Card className='profile-card'>
            <CardTitle tag="h5">Datos personales</CardTitle>
            <CardBody>
              <Label for="firstName">Nombre</Label>
              <Input type="text" name="firstName" id="firstName" value={data.firstName} disabled />
              <Label for="lastName">Apellido</Label>
              <Input type="text" name="lastName" id="lastName" value={data.lastName} disabled />
              <Label for="email">Email</Label>
              <Input type="email" name="email" id="email" value={data.email} disabled />
              <Label for="institution">Institución</Label>
              <Input type="text" name="institution" id="institution" value={data.institution} disabled />
              <Label for="learningType">Mi tipo de aprendizaje</Label>
              <Input type="text" name="learningType" id="learningType" value={data.learningType} disabled />
              <Label for="learningType">Mi rol</Label>
              <Input type="text" name="rol" id="rol" value={data.rol} disabled />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
