import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Card, Progress } from "reactstrap";
import { RootState } from "../../../redux/store";
import { get, patch } from "../../../utils/network";
import './GeneratedContentView.css';
import MarkmapHooks from './utils/MarkmapHooks';

import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import Reactions from "../../../components/Reactions";
import PageWrapper from "../../../components/PageWrapper";

interface IGenerated {
  type: string;
  content: string;
  title: string;
}

export interface IContent {
  id: string;
  title: string;
  generated: IGenerated[];
}

export const GeneratedContentView = () => {

  const { contentId } = useParams<{ contentId: string }>();
  const [markmap, setMarkmap] = useState<IGenerated>();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    get(`/contents/${contentId}/mindmap`).then(res => res.json()).then(res => res.data).then((data: IGenerated) => setMarkmap(data));
  }, []);

  const onChange = (newContent: string) => {
    if (!newContent || !markmap) return;
    setMarkmap({ ...markmap, content: newContent });
  };

  const saveChanges = () => {
    patch(`/contents/${contentId}/mindmap`, {
      newContent: markmap?.content,
    }).then(res => res.json()).then(res => {
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Contenido actualizado',
          text: 'El contenido fue actualizado correctamente'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el contenido'
        })
      }
    }
    );
  };


  return <PageWrapper title="Mapa mental">
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      gap: '1rem',
    }}>
      <h3>{markmap?.title}</h3>
      {markmap ? <MarkmapHooks onChange={onChange} text={markmap.content} editable={user.role === 'TEACHER'} /> : <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
        {/* <img src={processing} alt="processing" height={600}/> */}
        <Progress animated value={100}
          style={{ width: '90%', marginBottom: '1rem' }}
        />
        <h3>El contenido aún se encuentra procesándose</h3>
        <h4>Por favor, vuelva más tarde</h4>
      </div>

      }



    </div>
    {user.role === 'TEACHER' && <div
      className="d-flex justify-content-end w-100 mt-3"
    >
      <button className="btn-purple-1" onClick={saveChanges}>
        <FontAwesomeIcon icon={faSave} />
        {' '}
        Guardar
      </button>


    </div>}
    {user.role === 'STUDENT' && <Reactions />}
  </PageWrapper>


};