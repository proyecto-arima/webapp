import { Card, CardBody, CardTitle, Input, Label } from 'reactstrap';
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

export const UserPersonalDataPage = () => {
  const user = useSelector((state: RootState) => state.user);

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
          <Card
          style={{
            width: '100%',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
          }}
          >
            <CardTitle tag="h2">Tus datos</CardTitle>
            <CardBody
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
            >
              <Label for="firstName">Nombre</Label>
              <Input type="text" name="firstName" id="firstName" defaultValue={user.firstName} disabled />
              <Label for="lastName">Apellido</Label>
              <Input type="text" name="lastName" id="lastName" defaultValue={user.lastName} disabled />
              <Label for="email">Email</Label>
              <Input type="email" name="email" id="email" defaultValue={user.email} disabled />
              <Label for="institution">Institución</Label>
              <Input type="text" name="institution" id="institution" defaultValue={user.institution} disabled />
              <Label for="learningType">Mi tipo de aprendizaje</Label>
              <Input type="text" name="learningType" id="learningType" defaultValue={user.learningType} disabled />
              <Label for="learningType">Mi rol</Label>
              <Input type="text" name="rol" id="rol" defaultValue={
                user.role === 'STUDENT' ? "Estudiante" : 
                user.role === 'TEACHER' ? "Profesor" : 
                user.role === 'ADMIN' ? "Administrador" : "Administrador"
              } disabled />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
