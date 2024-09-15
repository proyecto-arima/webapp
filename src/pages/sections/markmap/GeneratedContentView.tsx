import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "reactstrap";
import { get } from "../../../utils/network";
import './GeneratedContentView.css';
import MarkmapHooks from './utils/MarkmapHooks';

export interface IContent {
  id: string;
  title: string;
  generated: string;
}

export const GeneratedContentView = () => {

  const { contentId } = useParams<{ contentId: string }>();
  const [content, setContent] = useState<IContent>();

  useEffect(() => {
    get(`/contents/${contentId}`).then(res => res.json()).then(res => res.data).then((data: IContent) => setContent(data));
  }, []);


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
      <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%' }}>
        <h2>Contenido</h2>
        <hr />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: '1rem',
        }}>
          <h3>{content?.title}</h3>
          {content && <MarkmapHooks initValue={content.generated}/>}
          </div>
      </Card>
    </div>
  </div>


};