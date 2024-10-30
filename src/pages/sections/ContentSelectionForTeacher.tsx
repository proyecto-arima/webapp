import { faRefresh, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, CardFooter, Table } from "reactstrap";
import Swal from "sweetalert2";
import ai_thinking from "../../assets/images/ai_thinking.gif";
import audio from "../../assets/images/audio.png";
import game from "../../assets/images/game.png";
import map from "../../assets/images/map.png";
import summmary from "../../assets/images/summary.png";
import { get, patch, post } from "../../utils/network";
import PageWrapper from "../../components/PageWrapper";

export interface IContent {
  id: string;
  title: string;
  publicationType: string;
  presignedUrl: string;
  status: string;
  generated: any[];
}

const contents = [
  {
    title: 'Resumen',
    image: summmary,
    url: 'summary',
    type: 'Asimilador',
  },
  {
    title: 'Juego',
    image: game,
    url: 'game/edit',
    type: 'Convergente',
  },
  {
    title: 'Audio',
    image: audio,
    url: 'audio/edit',
    type: 'Acomodador',
  },
  {
    title: 'Mapa mental',
    image: map,
    url: 'map',
    type: 'Divergente',
  }
]

export default function ContentSelectionForTeacher() {

  const { courseId, sectionId, contentId } = useParams<{ courseId: string, sectionId: string, contentId: string }>();
  const navigate = useNavigate();

  const [content, setContent] = useState<IContent>();

  const getContent = () => {
    get(`/contents/${contentId}`).then(res => res.json()).then(res => res.data).then((data: IContent) => {
      setContent(data);
      return data;
    }).then((data: IContent) => {
      if (data.status !== 'DONE') {
        setTimeout(() => getContent(), 20000);
      }
    });
  };

  const approved = content?.generated?.every(g => g.approved);

  const approveContent = () => {
    patch(`/contents/${contentId}/approval`, {
      mind_map: true,
      gamification: true,
      speech: true,
      summary: true,
    }).then(res => res.json()).then(res => {

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Contenido aprobado',
          text: 'El contenido fue aprobado correctamente'
        });
        getContent();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al aprobar el contenido'
        });
      }

    });
  }

  const regenerateContent = () => {
    Swal.fire({
      title: '¿Estás seguro que deseas regenerar todo el contenido?',
      text: 'Esta acción no se puede deshacer, y todo el contenido generado anteriormente se perderá',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
    }).then((result) => {
      if (!result.isConfirmed) return

      post(`/contents/${contentId}/regenerate`).then(res => res.json()).then(res => {
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Contenido enviado para regenerar',
            text: 'El contenido fue regenerado correctamente'
          });
          getContent();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al regenerar el contenido'
          });
        }
      })
    })
  };


  useEffect(() => {
    getContent();
  }, []);

  return (
    <PageWrapper title="Gestión del contenido generado">
      <p style={{
        textAlign: 'left',
        marginBottom: '2rem',
        color: '#6b7280',
        fontSize: '2vmin',
      }}>
        Acá podés visualizar y gestionar el contenido generado por ADAPTARIA para tus estudiantes en los cuatro formatos propuestos para cada estilo de aprendizaje <br />
        Como docente, podés editar, aprobar o regenerar el contenido generado por nosotros.
        Seleccioná el contenido que querés visualizar o gestionar. <br />
        Tus estudiantes, podrán ver el contenido que les fue asignado según el estilo de aprendizaje que hayan obtenido con el Test de Kolb
      </p>
      {content?.status === 'DONE' ? <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
          height: '100%',
          flexWrap: 'wrap',
        }}
      >
        <Table>
          <thead>
            <tr>
              <th>Contenido</th>
              <th style={{
                textAlign: 'center',
              }}>Tipo de Aprendizaje</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contents.map(c => (
              <tr key={c.url}>
                <td style={{
                  
                }}>
                  <img src={c.image} alt={c.title} style={{
                    width: '7vmin',
                    marginRight: '1rem',
                  }} />
                  {c.title}
                </td>

                <td style={{
                  verticalAlign: 'middle',
                  textAlign: 'center',
                }}>
                <span>{c.type}</span>
                </td>
                <td style={{
                  verticalAlign: 'middle',
                }}>
                  <button className="btn-purple-1"
                    onClick={() => {
                      navigate(`/courses/${courseId}/sections/${sectionId}/content/${contentId}/${c.url}`);
                    }}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div
          className="d-flex justify-content-end w-100 mt-3"
        >
          <div className="d-flex flex-column gap-3">

            <button className="btn-red-1" onClick={regenerateContent}>
              <FontAwesomeIcon icon={faRefresh} />
              {' '}
              Regenerar
            </button>
            {!approved && <button className="btn-purple-1" onClick={approveContent}>
              <FontAwesomeIcon icon={faThumbsUp} />
              {' '}
              Aprobar
            </button>}


          </div>

        </div>
      </div> : <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
        {/* <img src={processing} alt="processing" height={600}/> */}
        <img src={ai_thinking} alt="placeholder" style={{
          width: '30rem',
        }} />
        <h3>El contenido aún se encuentra procesándose</h3>
        <h4>Por favor, vuelva más tarde</h4>
      </div>}
    </PageWrapper>
  );
}