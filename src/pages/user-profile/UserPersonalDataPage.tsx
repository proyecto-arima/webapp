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
        alignItems: 'flex-start',
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '20px',
        width: '100%',
        height: '100%',
      }}>
        <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
          <CardTitle tag="h2">Tus datos</CardTitle>
          <hr />
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

            {
              ['DIRECTOR', 'TEACHER', 'STUDENT'].includes(user.role ?? '') ? (
                <>
                  <Label for="institute">Institución</Label>
                  <Input type="text" name="institute" id="institute" defaultValue={
                    user.institute ? user.institute.name : "Sin institución"
                  } disabled />
                </>
              ) : null
            }

            {
              user.role === 'STUDENT' ?
                <>
                  <Label for="learningType">Mi tipo de aprendizaje</Label>
                  <Input type="text" name="learningType" id="learningType" defaultValue={
                    user.learningProfile === 'CONVERGENTE' ? "Convergente" :
                      user.learningProfile === 'DIVERGENTE' ? "Divergente" :
                        user.learningProfile === 'ACOMODADOR' ? "Acomodador" :
                          user.learningProfile === 'ASIMILADOR' ? "Asimilador" : "Sin tipo de aprendizaje"
                  } disabled />
                </> : null
            }

            <Label for="learningType">Mi rol</Label>
            <Input type="text" name="rol" id="rol" defaultValue={
              user.role === 'DIRECTOR' ? "Directivo" :
                user.role === 'STUDENT' ? "Estudiante" :
                  user.role === 'TEACHER' ? "Docente" :
                    user.role === 'ADMIN' ? "Administrador" : "Sin rol"
            } disabled />
          </CardBody>
        </Card>
      </div>

    </div>


  );
};
