import { Card, CardBody, CardTitle, Input, Label } from 'reactstrap';
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

export const UserProfilePage = () => {
  // TODO: Pendiente agregar institucion, tipo de aprendizaje en el store
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
          <Card className='profile-card'>
            <CardTitle tag="h5">Datos personales</CardTitle>
            <CardBody>
              <Label for="firstName">Nombre</Label>
              <Input type="text" name="firstName" id="firstName" defaultValue={user.firstName} disabled />
              <Label for="lastName">Apellido</Label>
              <Input type="text" name="lastName" id="lastName" defaultValue={user.lastName} disabled />
              <Label for="email">Email</Label>
              <Input type="email" name="email" id="email" defaultValue={user.email} disabled />
              <Label for="institution">Institución</Label>
              <Input type="text" name="institution" id="institution" defaultValue={"SIN_INSTITUCION"} disabled />
              <Label for="learningType">Mi tipo de aprendizaje</Label>
              <Input type="text" name="learningType" id="learningType" defaultValue={"SIN_TIPO_APRENDIZAJE"} disabled />
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
