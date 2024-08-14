import { useSearchParams } from "react-router-dom";
import { Card } from "reactstrap";

export const RawContentView = () => {

  const [searchParams, setUrlSearchParams] = useSearchParams();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',  /* Alinea el contenido al inicio, en lugar de al centro */
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', /* Alinea el contenido al principio */
        padding: '20px',
        width: '100%',
        height: '100%',
      }}>
        <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
          <h2>Contenido</h2>
          <hr />
          <iframe src={searchParams.get('url') as string} style={{ width: '100%', height: '100%' }}></iframe>
        </Card>
      </div>
    </div>

  )
};