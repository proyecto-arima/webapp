import SidebarProfile from '../SidebarProfile';
import { Card, CardBody, CardTitle, Input } from 'reactstrap';
import '../../../assets/styles/profile-page.css'

export const StudentProfileLearningTypePage = () => {

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
      <SidebarProfile />
      <div className="container">
        <div className="row">
          <ul>
            <h2>Tu tipo de aprendizaje actualmente es ASIMILADOR</h2>
          </ul>
          <ul>
            <Card className='profile-card'>
              <CardTitle tag="h5">Consideraciones del test</CardTitle>
              <CardBody>
                <div>
                  <Input type='checkbox' checked={true} />
                  <span>El test es una herramienta de autoconocimiento y no una verdad absoluta.</span>
                </div>
                <div>
                  <Input type='checkbox' checked={true} />
                  <span>El test no refleja la totalidad de tu personalidad o tu forma de estudiar</span>
                </div>
                <div>
                  <Input type='checkbox' checked={true} />
                  <span>El test esta pensado para adaptarte el contenido de la plataforma en base a tus preferencias</span>
                </div>
              </CardBody>
            </Card>

          </ul>
          <ul>
            <Card className='profile-card'>
              <CardTitle tag="h5">Queres saber mas?</CardTitle>
              <CardBody>
                <div>
                  <Input type='checkbox' checked={true} />
                  <span>El test de kolb fue desarrollado en 1984</span>
                </div>
                <div>
                  <Input type='checkbox' checked={true} />
                  <span>El test te permite descubrir que forma de aprender es la que mejor se adapta a vos</span>
                </div>
                <div>
                  <Input type='checkbox' checked={true} />
                  <span>Podes repetir el test cuantas veces quieras!</span>
                </div>
              </CardBody>
            </Card>
          </ul>

          <ul>
          <button className="btn-purple-primary" onClick={() => console.log("arranque el test")}>
                Comenzar test
              </button>
          </ul>
        </div>
      </div>
    </div>
  );
};
