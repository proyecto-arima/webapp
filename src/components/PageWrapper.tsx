import { Card } from "reactstrap";

interface IPageWrapperProps {
  title: string;
  children: React.ReactNode;
  buttons?: React.ReactNode;
}

export default function PageWrapper(props: IPageWrapperProps) {
  return <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',  /* Alinea el contenido al inicio, en lugar de al centro */
      height: '100vh',
      backgroundColor: '#f6effa',
      width: '100vw',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', /* Alinea el contenido al principio */
        padding: '20px',
        width: '100%',
        height: '100%',
      }}
    >
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%', marginBottom: 0 }}>
        <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}>
          <h4>{props.title}</h4>
          {props.buttons}
        </div>
        <hr />
        {props.children}
      </Card>
    </div>
  </div>
}