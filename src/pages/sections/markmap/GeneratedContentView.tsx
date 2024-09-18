import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Progress } from "reactstrap";
import { get } from "../../../utils/network";
import './GeneratedContentView.css';
import MarkmapHooks from './utils/MarkmapHooks';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import processing from '../../../assets/images/processing.gif';

interface IGenerated {
  type: string;
  content: string;
}

export interface IContent {
  id: string;
  title: string;
  generated: IGenerated[];
}

export const GeneratedContentView = () => {

  const { contentId } = useParams<{ contentId: string }>();
  const [content, setContent] = useState<IContent>();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    get(`/contents/${contentId}`).then(res => res.json()).then(res => res.data).then((data: IContent) => setContent(data));
  }, []);

  const markmap = content?.generated[1].content;


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
          {markmap ? <MarkmapHooks initValue={markmap} editable={user.role === 'TEACHER'} /> : <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
            {/* <img src={processing} alt="processing" height={600}/> */}
            <Progress animated value={100}
              style={{ width: '90%', marginBottom: '1rem' }}
            />
            <h3>El contenido aún se encuentra procesándose</h3>
            <h4>Por favor, vuelva más tarde</h4>
          </div>

          }



        </div>
      </Card>
    </div>
  </div>


};